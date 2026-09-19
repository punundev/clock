'use client';

import React, { useState } from 'react';
import { ClockSettings, ThemeName, DisplayMode, AnalogStyle, AutoDimTimeout } from '@/lib/types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ClockSettings;
  onUpdateSettings: (newSettings: ClockSettings) => void;
}

const THEMES: { id: ThemeName; name: string; color: string }[] = [
  { id: 'dark', name: 'Classic Dark', color: '#090d16' },
  { id: 'midnight', name: 'Midnight', color: '#030712' },
  { id: 'light', name: 'Minimal Light', color: '#f8fafc' },
  { id: 'oled', name: 'OLED Pure Black', color: '#000000' },
  { id: 'aurora', name: 'Aurora', color: '#0f0c1b' },
  { id: 'retro', name: 'Retro Amber', color: '#080c08' },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'clock' | 'appearance' | 'behavior' | 'timezones'>('clock');
  const [newTzLabel, setNewTzLabel] = useState<string>('');
  const [newTzName, setNewTzName] = useState<string>('UTC');

  if (!isOpen) return null;

  const update = <K extends keyof ClockSettings>(key: K, value: ClockSettings[K]) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleAddTimezone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTzLabel || !newTzName) return;
    const item = {
      id: Date.now().toString(),
      label: newTzLabel.toUpperCase(),
      timezone: newTzName,
    };
    update('timezones', [...settings.timezones, item]);
    setNewTzLabel('');
  };

  const handleRemoveTimezone = (id: string) => {
    update('timezones', settings.timezones.filter(t => t.id !== id));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content custom-scroll" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', padding: '16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700 }}>⚙ Smart Clock Settings</h2>
          <button className="touch-btn" onClick={onClose} style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px', padding: 0 }}>✕</button>
        </div>

        {/* Segmented Navigation Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '10px', marginBottom: '16px' }}>
          {(['clock', 'appearance', 'behavior', 'timezones'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                border: 'none',
                background: activeTab === tab ? 'var(--accent)' : 'transparent',
                color: activeTab === tab ? '#000000' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '11px',
                padding: '6px 0',
                borderRadius: '8px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Clock */}
        {activeTab === 'clock' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span>Display Mode</span>
              <select
                value={settings.displayMode}
                onChange={e => update('displayMode', e.target.value as DisplayMode)}
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 8px' }}
              >
                <option value="digital">Digital Only</option>
                <option value="analog">Analog Only</option>
                <option value="hybrid">Hybrid (Both)</option>
              </select>
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span>Time Format</span>
              <button
                className="touch-btn"
                onClick={() => update('format12h', !settings.format12h)}
                style={{ padding: '4px 12px', fontSize: '12px' }}
              >
                {settings.format12h ? '12-Hour (AM/PM)' : '24-Hour'}
              </button>
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span>Show Seconds</span>
              <input
                type="checkbox"
                checked={settings.showSeconds}
                onChange={e => update('showSeconds', e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span>Show Date</span>
              <input
                type="checkbox"
                checked={settings.showDate}
                onChange={e => update('showDate', e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
            </label>
          </div>
        )}

        {/* Tab 2: Appearance */}
        {activeTab === 'appearance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Visual Theme</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => update('theme', t.id)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: settings.theme === t.id ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                      background: t.color,
                      color: t.id === 'light' ? '#000' : '#fff',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Analog Clock Dial Style</div>
              <select
                value={settings.analogStyle}
                onChange={e => update('analogStyle', e.target.value as AnalogStyle)}
                style={{ width: '100%', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px' }}
              >
                <option value="modern">Modern Minimal</option>
                <option value="classic">Classic Dial with Numerals</option>
                <option value="minimal">Ultra Minimal</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 3: Behavior */}
        {activeTab === 'behavior' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span>Auto-Dim Screen Inactivity</span>
              <select
                value={settings.autoDimTimeout}
                onChange={e => update('autoDimTimeout', Number(e.target.value) as AutoDimTimeout)}
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 8px' }}
              >
                <option value={0}>Disabled</option>
                <option value={30}>30 Seconds</option>
                <option value={60}>1 Minute</option>
                <option value={300}>5 Minutes</option>
                <option value={600}>10 Minutes</option>
              </select>
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span>Prevent Screen Sleep (Wake Lock)</span>
              <input
                type="checkbox"
                checked={settings.wakeLockEnabled}
                onChange={e => update('wakeLockEnabled', e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span>Auto-Hide Controls On Idle</span>
              <input
                type="checkbox"
                checked={settings.hideControls}
                onChange={e => update('hideControls', e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
            </label>
          </div>
        )}

        {/* Tab 4: Timezones */}
        {activeTab === 'timezones' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <form onSubmit={handleAddTimezone} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Label (e.g. TOKYO)"
                value={newTzLabel}
                onChange={e => setNewTzLabel(e.target.value)}
                style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px 8px', color: 'var(--text-primary)', fontSize: '12px' }}
              />
              <input
                type="text"
                placeholder="IANA Zone (e.g. Asia/Tokyo)"
                value={newTzName}
                onChange={e => setNewTzName(e.target.value)}
                style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px 8px', color: 'var(--text-primary)', fontSize: '12px' }}
              />
              <button className="touch-btn" type="submit" style={{ padding: '0 12px', fontSize: '12px' }}>+ Add</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }} className="custom-scroll">
              {settings.timezones.map(tz => (
                <div key={tz.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{tz.label} ({tz.timezone})</span>
                  <button className="touch-btn" onClick={() => handleRemoveTimezone(tz.id)} style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px', padding: 0 }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
