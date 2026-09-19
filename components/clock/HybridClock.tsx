'use client';

import React from 'react';
import { DigitalClock } from './DigitalClock';
import { AnalogClock } from './AnalogClock';
import { AnalogStyle } from '@/lib/types';

interface HybridClockProps {
  date: Date;
  format12h?: boolean;
  showSeconds?: boolean;
  showDate?: boolean;
  analogStyle?: AnalogStyle;
}

export const HybridClock: React.FC<HybridClockProps> = ({
  date,
  format12h = false,
  showSeconds = true,
  showDate = true,
  analogStyle = 'modern',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(1rem, 4vw, 3rem)',
        width: '100%',
        maxHeight: '100%',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <AnalogClock date={date} size={180} styleType={analogStyle} showSeconds={showSeconds} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <DigitalClock
          date={date}
          format12h={format12h}
          showSeconds={showSeconds}
          showDate={showDate}
          size="md"
        />
      </div>
    </div>
  );
};
