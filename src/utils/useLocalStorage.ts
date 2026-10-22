import { useState, useEffect, useRef } from 'react';

const LOCAL_STORAGE_SYNC_EVENT = 'enology-localstorage-sync';

interface LocalStorageSyncDetail {
  key: string;
  serialized: string;
  value: unknown;
}

/**
 * Custom React hook for auto-saving form values and UI states to LocalStorage
 * with same-window ('enology-localstorage-sync') and cross-tab ('storage') synchronization.
 */
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const readKey = (targetKey: string, fallback: T): T => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return fallback;
    }
    try {
      const saved = localStorage.getItem(targetKey);
      if (saved !== null) {
        return JSON.parse(saved) as T;
      }
    } catch (e) {
      console.warn(`Error reading LocalStorage key "${targetKey}":`, e);
    }
    return fallback;
  };

  const [state, setState] = useState<T>(() => readKey(key, defaultValue));
  const prevKeyRef = useRef<string>(key);
  const lastSerializedRef = useRef<string>(JSON.stringify(state));

  useEffect(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    if (prevKeyRef.current !== key) {
      prevKeyRef.current = key;
      const nextVal = readKey(key, defaultValue);
      lastSerializedRef.current = JSON.stringify(nextVal);
      setState(nextVal);
      return;
    }
    try {
      const serialized = JSON.stringify(state);
      const currentStored = localStorage.getItem(key);
      if (lastSerializedRef.current !== serialized || currentStored !== serialized) {
        lastSerializedRef.current = serialized;
        localStorage.setItem(key, serialized);
        window.dispatchEvent(
          new CustomEvent<LocalStorageSyncDetail>(LOCAL_STORAGE_SYNC_EVENT, {
            detail: { key, serialized, value: state }
          })
        );
      }
    } catch (e) {
      console.warn(`Error writing LocalStorage key "${key}":`, e);
    }
  }, [key, state]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleSameWindowSync = (e: Event) => {
      const customEvent = e as CustomEvent<LocalStorageSyncDetail>;
      const detail = customEvent.detail;
      if (!detail || detail.key !== key) return;
      try {
        const incomingSerialized =
          typeof detail.serialized === 'string'
            ? detail.serialized
            : JSON.stringify(detail.value);
        if (incomingSerialized !== lastSerializedRef.current) {
          lastSerializedRef.current = incomingSerialized;
          setState(
            detail.value !== undefined
              ? (detail.value as T)
              : (JSON.parse(incomingSerialized) as T)
          );
        }
      } catch (err) {
        console.warn(`Error syncing LocalStorage key "${key}":`, err);
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        if (e.newValue !== lastSerializedRef.current) {
          lastSerializedRef.current = e.newValue;
          setState(JSON.parse(e.newValue) as T);
        }
      } catch (err) {
        console.warn(`Error handling cross-tab storage event for "${key}":`, err);
      }
    };

    window.addEventListener(LOCAL_STORAGE_SYNC_EVENT, handleSameWindowSync);
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener(LOCAL_STORAGE_SYNC_EVENT, handleSameWindowSync);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [key]);

  return [state, setState];
}

