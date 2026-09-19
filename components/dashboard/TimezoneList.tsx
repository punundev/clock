'use client';

import React from 'react';
import { TimezoneItem } from '@/lib/types';

interface TimezoneListProps {
  date: Date;
  timezones: TimezoneItem[];
  format12h?: boolean;
}

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function formatTzTime(date: Date, timezone: string, format12h: boolean): string {
  const key = `${timezone}_${format12h}`;
  if (!formatterCache.has(key)) {
    try {
      formatterCache.set(
        key,
        new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: format12h,
        })
      );
    } catch {
      return '--:--';
    }
  }
  const fmt = formatterCache.get(key);
  return fmt ? fmt.format(date) : '--:--';
}

export const TimezoneList: React.FC<TimezoneListProps> = ({ date, timezones, format12h = false }) => {
  if (!timezones || timezones.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        maxWidth: '100%',
        paddingBottom: '2px',
        WebkitOverflowScrolling: 'touch',
      }}
      className="custom-scroll"
    >
      {timezones.map(tz => {
        const timeStr = formatTzTime(date, tz.timezone, format12h);

        return (
          <div
            key={tz.id}
            className="glass-panel"
            style={{
              padding: '6px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '90px',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              {tz.label}
            </span>
            <span
              className="tabular-nums"
              suppressHydrationWarning
              style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}
            >
              {timeStr}
            </span>
          </div>
        );
      })}
    </div>
  );
};
