import { useState, useEffect } from 'react';

interface BatteryManager {
  charging: boolean;
  level: number;
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
}

export function useBattery() {
  const [batteryState, setBatteryState] = useState<{
    supported: boolean;
    level: number | null;
    charging: boolean | null;
  }>({
    supported: false,
    level: null,
    charging: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const nav = navigator as unknown as { getBattery?: () => Promise<BatteryManager> };
      if (!nav || typeof nav.getBattery !== 'function') {
        setBatteryState({ supported: false, level: null, charging: null });
        return;
      }

      let batteryObj: BatteryManager | null = null;

      const updateBattery = () => {
        if (batteryObj) {
          setBatteryState({
            supported: true,
            level: Math.round(batteryObj.level * 100),
            charging: batteryObj.charging,
          });
        }
      };

      nav.getBattery()
        .then(bat => {
          batteryObj = bat;
          updateBattery();

          bat.addEventListener('levelchange', updateBattery);
          bat.addEventListener('chargingchange', updateBattery);
        })
        .catch(() => {
          setBatteryState({ supported: false, level: null, charging: null });
        });

      return () => {
        if (batteryObj) {
          batteryObj.removeEventListener('levelchange', updateBattery);
          batteryObj.removeEventListener('chargingchange', updateBattery);
        }
      };
    } catch {
      setBatteryState({ supported: false, level: null, charging: null });
    }
  }, []);

  return batteryState;
}
