import { useEffect, useRef, useState, useCallback } from 'react';

interface WakeLockSentinelLike {
  release(): Promise<void>;
  addEventListener?(type: string, listener: () => void): void;
}

export function useWakeLock(enabled: boolean = true) {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null);

  const requestWakeLock = useCallback(async () => {
    if (typeof window === 'undefined' || !('wakeLock' in navigator)) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    if (!enabled) return;

    try {
      const nav = navigator as unknown as { wakeLock: { request(type: string): Promise<WakeLockSentinelLike> } };
      wakeLockRef.current = await nav.wakeLock.request('screen');
      setIsLocked(true);

      if (wakeLockRef.current.addEventListener) {
        wakeLockRef.current.addEventListener('release', () => {
          setIsLocked(false);
          wakeLockRef.current = null;
        });
      }
    } catch {
      setIsLocked(false);
    }
  }, [enabled]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch {}
      wakeLockRef.current = null;
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        requestWakeLock();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      releaseWakeLock();
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, requestWakeLock, releaseWakeLock]);

  return { isSupported, isLocked, requestWakeLock, releaseWakeLock };
}
