import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';

import { apiEndpoints, apiUrl, type ApiConfig, type ApiEndpoints } from './api.config';
import { createApiClient, type ApiClient } from './apiClient';
import { clearSession, getSession, setSession, subscribeSession, type AuthSession } from './authSession';

export type { ApiFailure, ApiResult, ApiSuccess } from './apiError';
export type { ApiRequestOptions } from './apiClient';
export type { AuthSession } from './authSession';

function readEnv(name: 'VITE_API_BASE_URL' | 'VITE_API_KEY' | 'VITE_API_TIMEOUT'): string {
  const value = import.meta.env[name];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing ${name}. Add it to the .env file in the project root.`);
  }
  return value;
}

function readTimeout(value: string): number {
  const timeout = Number(value);
  if (!Number.isFinite(timeout) || timeout <= 0) {
    throw new Error('VITE_API_TIMEOUT must be a positive number of milliseconds.');
  }
  return timeout;
}

export const initialApiConfig: ApiConfig = {
  baseUrl: readEnv('VITE_API_BASE_URL'),
  apiKey: readEnv('VITE_API_KEY'),
  timeout: readTimeout(readEnv('VITE_API_TIMEOUT')),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  endpoints: apiEndpoints,
};

export const ApiConfigContext = createContext<ApiConfig | undefined>(undefined);

export function useApiConfig(): ApiConfig {
  const context = useContext(ApiConfigContext);
  if (!context) {
    throw new Error('useApiConfig must be used within an ApiConfigProvider');
  }
  return context;
}

export function useApiUrl(endpoint: keyof ApiEndpoints): string {
  return apiUrl(useApiConfig(), endpoint);
}

export function useApi(): ApiClient {
  const config = useApiConfig();
  return useMemo(() => createApiClient(config), [config]);
}

export function useAuth(): {
  isAuthenticated: boolean;
  accessToken: string | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
} {
  const session = useSyncExternalStore(subscribeSession, getSession);

  return {
    isAuthenticated: session !== null,
    accessToken: session?.accessToken ?? null,
    setSession,
    clearSession,
  };
}
