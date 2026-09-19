'use client';

import React from 'react';
import { DisplayMode } from '@/lib/types';

interface ControlOverlayProps {
  visible: boolean;
  displayMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
  ambientMode: boolean;
  onToggleAmbient: () => void;
  onToggleFullscreen: () => void;
  onOpenSettings: () => void;
}

export const ControlOverlay: React.FC<ControlOverlayProps> = ({
  visible,
  displayMode,
  onModeChange,
  ambientMode,
  onToggleAmbient,
  onToggleFullscreen,
  onOpenSettings,
}) => {
  return (
    <div
      className={`controls-fade ${visible ? 'controls-visible' : 'controls-hidden'}`}
      style={{
        position: 'absolute',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 10px',
        borderRadius: '24px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-color)',
        zIndex: 20,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Mode Switcher Segmented Buttons */}
      <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.06)', padding: '2px', borderRadius: '18px' }}>
        <button
          onClick={() => onModeChange('digital')}
          style={{
            border: 'none',
            background: displayMode === 'digital' ? 'var(--accent)' : 'transparent',
            color: displayMode === 'digital' ? '#000000' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '11px',
            padding: '6px 12px',
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Digital
        </button>
        <button
          onClick={() => onModeChange('hybrid')}
          style={{
            border: 'none',
            background: displayMode === 'hybrid' ? 'var(--accent)' : 'transparent',
            color: displayMode === 'hybrid' ? '#000000' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '11px',
            padding: '6px 12px',
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Hybrid
        </button>
        <button
          onClick={() => onModeChange('analog')}
          style={{
            border: 'none',
            background: displayMode === 'analog' ? 'var(--accent)' : 'transparent',
            color: displayMode === 'analog' ? '#000000' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '11px',
            padding: '6px 12px',
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Analog
        </button>
      </div>

      <div style={{ width: '1px', height: '16px', background: 'var(--border-color)' }} />

      {/* Ambient Toggle */}
      <button
        className="touch-btn"
        onClick={onToggleAmbient}
        title={ambientMode ? 'Exit Ambient Clock' : 'Ambient Clock Mode'}
        style={{
          width: '36px',
          height: '36px',
          minWidth: '36px',
          minHeight: '36px',
          padding: 0,
          borderRadius: '50%',
          background: ambientMode ? 'var(--accent-glow)' : 'transparent',
          border: ambientMode ? '1px solid var(--accent)' : '1px solid transparent',
        }}
      >
        {ambientMode ? '☀️' : '🌙'}
      </button>

      {/* Fullscreen Toggle */}
      <button
        className="touch-btn"
        onClick={onToggleFullscreen}
        title="Toggle Fullscreen"
        style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px', padding: 0, borderRadius: '50%', border: 'none' }}
      >
        ⛶
      </button>

      {/* Settings Modal */}
      <button
        className="touch-btn"
        onClick={onOpenSettings}
        title="Settings"
        style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px', padding: 0, borderRadius: '50%', border: 'none' }}
      >
        ⚙
      </button>
    </div>
  );
};
