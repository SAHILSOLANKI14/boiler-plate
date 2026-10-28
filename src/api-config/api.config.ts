export interface ApiEndpoints {
  login: string;
  getUserProfile: string;
  getProducts: string;
}

export const apiEndpoints: ApiEndpoints = {
  login: '/login',
  getUserProfile: '/user/profile',
  getProducts: '/products',
};

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
  endpoints: ApiEndpoints;
}

export function apiUrl(config: ApiConfig, endpoint: keyof ApiEndpoints): string {
  const base = config.baseUrl.replace(/\/$/, '');
  const path = config.endpoints[endpoint].replace(/^\//, '');
  return `${base}/${path}`;
}
