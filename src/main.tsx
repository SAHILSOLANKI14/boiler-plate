import { createRoot } from 'react-dom/client';

import { ApiConfigProvider } from '@/api-config/apiConfig';
import App from '@/App.tsx';
import { applyStoredTheme, ThemeProvider } from '@/theme/theme';

import './index.css';

applyStoredTheme();

createRoot(document.getElementById('root')!).render(
  <ApiConfigProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ApiConfigProvider>,
);
