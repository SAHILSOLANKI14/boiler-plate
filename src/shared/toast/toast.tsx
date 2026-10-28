import { useSyncExternalStore } from 'react';

import { FontAwesomeIcon } from '@/shared/components/fontAwesomeIcon';

import { dismissToast, getToasts, subscribeToasts, type ToastTone } from './toastStore';
import './toast.css';

function toastIcon(tone: ToastTone): string {
  switch (tone) {
    case 'error':
      return 'circle-exclamation';
    case 'success':
      return 'circle-check';
    case 'info':
      return 'circle-info';
    default: {
      const exhaustive: never = tone;
      return exhaustive;
    }
  }
}

export function ToastViewport() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-viewport">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.tone}`} role={toast.tone === 'error' ? 'alert' : 'status'}>
          <FontAwesomeIcon className="toast-icon" icon={toastIcon(toast.tone)} fixedWidth />
          <p className="toast-message">{toast.message}</p>
          <button type="button" className="toast-dismiss" aria-label="Dismiss notification" onClick={() => dismissToast(toast.id)}>
            <FontAwesomeIcon icon="xmark" />
          </button>
        </div>
      ))}
    </div>
  );
}
