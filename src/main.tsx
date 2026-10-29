import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { ApiConfigProvider } from '@/api-config/apiConfig';
import App from '@/App.tsx';
import { store } from '@/store/store';
import { applyStoredTheme, ThemeProvider } from '@/theme/theme';

import './index.css';

applyStoredTheme();

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ApiConfigProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ApiConfigProvider>
  </Provider>,
);
