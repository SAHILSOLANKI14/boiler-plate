import { createContext, useCallback, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectAccessToken, sessionCleared, sessionSet } from '@/store/session/sessionSlice';
import type { AppDispatch } from '@/store/store';

import { apiEndpoints, apiUrl, type ApiConfig, type ApiEndpoints } from './api.config';
import { createApiClient, type ApiClient } from './apiClient';
import type { AuthSession } from './authSession';

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
  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch<AppDispatch>();
  const setSession = useCallback(
    (session: AuthSession) => {
      dispatch(sessionSet(session.accessToken));
    },
    [dispatch],
  );
  const clearSession = useCallback(() => {
    dispatch(sessionCleared());
  }, [dispatch]);

  return {
    isAuthenticated: accessToken !== null,
    accessToken,
    setSession,
    clearSession,
  };
}
