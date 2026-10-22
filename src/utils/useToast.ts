import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Shared Leak-Free Toast Hook (BUG-101, BUG-110)
 * Manages transient toast notifications with automatic timeout cleanup on re-trigger and unmount.
 */
export function useToast(durationMs: number = 3500): {
  toastMessage: string | null;
  showToast: (message: string) => void;
  dismissToast: () => void;
} {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToastMessage(null);
  }, []);

  const showToast = useCallback(
    (message: string) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      setToastMessage(message);
      timerRef.current = setTimeout(() => {
        setToastMessage(null);
        timerRef.current = null;
      }, durationMs);
    },
    [durationMs]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { toastMessage, showToast, dismissToast };
}
