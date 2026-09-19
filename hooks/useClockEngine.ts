import { useState, useEffect } from 'react';

export function useClockEngine() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateClock = () => {
      const current = new Date();
      setNow(current);

      // Align tick precisely to the next second boundary
      const delay = 1000 - current.getMilliseconds();
      timeoutId = setTimeout(updateClock, delay);
    };

    updateClock();

    // Immediately recalculate time when tab becomes visible or wakes up
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setNow(new Date());
      }
    };

    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, []);

  return now;
}
