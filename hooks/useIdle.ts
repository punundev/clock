import { useState, useEffect, useCallback, useRef } from 'react';

export function useIdle(timeoutSeconds: number = 60) {
  const [isIdle, setIsIdle] = useState<boolean>(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    setIsIdle(false);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    if (timeoutSeconds > 0) {
      timeoutIdRef.current = setTimeout(() => {
        setIsIdle(true);
      }, timeoutSeconds * 1000);
    }
  }, [timeoutSeconds]);

  useEffect(() => {
    resetTimer();

    const events = ['mousemove', 'mousedown', 'touchstart', 'touchmove', 'keydown', 'scroll', 'click'];
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(evt => {
      window.addEventListener(evt, handleActivity, { passive: true });
    });

    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      events.forEach(evt => {
        window.removeEventListener(evt, handleActivity);
      });
    };
  }, [resetTimer]);

  return { isIdle, resetTimer };
}
