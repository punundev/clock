'use client';

import React from 'react';
import { WeatherData } from '@/lib/types';

interface WeatherCardProps {
  weather: WeatherData | null;
  onRefresh?: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onRefresh }) => {
  if (!weather) {
    return (
      <div className="glass-panel" style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
        Loading weather info...
      </div>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        minWidth: '150px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '12px' }}>{weather.locationName}</span>
        {onRefresh && (
          <button
            onClick={onRefresh}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '12px' }}
            title="Refresh Weather"
          >
            ↻
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
          {weather.temperature}°C
        </span>
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{weather.condition}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '2px', opacity: 0.9 }}>
        <div>Feels: {weather.feelsLike}°C</div>
        <div>Humidity: {weather.humidity}%</div>
        <div>Wind: {weather.windSpeed} km/h</div>
        <div>Sun: 🌅 {weather.sunrise}</div>
      </div>
    </div>
  );
};
