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

export function readAccessCookie(): string | null {
  const accessToken = cookies.get(accessCookie)?.trim();
  return accessToken ? accessToken : null;
}

export function writeAccessCookie(accessToken: string): void {
  cookies.set(accessCookie, accessToken);
}

export function clearAccessCookie(): void {
  cookies.remove(accessCookie);
}
