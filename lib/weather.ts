import { WeatherData } from './types';

const WEATHER_CACHE_KEY = 'smart_clock_weather_cache';

const MOCK_WEATHER: WeatherData = {
  temperature: 29,
  condition: 'Partly Cloudy',
  conditionCode: 2,
  feelsLike: 32,
  humidity: 70,
  windSpeed: 12,
  locationName: 'Phnom Penh, Cambodia',
  sunrise: '05:54',
  sunset: '18:02',
  lastUpdated: Date.now(),
  isOffline: false,
};

const WEATHER_CODE_MAP: Record<number, string> = {
  0: 'Clear Sky',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing Rime Fog',
  51: 'Light Drizzle',
  53: 'Moderate Drizzle',
  55: 'Dense Drizzle',
  61: 'Slight Rain',
  63: 'Moderate Rain',
  65: 'Heavy Rain',
  71: 'Slight Snow',
  73: 'Moderate Snow',
  75: 'Heavy Snow',
  80: 'Rain Showers',
  81: 'Moderate Rain Showers',
  82: 'Violent Rain Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with Hail',
};

export function getWeatherConditionText(code: number): string {
  return WEATHER_CODE_MAP[code] || 'Partly Cloudy';
}

export async function fetchWeatherData(
  lat: number = 11.5564,
  lon: number = 104.9282,
  locationName: string = 'Phnom Penh'
): Promise<WeatherData> {
  if (typeof window === 'undefined') return MOCK_WEATHER;

  // Check cache first (cached for 30 minutes)
  try {
    const cachedRaw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (cachedRaw) {
      const cached: WeatherData = JSON.parse(cachedRaw);
      const isFresh = Date.now() - cached.lastUpdated < 30 * 60 * 1000;
      if (isFresh) return cached;
    }
  } catch {}

  if (!navigator.onLine) {
    return getCachedOrMockWeather('Offline - using cached data');
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=sunrise,sunset&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API request failed');

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const sunriseIso = daily?.sunrise?.[0] || '';
    const sunsetIso = daily?.sunset?.[0] || '';

    const formatSunTime = (isoStr: string) => {
      if (!isoStr) return '--:--';
      try {
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return '--:--';
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      } catch {
        return '--:--';
      }
    };

    const result: WeatherData = {
      temperature: Math.round(current.temperature_2m),
      condition: getWeatherConditionText(current.weather_code),
      conditionCode: current.weather_code,
      feelsLike: Math.round(current.apparent_temperature),
      humidity: Math.round(current.relative_humidity_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      locationName,
      sunrise: formatSunTime(sunriseIso),
      sunset: formatSunTime(sunsetIso),
      lastUpdated: Date.now(),
      isOffline: false,
    };

    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(result));
    return result;
  } catch {
    return getCachedOrMockWeather('Unable to update weather');
  }
}

function getCachedOrMockWeather(note?: string): WeatherData {
  try {
    const cachedRaw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      return { ...cached, isOffline: true };
    }
  } catch {}
  return { ...MOCK_WEATHER, isOffline: true, condition: note || MOCK_WEATHER.condition };
}
