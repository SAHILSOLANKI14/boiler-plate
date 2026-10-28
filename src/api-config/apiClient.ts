import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { pushToast } from '@/shared/toast/toastStore';

import type { ApiConfig, ApiEndpoints } from './api.config';
import { createApiFailure, interpretResponse, isAuthFailure, type ApiResult } from './apiError';
import { clearSession, getSession, readAuthSessionFromBody, setSession } from './authSession';

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiQuery = Record<string, string | number | boolean | null | undefined>;

export type ApiRequestOptions = {
  method?: ApiMethod;
  body?: unknown;
  query?: ApiQuery;
  headers?: Record<string, string>;
  auth?: boolean;
  toast?: boolean;
  signal?: AbortSignal;
};

const apiKeyHeader = 'x-api-key';

function cleanParams(query: ApiQuery | undefined): Record<string, string | number | boolean> | undefined {
  if (!query) {
    return undefined;
  }

  const params: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      params[key] = value;
    }
  }
  return params;
}

function fromAxiosError<T>(error: AxiosError): ApiResult<T> {
  if (!error.response || error.code === AxiosError.ERR_CANCELED || error.code === AxiosError.ECONNABORTED) {
    return createApiFailure(0, null);
  }
  return interpretResponse<T>(error.response.status, error.response.data, error.response.statusText);
}

function finish<T>(result: ApiResult<T>, toast: boolean | undefined): ApiResult<T> {
  const message = !result.ok ? result.message || result.code : '';
  if (message && toast !== false) {
    pushToast({ tone: 'error', message });
  }
  return result;
}

function createHttp(config: ApiConfig): AxiosInstance {
  const http = axios.create({
    baseURL: config.baseUrl.replace(/\/$/, ''),
    timeout: config.timeout,
    headers: {
      Accept: 'application/json',
      [apiKeyHeader]: config.apiKey,
    },
  });

  http.interceptors.request.use((request: InternalAxiosRequestConfig) => {
    if (request.skipAuth) {
      return request;
    }

    const token = getSession()?.accessToken;
    if (token && !request.headers.has('Authorization')) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  });

  return http;
}

async function send<T>(http: AxiosInstance, config: ApiConfig, endpoint: keyof ApiEndpoints, options: ApiRequestOptions): Promise<ApiResult<T>> {
  try {
    const response = await http.request<T>({
      url: config.endpoints[endpoint],
      method: options.method ?? 'GET',
      data: options.body,
      params: cleanParams(options.query),
      headers: options.headers,
      signal: options.signal,
      skipAuth: options.auth === false,
    });
    return interpretResponse<T>(response.status, response.data, response.statusText);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return fromAxiosError<T>(error);
    }
    return createApiFailure(0, null);
  }
}

export type ApiClient = {
  request: <T>(endpoint: keyof ApiEndpoints, options?: ApiRequestOptions) => Promise<ApiResult<T>>;
  get: <T>(endpoint: keyof ApiEndpoints, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => Promise<ApiResult<T>>;
  post: <T>(endpoint: keyof ApiEndpoints, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => Promise<ApiResult<T>>;
  put: <T>(endpoint: keyof ApiEndpoints, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => Promise<ApiResult<T>>;
  patch: <T>(endpoint: keyof ApiEndpoints, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => Promise<ApiResult<T>>;
  delete: <T>(endpoint: keyof ApiEndpoints, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => Promise<ApiResult<T>>;
  login: <T>(body: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body' | 'auth'>) => Promise<ApiResult<T>>;
};

export function createApiClient(config: ApiConfig): ApiClient {
  const http = createHttp(config);

  async function request<T>(endpoint: keyof ApiEndpoints, options: ApiRequestOptions = {}): Promise<ApiResult<T>> {
    const result = await send<T>(http, config, endpoint, options);
    if (!result.ok && options.auth !== false && isAuthFailure(result.status)) {
      clearSession();
    }
    return finish(result, options.toast);
  }

  return {
    request,
    get(endpoint, options) {
      return request(endpoint, { ...options, method: 'GET' });
    },
    post(endpoint, body, options) {
      return request(endpoint, { ...options, method: 'POST', body });
    },
    put(endpoint, body, options) {
      return request(endpoint, { ...options, method: 'PUT', body });
    },
    patch(endpoint, body, options) {
      return request(endpoint, { ...options, method: 'PATCH', body });
    },
    delete(endpoint, options) {
      return request(endpoint, { ...options, method: 'DELETE' });
    },
    async login<T>(body: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body' | 'auth'>) {
      const result = await request<T>('login', { ...options, method: 'POST', body, auth: false });
      if (result.ok) {
        const session = readAuthSessionFromBody(result.data);
        if (session) {
          setSession(session);
        }
      }
      return result;
    },
  };
}
