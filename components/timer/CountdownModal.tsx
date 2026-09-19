'use client';

import React, { useState, useEffect, useRef } from 'react';
import { playAlarmSound } from '@/lib/alarms';

interface CountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CountdownModal: React.FC<CountdownModalProps> = ({ isOpen, onClose }) => {
  const [totalSeconds, setTotalSeconds] = useState<number>(300); // 5 mins default
  const [remainingSecs, setRemainingSecs] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [customInputMins, setCustomInputMins] = useState<string>('5');

  const endTimeRef = useRef<number>(0);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
      return;
    }

    endTimeRef.current = Date.now() + remainingSecs * 1000;

    timerIdRef.current = setInterval(() => {
      const now = Date.now();
      const left = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
      setRemainingSecs(left);

      if (left <= 0) {
        setIsRunning(false);
        if (timerIdRef.current) clearInterval(timerIdRef.current);
        playAlarmSound();
      }
    }, 200);

    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    };
  }, [isRunning, remainingSecs]);

  if (!isOpen) return null;

  const handleSelectPreset = (mins: number) => {
    setIsRunning(false);
    const secs = mins * 60;
    setTotalSeconds(secs);
    setRemainingSecs(secs);
    setCustomInputMins(mins.toString());
  };

  const handleStartPause = () => {
    if (remainingSecs <= 0) {
      setRemainingSecs(totalSeconds);
    }
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSecs(totalSeconds);
  };

  const handleSetCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInputMins, 10);
    if (!isNaN(val) && val > 0) {
      handleSelectPreset(val);
    }
  };

  const minsStr = Math.floor(remainingSecs / 60).toString().padStart(2, '0');
  const secsStr = (remainingSecs % 60).toString().padStart(2, '0');

  const PRESETS = [1, 5, 10, 15, 30, 60];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700 }}>⏳ Countdown Timer</h2>
          <button className="touch-btn" onClick={onClose} style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px', padding: 0 }}>✕</button>
        </div>

        {/* Digit Display */}
        <div
          className="tabular-nums"
          style={{
            fontFamily: 'var(--digital-font)',
            fontSize: '3.5rem',
            fontWeight: 700,
            textAlign: 'center',
            margin: '12px 0',
            color: remainingSecs === 0 ? '#ef4444' : 'var(--text-primary)',
          }}
        >
          {minsStr}:{secsStr}
        </div>

        {/* Preset Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '14px' }}>
          {PRESETS.map(p => (
            <button
              key={p}
              className="touch-btn"
              onClick={() => handleSelectPreset(p)}
              style={{
                fontSize: '11px',
                padding: '4px 0',
                background: totalSeconds === p * 60 ? 'var(--accent)' : 'var(--bg-secondary)',
                color: totalSeconds === p * 60 ? '#000' : 'var(--text-primary)',
                fontWeight: 700,
              }}
            >
              {p}m
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <form onSubmit={handleSetCustom} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            type="number"
            min="1"
            max="999"
            value={customInputMins}
            onChange={e => setCustomInputMins(e.target.value)}
            style={{
              flex: 1,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '6px 10px',
              color: 'var(--text-primary)',
              fontSize: '14px',
            }}
            placeholder="Custom mins"
          />
          <button type="submit" className="touch-btn" style={{ padding: '0 16px' }}>Set</button>
        </form>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="touch-btn"
            onClick={handleStartPause}
            style={{
              flex: 1,
              background: isRunning ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
              color: isRunning ? '#ef4444' : '#22c55e',
              borderColor: isRunning ? '#ef4444' : '#22c55e',
              fontWeight: 700,
            }}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button className="touch-btn" onClick={handleReset} style={{ flex: 1 }}>Reset</button>
        </div>
      </div>
    </div>
  );
};
