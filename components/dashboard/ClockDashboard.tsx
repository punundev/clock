'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useClockEngine } from '@/hooks/useClockEngine';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useIdle } from '@/hooks/useIdle';
import { useBattery } from '@/hooks/useBattery';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { loadSettings, saveSettings } from '@/lib/storage';
import { ClockSettings, WeatherData, AlarmItem } from '@/lib/types';
import { fetchWeatherData } from '@/lib/weather';
import { checkTriggeredAlarms, playAlarmSound } from '@/lib/alarms';
import { AlarmClock } from 'lucide-react';

import { DigitalClock } from '@/components/clock/DigitalClock';
import { AnalogClock } from '@/components/clock/AnalogClock';
import { HybridClock } from '@/components/clock/HybridClock';
import { HeaderBar } from './HeaderBar';
import { WeatherCard } from './WeatherCard';
import { TimezoneList } from './TimezoneList';
import { ControlOverlay } from './ControlOverlay';
import { PortraitWarning } from './PortraitWarning';

import { StopwatchModal } from '@/components/timer/StopwatchModal';
import { CountdownModal } from '@/components/timer/CountdownModal';
import { AlarmManagerModal } from '@/components/alarm/AlarmManagerModal';
import { SettingsPanel } from '@/components/settings/SettingsPanel';

export const ClockDashboard: React.FC = () => {
  const currentDate = useClockEngine();
  const [mounted, setMounted] = useState<boolean>(false);
  const [settings, setSettings] = useState<ClockSettings>(loadSettings);

  useEffect(() => {
    setMounted(true);
    setSettings(loadSettings());
  }, []);

  const [weather, setWeather] = useState<WeatherData | null>(null);

  const [activeModal, setActiveModal] = useState<'settings' | 'alarm' | 'stopwatch' | 'timer' | null>(null);
  const [activeAlarmNotification, setActiveAlarmNotification] = useState<AlarmItem | null>(null);

  const battery = useBattery();
  const isOnline = useOnlineStatus();
  const { isIdle, resetTimer } = useIdle(settings.hideControls ? settings.autoDimTimeout || 60 : 0);
  const { isSupported: wakeLockSupported } = useWakeLock(settings.wakeLockEnabled);

  // Save settings when changed
  const handleUpdateSettings = useCallback((newSettings: ClockSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  // Fetch weather on mount and periodically
  const loadWeather = useCallback(async () => {
    const data = await fetchWeatherData(
      settings.location.latitude,
      settings.location.longitude,
      settings.location.name
    );
    setWeather(data);
  }, [settings.location]);

  useEffect(() => {
    loadWeather();
    const interval = setInterval(loadWeather, 30 * 60 * 1000); // refresh every 30m
    return () => clearInterval(interval);
  }, [loadWeather]);

  // Check Alarms on every second tick
  useEffect(() => {
    const triggered = checkTriggeredAlarms(settings.alarms, currentDate);
    if (triggered.length > 0) {
      const targetAlarm = triggered[0];
      setActiveAlarmNotification(targetAlarm);
      playAlarmSound();
    }
  }, [currentDate, settings.alarms]);

  // Fullscreen API toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const isAutoDimmed = settings.autoDimTimeout > 0 && isIdle && !settings.ambientMode;
  const isControlsVisible = !settings.hideControls || !isIdle || activeModal !== null;

  return (
    <div
      className={`clock-app-root ${isAutoDimmed ? 'auto-dimmed' : ''}`}
      data-theme={settings.theme}
      onClick={resetTimer}
      suppressHydrationWarning
    >
      <PortraitWarning />

      {/* Top Header Navigation Bar */}
      <HeaderBar
        date={currentDate}
        weather={weather}
        batteryLevel={battery.level}
        batteryCharging={battery.charging}
        isOnline={isOnline}
        onOpenSettings={() => setActiveModal('settings')}
        onOpenAlarm={() => setActiveModal('alarm')}
        onOpenStopwatch={() => setActiveModal('stopwatch')}
        onOpenTimer={() => setActiveModal('timer')}
        isAmbient={settings.ambientMode}
      />

      {/* Main Viewport Content - Designed to fit 375px landscape height */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 16px',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Level 1 Clock Priority Display */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {settings.displayMode === 'digital' && (
            <DigitalClock
              date={currentDate}
              format12h={settings.format12h}
              showSeconds={settings.showSeconds}
              showDate={settings.showDate}
              size="hero"
            />
          )}

          {settings.displayMode === 'analog' && (
            <AnalogClock
              date={currentDate}
              size={240}
              styleType={settings.analogStyle}
              showSeconds={settings.showSeconds}
            />
          )}

          {settings.displayMode === 'hybrid' && (
            <HybridClock
              date={currentDate}
              format12h={settings.format12h}
              showSeconds={settings.showSeconds}
              showDate={settings.showDate}
              analogStyle={settings.analogStyle}
            />
          )}
        </div>

        {/* Level 2 Secondary Info Panels (Hidden in Ambient mode) */}
        {!settings.ambientMode && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '12px',
              paddingTop: '8px',
              zIndex: 5,
            }}
          >
            <TimezoneList date={currentDate} timezones={settings.timezones} format12h={settings.format12h} />
            <WeatherCard weather={weather} onRefresh={loadWeather} />
          </div>
        )}
      </main>

      {/* Floating Controls Overlay */}
      <ControlOverlay
        visible={isControlsVisible}
        displayMode={settings.displayMode}
        onModeChange={m => handleUpdateSettings({ ...settings, displayMode: m })}
        ambientMode={settings.ambientMode}
        onToggleAmbient={() => handleUpdateSettings({ ...settings, ambientMode: !settings.ambientMode })}
        onToggleFullscreen={toggleFullscreen}
        onOpenSettings={() => setActiveModal('settings')}
      />

      {/* Modals */}
      <SettingsPanel
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <AlarmManagerModal
        isOpen={activeModal === 'alarm'}
        onClose={() => setActiveModal(null)}
        alarms={settings.alarms}
        onSaveAlarms={alarms => handleUpdateSettings({ ...settings, alarms })}
      />

      <StopwatchModal isOpen={activeModal === 'stopwatch'} onClose={() => setActiveModal(null)} />
      <CountdownModal isOpen={activeModal === 'timer'} onClose={() => setActiveModal(null)} />

      {/* Active Triggered Alarm Banner Alert */}
      {activeAlarmNotification && (
        <div className="modal-overlay" style={{ zIndex: 200 }}>
          <div className="modal-content" style={{ padding: '24px', textAlign: 'center', maxWidth: '340px', alignItems: 'center' }}>
            <AlarmClock size={48} color="var(--accent)" style={{ margin: '0 auto 8px auto' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{activeAlarmNotification.label}</h2>
            <div className="tabular-nums" style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent)', margin: '12px 0' }}>
              {activeAlarmNotification.time}
            </div>
            <button
              className="touch-btn"
              onClick={() => setActiveAlarmNotification(null)}
              style={{ background: 'var(--accent)', color: '#000000', fontWeight: 700, width: '100%', padding: '12px' }}
            >
              Dismiss Alarm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
