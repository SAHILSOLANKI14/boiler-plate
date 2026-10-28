import type { ReactNode } from 'react';

import { ToastViewport } from '@/shared/toast/toast';

import { ApiConfigContext, initialApiConfig } from './useApi';

type ApiConfigProviderProps = {
  children: ReactNode;
};

export function ApiConfigProvider({ children }: ApiConfigProviderProps) {
  return (
    <ApiConfigContext.Provider value={initialApiConfig}>
      {children}
      <ToastViewport />
    </ApiConfigContext.Provider>
  );
}
