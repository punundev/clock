'use client';

import React, { useState, useEffect, useRef } from 'react';

interface StopwatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StopwatchModal: React.FC<StopwatchModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [laps, setLaps] = useState<number[]>([]);

  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    startTimeRef.current = performance.now();

    const update = () => {
      const now = performance.now();
      const currentElapsed = accumulatedRef.current + (now - startTimeRef.current);
      setElapsedMs(currentElapsed);
      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning]);

  if (!isOpen) return null;

  const handleStartPause = () => {
    if (isRunning) {
      accumulatedRef.current += performance.now() - startTimeRef.current;
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    accumulatedRef.current = 0;
    setElapsedMs(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps(prev => [elapsedMs, ...prev]);
    }
  };

  const formatStopwatchTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    const hundredths = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return { mins, secs, hundredths };
  };

  const { mins, secs, hundredths } = formatStopwatchTime(elapsedMs);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700 }}>⏱ Stopwatch</h2>
          <button className="touch-btn" onClick={onClose} style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px', padding: 0 }}>✕</button>
        </div>

        {/* Big Digit Display */}
        <div
          className="tabular-nums"
          style={{
            fontFamily: 'var(--digital-font)',
            fontSize: '3.2rem',
            fontWeight: 700,
            textAlign: 'center',
            margin: '12px 0',
            color: 'var(--accent)',
          }}
        >
          {mins}:{secs}.<span style={{ fontSize: '0.65em' }}>{hundredths}</span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
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
          <button
            className="touch-btn"
            onClick={handleLap}
            disabled={!isRunning}
            style={{ flex: 1, opacity: isRunning ? 1 : 0.4 }}
          >
            Lap
          </button>
          <button className="touch-btn" onClick={handleReset} style={{ flex: 1 }}>
            Reset
          </button>
        </div>

        {/* Laps List */}
        {laps.length > 0 && (
          <div
            className="custom-scroll"
            style={{
              maxHeight: '140px',
              overflowY: 'auto',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '8px',
            }}
          >
            {laps.map((lapMs, idx) => {
              const l = formatStopwatchTime(lapMs);
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>Lap {laps.length - idx}</span>
                  <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {l.mins}:{l.secs}.{l.hundredths}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
