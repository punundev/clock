'use client';

import React from 'react';
import { AnalogStyle } from '@/lib/types';

interface AnalogClockProps {
  date: Date;
  size?: number; // width/height in px
  styleType?: AnalogStyle;
  showSeconds?: boolean;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({
  date,
  size = 200,
  styleType = 'modern',
  showSeconds = true,
}) => {
  const seconds = date.getSeconds();
  const minutes = date.getMinutes() + seconds / 60;
  const hours = (date.getHours() % 12) + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  // SVG viewBox is 0 0 200 200. Center is (100, 100), radius 90.
  const hourMarks = Array.from({ length: 12 }, (_, i) => i * 30);
  const minuteTicks = Array.from({ length: 60 }, (_, i) => i * 6);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        style={{ overflow: 'visible' }}
      >
        {/* Outer Dial Circle */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="var(--clock-face-bg)"
          stroke="var(--clock-face-border)"
          strokeWidth="3"
        />

        {/* Hour Tick Marks & Numerals */}
        {hourMarks.map((deg, i) => {
          const isMainQuarter = i % 3 === 0;
          const num = i === 0 ? 12 : i;
          const rad = (deg - 90) * (Math.PI / 180);
          const xText = 100 + 72 * Math.cos(rad);
          const yText = 100 + 72 * Math.sin(rad);

          return (
            <g key={`hour-${i}`}>
              <line
                x1="100"
                y1="14"
                x2="100"
                y2={isMainQuarter ? '24' : '20'}
                stroke="var(--text-primary)"
                strokeWidth={isMainQuarter ? '3.5' : '2'}
                strokeLinecap="round"
                transform={`rotate(${deg} 100 100)`}
                opacity={isMainQuarter ? 1 : 0.6}
              />
              {styleType !== 'minimal' && isMainQuarter && (
                <text
                  x={xText}
                  y={yText}
                  fill="var(--text-secondary)"
                  fontSize="13"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--body-font)"
                >
                  {num}
                </text>
              )}
            </g>
          );
        })}

        {/* Minute Ticks */}
        {styleType === 'classic' &&
          minuteTicks.map((deg, i) => {
            if (i % 5 === 0) return null;
            return (
              <line
                key={`min-${i}`}
                x1="100"
                y1="14"
                x2="100"
                y2="17"
                stroke="var(--text-muted)"
                strokeWidth="1"
                transform={`rotate(${deg} 100 100)`}
                opacity="0.4"
              />
            );
          })}

        {/* Hour Hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="48"
          stroke="var(--clock-hand-hour)"
          strokeWidth="6"
          strokeLinecap="round"
          transform={`rotate(${hourDeg} 100 100)`}
          style={{ transition: 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)' }}
        />

        {/* Minute Hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="28"
          stroke="var(--clock-hand-minute)"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${minuteDeg} 100 100)`}
          style={{ transition: 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)' }}
        />

        {/* Second Hand */}
        {showSeconds && (
          <g transform={`rotate(${secondDeg} 100 100)`} style={{ transition: 'transform 0.15s ease-out' }}>
            <line
              x1="100"
              y1="115"
              x2="100"
              y2="22"
              stroke="var(--clock-hand-second)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="100" cy="22" r="3" fill="var(--clock-hand-second)" />
          </g>
        )}

        {/* Center Pivot Pin */}
        <circle cx="100" cy="100" r="5" fill="var(--clock-hand-second)" />
        <circle cx="100" cy="100" r="2" fill="var(--bg-primary)" />
      </svg>
    </div>
  );
};
