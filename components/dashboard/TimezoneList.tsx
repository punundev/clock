'use client';

import React from 'react';
import { TimezoneItem } from '@/lib/types';

interface TimezoneListProps {
  date: Date;
  timezones: TimezoneItem[];
  format12h?: boolean;
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
      }}
      className="custom-scroll"
    >
      {timezones.map(tz => {
        let timeStr = '--:--';
        try {
          timeStr = new Intl.DateTimeFormat('en-US', {
            timeZone: tz.timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: format12h,
          }).format(date);
        } catch {}

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
            <span className="tabular-nums" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {timeStr}
            </span>
          </div>
        );
      })}
    </div>
  );
};
