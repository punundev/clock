export type ThemeName = 'dark' | 'midnight' | 'light' | 'oled' | 'aurora' | 'retro';

export type DisplayMode = 'digital' | 'analog' | 'hybrid';

export type AnalogStyle = 'classic' | 'minimal' | 'modern' | 'dark' | 'light';

export type AutoDimTimeout = 0 | 30 | 60 | 300 | 600; // in seconds, 0 = OFF

export interface WeatherData {
  temperature: number;
  condition: string;
  conditionCode: number; // Open-Meteo weather code
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  locationName: string;
  sunrise: string;
  sunset: string;
  lastUpdated: number;
  isOffline?: boolean;
}

export interface AlarmItem {
  id: string;
  time: string; // HH:mm format (24h)
  label: string;
  enabled: boolean;
  repeatDays: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
}

export interface TimezoneItem {
  id: string;
  label: string;
  timezone: string; // IANA timezone e.g. "Asia/Phnom_Penh"
}

export interface ClockSettings {
  format12h: boolean;
  showSeconds: boolean;
  displayMode: DisplayMode;
  showDate: boolean;
  theme: ThemeName;
  analogStyle: AnalogStyle;
  autoDimTimeout: AutoDimTimeout;
  hideControls: boolean;
  ambientMode: boolean;
  tempUnit: 'C' | 'F';
  location: {
    name: string;
    latitude?: number;
    longitude?: number;
    autoDetect: boolean;
  };
  timezones: TimezoneItem[];
  alarms: AlarmItem[];
  wakeLockEnabled: boolean;
}
