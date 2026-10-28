export type ApiSuccess<T> = {
  ok: true;
  status: number;
  data: T;
};

export type ApiFailure = {
  ok: false;
  status: number;
  code: string;
  message: string;
  details?: unknown;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

const messageLimit = 280;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cleanMessage(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith('<')) {
    return null;
  }
  return trimmed.slice(0, messageLimit);
}

function firstString(record: Record<string, unknown>, keys: readonly string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string') {
      const message = cleanMessage(value);
      if (message) {
        return message;
      }
    }
  }
  return null;
}

function readFieldMessage(errors: unknown): string | null {
  if (typeof errors === 'string') {
    return cleanMessage(errors);
  }

  if (Array.isArray(errors)) {
    for (const item of errors) {
      const message = readFieldMessage(item);
      if (message) {
        return message;
      }
    }
    return null;
  }

  if (!isRecord(errors)) {
    return null;
  }

  const direct = firstString(errors, ['message', 'detail']);
  if (direct) {
    return direct;
  }

  for (const value of Object.values(errors)) {
    const message = readFieldMessage(value);
    if (message) {
      return message;
    }
  }

  return null;
}

function readMessage(body: unknown): string | null {
  if (typeof body === 'string') {
    return cleanMessage(body);
  }
  if (!isRecord(body)) {
    return null;
  }

  const direct = firstString(body, ['message', 'errorMessage', 'error_message', 'detail', 'title']);
  if (direct) {
    return direct;
  }

  if (typeof body.error === 'string') {
    return cleanMessage(body.error);
  }

  if (isRecord(body.error)) {
    const nested = firstString(body.error, ['message', 'detail']);
    if (nested) {
      return nested;
    }
  }

  return readFieldMessage(body.errors);
}

function readCodeValue(record: Record<string, unknown>): string | null {
  for (const key of ['code', 'errorCode', 'error_code'] as const) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
  }
  return null;
}

function readCode(body: unknown): string | null {
  if (!isRecord(body)) {
    return null;
  }

  const direct = readCodeValue(body);
  if (direct) {
    return direct;
  }

  if (isRecord(body.error)) {
    return readCodeValue(body.error);
  }

  return null;
}

export function createApiFailure(status: number, body: unknown, statusText = '', details?: unknown): ApiFailure {
  const statusMessage = status >= 400 ? cleanMessage(statusText) : null;
  const failure: ApiFailure = {
    ok: false,
    status,
    code: readCode(body) ?? '',
    message: readMessage(body) ?? statusMessage ?? '',
  };

  if (details !== undefined) {
    failure.details = details;
  }

  return failure;
}

function isApplicationFailure(body: Record<string, unknown>): boolean {
  if (body.success === false || body.ok === false) {
    return true;
  }

  if (body.status === 'error' || body.status === 'fail' || body.status === 'failed') {
    return true;
  }

  return body.status === false && (readMessage(body) !== null || readCode(body) !== null);
}

export function interpretResponse<T>(status: number, body: unknown, statusText = ''): ApiResult<T> {
  if (status >= 200 && status < 300 && isRecord(body) && isApplicationFailure(body)) {
    return createApiFailure(status, body, statusText, body.errors);
  }

  if (status >= 200 && status < 300) {
    return { ok: true, status, data: body as T };
  }

  const details = isRecord(body) && 'errors' in body ? body.errors : undefined;
  return createApiFailure(status, body, statusText, details);
}

export function isAuthFailure(status: number): boolean {
  return status === 401;
}
