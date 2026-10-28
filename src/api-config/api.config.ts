export interface ApiEndpoints {
  login: string;
}

export const apiEndpoints: ApiEndpoints = {
  login: '/login',
};

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
  headers: Record<string, string>;
  endpoints: ApiEndpoints;
}

export function apiUrl(config: ApiConfig, endpoint: keyof ApiEndpoints): string {
  const base = config.baseUrl.replace(/\/$/, '');
  const path = config.endpoints[endpoint].replace(/^\//, '');
  return `${base}/${path}`;
}
