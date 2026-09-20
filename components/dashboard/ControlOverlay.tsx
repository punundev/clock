'use client';

import React from 'react';
import { DisplayMode } from '@/lib/types';
import { Sun, Moon, Maximize, Settings } from 'lucide-react';

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
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
        left: '50%',
        WebkitTransform: 'translateX(-50%) translateZ(0)',
        transform: 'translateX(-50%) translateZ(0)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        borderRadius: '28px',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-color)',
        zIndex: 40,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        touchAction: 'manipulation',
      }}
    >
      {/* Mode Switcher Segmented Buttons */}
      <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.08)', padding: '3px', borderRadius: '22px' }}>
        <button
          className="touch-btn"
          onClick={() => onModeChange('digital')}
          style={{
            border: 'none',
            background: displayMode === 'digital' ? 'var(--accent)' : 'transparent',
            color: displayMode === 'digital' ? '#000000' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '12px',
            padding: '6px 14px',
            minHeight: '40px',
            borderRadius: '18px',
          }}
        >
          Digital
        </button>
        <button
          className="touch-btn"
          onClick={() => onModeChange('hybrid')}
          style={{
            border: 'none',
            background: displayMode === 'hybrid' ? 'var(--accent)' : 'transparent',
            color: displayMode === 'hybrid' ? '#000000' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '12px',
            padding: '6px 14px',
            minHeight: '40px',
            borderRadius: '18px',
          }}
        >
          Hybrid
        </button>
        <button
          className="touch-btn"
          onClick={() => onModeChange('analog')}
          style={{
            border: 'none',
            background: displayMode === 'analog' ? 'var(--accent)' : 'transparent',
            color: displayMode === 'analog' ? '#000000' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '12px',
            padding: '6px 14px',
            minHeight: '40px',
            borderRadius: '18px',
          }}
        >
          Analog
        </button>
      </div>

      <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }} />

      {/* Ambient Toggle */}
      <button
        className="touch-btn"
        onClick={onToggleAmbient}
        title={ambientMode ? 'Exit Ambient Clock' : 'Ambient Clock Mode'}
        style={{
          width: '44px',
          height: '44px',
          minWidth: '44px',
          minHeight: '44px',
          padding: 0,
          borderRadius: '50%',
          background: ambientMode ? 'var(--accent-glow)' : 'transparent',
          border: ambientMode ? '1px solid var(--accent)' : '1px solid transparent',
        }}
      >
        {ambientMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Fullscreen Toggle */}
      <button
        className="touch-btn"
        onClick={onToggleFullscreen}
        title="Toggle Fullscreen"
        style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', padding: 0, borderRadius: '50%', border: 'none' }}
      >
        <Maximize size={18} />
      </button>

      {/* Settings Modal */}
      <button
        className="touch-btn"
        onClick={onOpenSettings}
        title="Settings"
        style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', padding: 0, borderRadius: '50%', border: 'none' }}
      >
        <Settings size={18} />
      </button>
    </div>
  );
};
