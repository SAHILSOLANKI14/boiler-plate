import { createContext, useContext, type ReactNode } from 'react';

import { apiEndpoints, apiUrl, type ApiConfig, type ApiEndpoints } from './api.config';

function readEnv(name: 'VITE_API_BASE_URL' | 'VITE_API_TIMEOUT'): string {
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

const initialApiConfig: ApiConfig = {
  baseUrl: readEnv('VITE_API_BASE_URL'),
  timeout: readTimeout(readEnv('VITE_API_TIMEOUT')),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  endpoints: apiEndpoints,
};

const ApiConfigContext = createContext<ApiConfig | undefined>(undefined);

type ApiConfigProviderProps = {
  children: ReactNode;
};

export function ApiConfigProvider({ children }: ApiConfigProviderProps) {
  return <ApiConfigContext.Provider value={initialApiConfig}>{children}</ApiConfigContext.Provider>;
}

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
