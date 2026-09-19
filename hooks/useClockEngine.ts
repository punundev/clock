import { useState, useEffect } from 'react';

export function useClockEngine() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    let lastSecond = -1;

    const tick = () => {
      const current = new Date();
      const sec = current.getSeconds();
      if (sec !== lastSecond) {
        lastSecond = sec;
        setNow(current);
      }
    };

    tick();

    // 200ms poll interval prevents iOS Safari recursive setTimeout throttling & freezing
    const intervalId = setInterval(tick, 200);

    const handleVisibility = () => {
      const current = new Date();
      lastSecond = current.getSeconds();
      setNow(current);
    };

    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', handleVisibility);
    window.addEventListener('focus', handleVisibility);
    window.addEventListener('touchstart', handleVisibility, { passive: true });

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      window.removeEventListener('touchstart', handleVisibility);
    };
  }, []);

  return now;
}
