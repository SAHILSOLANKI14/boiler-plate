import Cookies from 'js-cookie';

const accessCookie = 'boilerplate-access';
const tokenKeys = ['jwt', 'jwtToken', 'jwt_token'] as const;

const cookies = Cookies.withAttributes({
  path: '/',
  sameSite: 'lax',
  secure: typeof location !== 'undefined' && location.protocol === 'https:',
});

export type AuthSession = {
  accessToken: string;
};

type SessionListener = () => void;

const listeners = new Set<SessionListener>();

let session = readStoredSession();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readToken(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }

  for (const key of tokenKeys) {
    const token = value[key];
    if (typeof token === 'string' && token.trim()) {
      return token.trim();
    }
  }

  return null;
}

export function readAuthSessionFromBody(body: unknown): AuthSession | null {
  const direct = readToken(body);
  if (direct) {
    return { accessToken: direct };
  }
  if (!isRecord(body)) {
    return null;
  }

  const nested = readToken(body.data);
  return nested ? { accessToken: nested } : null;
}

function readStoredSession(): AuthSession | null {
  const accessToken = cookies.get(accessCookie)?.trim();
  return accessToken ? { accessToken } : null;
}

function sameSession(current: AuthSession | null, next: AuthSession | null): boolean {
  if (current === next) {
    return true;
  }
  if (!current || !next) {
    return false;
  }
  return current.accessToken === next.accessToken;
}

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function getSession(): AuthSession | null {
  return session;
}

export function subscribeSession(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setSession(next: AuthSession | null): void {
  if (sameSession(session, next)) {
    return;
  }

  session = next;
  if (next) {
    cookies.set(accessCookie, next.accessToken);
  } else {
    cookies.remove(accessCookie);
  }
  notify();
}

export function clearSession(): void {
  setSession(null);
}
