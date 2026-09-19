'use client';

import React from 'react';

interface DigitalClockProps {
  date: Date;
  format12h?: boolean;
  showSeconds?: boolean;
  showDate?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const DigitalClock: React.FC<DigitalClockProps> = ({
  date,
  format12h = false,
  showSeconds = true,
  showDate = true,
  size = 'hero',
}) => {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  let period = '';
  if (format12h) {
    period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }

  const hoursStr = format12h ? hours.toString() : hours.toString().padStart(2, '0');

  const formattedDateStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date).toUpperCase();

  const fontSizeMap = {
    sm: '2rem',
    md: '3.5rem',
    lg: '5rem',
    hero: 'clamp(3.5rem, 15vw, 6.5rem)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div
        className="tabular-nums"
        suppressHydrationWarning
        style={{
          fontFamily: 'var(--digital-font)',
          fontSize: fontSizeMap[size],
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: '0.05em',
          textShadow: '0 0 20px var(--accent-glow)',
        }}
      >
        <span>{hoursStr}</span>
        <span style={{ opacity: date.getSeconds() % 2 === 0 ? 1 : 0.4, transition: 'opacity 0.2s' }}>:</span>
        <span>{minutes}</span>

        {showSeconds && (
          <>
            <span style={{ opacity: date.getSeconds() % 2 === 0 ? 1 : 0.4, transition: 'opacity 0.2s' }}>:</span>
            <span style={{ fontSize: '0.65em', opacity: 0.9, fontWeight: 500 }}>{seconds}</span>
          </>
        )}

        {format12h && (
          <span style={{ fontSize: '0.3em', marginLeft: '0.3em', fontWeight: 600, color: 'var(--accent)', alignSelf: 'flex-start' }}>
            {period}
          </span>
        )}
      </div>

      {showDate && (
        <div
          suppressHydrationWarning
          style={{
            marginTop: '0.5rem',
            fontSize: 'clamp(0.75rem, 2.5vw, 1.1rem)',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}
        >
          {formattedDateStr}
        </div>
      )}
    </div>
  );
};
