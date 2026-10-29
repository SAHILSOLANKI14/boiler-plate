# Usage

## Environment

Copy `.env.example` to `.env`. The app reads these at startup:

| Name | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | API origin, with no trailing slash required |
| `VITE_API_KEY` | Sent on every request as `x-api-key` |
| `VITE_API_TIMEOUT` | Request timeout in milliseconds |

Restart the dev server after changing them. Vite only loads env values when it starts.

```bash
npm run dev
npm run build
npm run lint
```

## API

Hooks live in `@/api-config/useApi`. Call them inside `ApiConfigProvider`, which `src/main.tsx` already mounts.

### Add an endpoint

Paths are declared in `src/api-config/api.config.ts`. The client methods take that key, not a raw URL.

```ts
export interface ApiEndpoints {
  login: string;
  getUserProfile: string;
  createOrder: string;
}

export const apiEndpoints: ApiEndpoints = {
  login: '/login',
  getUserProfile: '/user/profile',
  createOrder: '/orders',
};
```

`useApiUrl('getUserProfile')` returns the full URL, for example `https://example.com/user/profile`.

### Call it

```tsx
import { useState } from 'react';

import { useApi, useAuth } from '@/api-config/useApi';

type Profile = {
  name: string;
};

export function ProfilePanel() {
  const api = useApi();
  const { isAuthenticated, clearSession } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  async function signIn() {
    const result = await api.login({ email: 'a@example.com', password: 'secret' });
    if (!result.ok) {
      return;
    }
  }

  async function loadProfile() {
    const result = await api.get<Profile>('getUserProfile', {
      query: { id: 12, active: true },
    });
    if (!result.ok) {
      return;
    }
    setProfile(result.data);
  }

  return (
    <section>
      {isAuthenticated ? (
        <button type="button" onClick={() => void loadProfile()}>
          Load profile
        </button>
      ) : (
        <button type="button" onClick={() => void signIn()}>
          Sign in
        </button>
      )}
      {profile ? <p>{profile.name}</p> : null}
      {isAuthenticated ? (
        <button type="button" onClick={clearSession}>
          Sign out
        </button>
      ) : null}
    </section>
  );
}
```

### Query and body

`query` becomes the URL query string. `null` and `undefined` values are omitted.

The JSON body is the second argument of `post`, `put`, and `patch`. `get` and `delete` do not take a body.

```tsx
await api.get('getUserProfile', {
  query: { id: 12, active: true },
});
// GET /user/profile?id=12&active=true

await api.post('createOrder', { sku: 'a1', qty: 2 });
// POST /orders  { "sku": "a1", "qty": 2 }

await api.put('createOrder', { qty: 3 }, {
  query: { id: 12 },
});
// PUT /orders?id=12  { "qty": 3 }

await api.patch('createOrder', { qty: 4 }, { query: { id: 12 } });
await api.delete('createOrder', { query: { id: 12 } });
```

`request` takes the method and body in one options object:

```tsx
await api.request('createOrder', {
  method: 'POST',
  query: { source: 'web' },
  body: { sku: 'a1', qty: 2 },
});
```

Other options:

| Option | Use |
| --- | --- |
| `headers` | Extra headers for that call |
| `auth: false` | Do not send the bearer token. `login` already does this |
| `toast: false` | Do not show the error toast for that call |
| `signal` | `AbortSignal` to cancel the call |

### Result

Every call returns `ApiResult<T>`:

```ts
type ApiSuccess<T> = { ok: true; status: number; data: T };
type ApiFailure = { ok: false; status: number; code: string; message: string; details?: unknown };
```

Check `result.ok` before reading `data`. On failure, `code` and `message` come from the response body (`code`, `errorCode`, `error_code`, and `message`, `errorMessage`, `error_message`, `detail`, `title`, or `error`). Field errors are copied to `details`. A `2xx` body with `success: false`, `ok: false`, or `status: "error" | "fail" | "failed"` is also a failure.

If the body has a message, it is shown in an error toast. Pass `{ toast: false }` to skip that. A canceled or timed-out request has an empty message and does not toast.

### Login and the access cookie

`api.login(body)` posts to the `login` endpoint and does not send a bearer token. On success it stores the JWT from `jwt`, `jwtToken`, or `jwt_token`. Those fields may also sit under `data`.

The token is kept in the Redux session. A saga writes it to the `boilerplate-access` cookie and reads that cookie back when the app starts. Later calls send `Authorization: Bearer …` plus `x-api-key`. A `401` clears the session. `clearSession` from `useAuth` clears it too.

```tsx
const { isAuthenticated, accessToken, clearSession } = useAuth();
```

`isAuthenticated` is true when the session holds a token. `accessToken` is that token, or `null`.

## Routes

Each module exports a route list. `src/routes/routes.ts` collects them.

```ts
// src/modules/orders/orderRoutes.ts
import Orders from './orders';

export const orderRoutes = [{ path: '/orders', page: Orders }];
```

```ts
// src/routes/routes.ts
import { dashRoutes } from '@/modules/dashboard/dashRoutes';
import { orderRoutes } from '@/modules/orders/orderRoutes';

export const routes = [...dashRoutes, ...orderRoutes];
```

`path: '/'` is the index page inside the layout. Any other path is nested under that layout. An unknown URL renders "Page not found".

The page component is the default export of the screen. The layout renders it through `<Outlet />`.

## Sidebar

Sidebar links are separate from routes. Edit `src/layouts/sidebar/navList.json`:

```json
{
  "items": [
    { "name": "Home", "path": "/", "icon": "house" },
    { "name": "Orders", "path": "/orders", "icon": "box" }
  ]
}
```

`path` is a React Router path. `icon` is a Font Awesome icon name. A route does not appear in the sidebar until it is listed here.

## Theme

`useTheme` is available under `ThemeProvider`.

```tsx
import { useTheme } from '@/theme/theme';

const { palette, mode, setPalette, setMode, toggleMode } = useTheme();

setPalette('teal');
setMode('dark');
toggleMode();
```

Palettes are `blue`, `violet`, `teal`, `rose`, and `amber`. `mode` is `light` or `dark`. The choice is stored in `localStorage` under `boilerplate-theme`. The default palette is violet, and the default mode follows the system setting.

Colors are CSS variables:

| Token | Variable |
| --- | --- |
| background default / surface / inverse | `--background-default`, `--background-surface`, `--background-inverse` |
| text primary / secondary / inverse | `--text-primary`, `--text-secondary`, `--text-inverse` |
| brand primary / primary-hover / accent | `--brand-primary`, `--brand-primary-hover`, `--brand-accent` |
| feedback success / error | `--feedback-success`, `--feedback-error` |

```css
.panel {
  background: var(--background-surface);
  color: var(--text-primary);
}
```

## Toast

Failed API calls toast on their own. For any other message:

```tsx
import { dismissToast, pushToast } from '@/shared/components';

const id = pushToast({ tone: 'success', message: 'Saved' });
dismissToast(id);
```

`tone` is `error`, `success`, or `info`. A toast leaves after 6 seconds. At most 4 are visible. `ToastViewport` is rendered by `ApiConfigProvider`.

## Icons

```tsx
import { FontAwesomeIcon } from '@/shared/components';

<FontAwesomeIcon icon="house" />
<FontAwesomeIcon icon="spinner" spin />
<FontAwesomeIcon icon="github" variant="brands" size="lg" title="GitHub" />
```

`variant` is `solid` (default), `regular`, `light`, or `brands`. `icon` is the Font Awesome name, with or without the `fa-` prefix. `fixedWidth`, `spin`, and `pulse` match the usual Font Awesome helpers.
