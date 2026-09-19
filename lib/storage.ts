import { ClockSettings } from './types';

const STORAGE_KEY = 'smart_clock_settings_v1';

export const DEFAULT_SETTINGS: ClockSettings = {
  format12h: false,
  showSeconds: true,
  displayMode: 'hybrid',
  showDate: true,
  theme: 'dark',
  analogStyle: 'modern',
  autoDimTimeout: 60, // 1 minute
  hideControls: false,
  ambientMode: false,
  tempUnit: 'C',
  location: {
    name: 'Phnom Penh, Cambodia',
    latitude: 11.5564,
    longitude: 104.9282,
    autoDetect: true,
  },
  timezones: [
    { id: '1', label: 'PHNOM PENH', timezone: 'Asia/Phnom_Penh' },
    { id: '2', label: 'TOKYO', timezone: 'Asia/Tokyo' },
    { id: '3', label: 'LONDON', timezone: 'Europe/London' },
    { id: '4', label: 'NEW YORK', timezone: 'America/New_York' },
  ],
  alarms: [],
  wakeLockEnabled: true,
};

export function loadSettings(): ClockSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      location: { ...DEFAULT_SETTINGS.location, ...(parsed.location || {}) },
      timezones: Array.isArray(parsed.timezones) ? parsed.timezones : DEFAULT_SETTINGS.timezones,
      alarms: Array.isArray(parsed.alarms) ? parsed.alarms : DEFAULT_SETTINGS.alarms,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ClockSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}
