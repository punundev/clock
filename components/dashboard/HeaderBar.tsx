'use client';

import React from 'react';
import { WeatherData } from '@/lib/types';

interface HeaderBarProps {
  date: Date;
  weather: WeatherData | null;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  isOnline: boolean;
  onOpenSettings: () => void;
  onOpenAlarm: () => void;
  onOpenStopwatch: () => void;
  onOpenTimer: () => void;
  isAmbient: boolean;
}

const headerDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

export const HeaderBar: React.FC<HeaderBarProps> = ({
  date,
  weather,
  batteryLevel,
  batteryCharging,
  isOnline,
  onOpenSettings,
  onOpenAlarm,
  onOpenStopwatch,
  onOpenTimer,
  isAmbient,
}) => {
  if (isAmbient) return null;

  const formattedDay = headerDateFormatter.format(date).toUpperCase();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '8px 16px',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.05em',
        color: 'var(--text-secondary)',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        zIndex: 30,
        height: '42px',
        flexShrink: 0,
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
      }}
    >
      {/* Left: Date & Connection */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span suppressHydrationWarning>{formattedDay}</span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            background: isOnline ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: isOnline ? '#4ade80' : '#f87171',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? '#22c55e' : '#ef4444' }} />
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      {/* Center: Weather & Location snippet */}
      {weather && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{weather.locationName.split(',')[0]}</span>
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{weather.temperature}°C</span>
          <span style={{ opacity: 0.8 }}>{weather.condition}</span>
        </div>
      )}

      {/* Right: Quick Action Buttons & Battery */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {batteryLevel !== null && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
            {batteryCharging ? '⚡' : '🔋'} {batteryLevel}%
          </span>
        )}

        <button className="touch-btn" onClick={onOpenAlarm} title="Alarms" style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px', padding: 0 }}>
          ⏰
        </button>
        <button className="touch-btn" onClick={onOpenStopwatch} title="Stopwatch" style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px', padding: 0 }}>
          ⏱
        </button>
        <button className="touch-btn" onClick={onOpenTimer} title="Timer" style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px', padding: 0 }}>
          ⏳
        </button>
        <button className="touch-btn" onClick={onOpenSettings} title="Settings" style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px', padding: 0 }}>
          ⚙
        </button>
      </div>
    </header>
  );
};
