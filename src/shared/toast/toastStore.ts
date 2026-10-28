export type ToastTone = 'error' | 'success' | 'info';

export type ToastInput = {
  tone: ToastTone;
  message: string;
};

export type ToastRecord = ToastInput & {
  id: string;
};

type ToastListener = () => void;

const dismissMs = 6000;
const maxToasts = 4;

const listeners = new Set<ToastListener>();
const timers = new Map<string, number>();

let toasts: readonly ToastRecord[] = [];
let sequence = 0;

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function getToasts(): readonly ToastRecord[] {
  return toasts;
}

export function subscribeToasts(listener: ToastListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function dismissToast(id: string): void {
  const timer = timers.get(id);
  if (timer !== undefined) {
    window.clearTimeout(timer);
    timers.delete(id);
  }

  const next = toasts.filter((toast) => toast.id !== id);
  if (next.length === toasts.length) {
    return;
  }

  toasts = next;
  notify();
}

export function pushToast(input: ToastInput): string {
  sequence += 1;
  const id = `toast-${sequence}`;
  const dropped = toasts.length >= maxToasts ? toasts.slice(0, toasts.length - maxToasts + 1) : [];

  for (const toast of dropped) {
    const timer = timers.get(toast.id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timers.delete(toast.id);
    }
  }

  toasts = [...toasts.slice(dropped.length), { id, tone: input.tone, message: input.message }];
  timers.set(
    id,
    window.setTimeout(() => {
      dismissToast(id);
    }, dismissMs),
  );
  notify();
  return id;
}
