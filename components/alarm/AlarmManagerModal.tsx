'use client';

import React, { useState } from 'react';
import { AlarmItem } from '@/lib/types';
import { AlarmClock, Info, Plus, Trash2, X } from 'lucide-react';

interface AlarmManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  alarms: AlarmItem[];
  onSaveAlarms: (alarms: AlarmItem[]) => void;
}

const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const AlarmManagerModal: React.FC<AlarmManagerModalProps> = ({
  isOpen,
  onClose,
  alarms,
  onSaveAlarms,
}) => {
  const [newTime, setNewTime] = useState<string>('07:00');
  const [newLabel, setNewLabel] = useState<string>('Wake Up');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri default

  if (!isOpen) return null;

  const handleAddAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    const item: AlarmItem = {
      id: Date.now().toString(),
      time: newTime,
      label: newLabel || 'Alarm',
      enabled: true,
      repeatDays: [...selectedDays].sort(),
    };
    onSaveAlarms([...alarms, item]);
    setNewLabel('Alarm');
  };

  const handleToggleAlarm = (id: string) => {
    const updated = alarms.map(a => (a.id === id ? { ...a, enabled: !a.enabled } : a));
    onSaveAlarms(updated);
  };

  const handleDeleteAlarm = (id: string) => {
    const updated = alarms.filter(a => a.id !== id);
    onSaveAlarms(updated);
  };

  const toggleDay = (dayIdx: number) => {
    setSelectedDays(prev => (prev.includes(dayIdx) ? prev.filter(d => d !== dayIdx) : [...prev, dayIdx]));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content custom-scroll" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlarmClock size={18} color="var(--accent)" /> Alarm Manager
          </h2>
          <button className="touch-btn" onClick={onClose} style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px', padding: 0 }}>
            <X size={18} />
          </button>
        </div>

        {/* Browser limitation banner */}
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            background: 'rgba(255,255,255,0.04)',
            padding: '8px 10px',
            borderRadius: '8px',
            marginBottom: '14px',
            lineHeight: 1.4,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <Info size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>Note: Alarms trigger while this web application remains open in the browser. Keep screen active or use Ambient mode for overnight bedside alarms.</span>
        </div>

        {/* Add Alarm Form */}
        <form
          onSubmit={handleAddAlarm}
          style={{
            background: 'var(--bg-secondary)',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="time"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              required
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '6px 10px',
                color: 'var(--text-primary)',
                fontSize: '16px',
                fontWeight: 700,
              }}
            />
            <input
              type="text"
              placeholder="Label (e.g. Morning)"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              style={{
                flex: 1,
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '6px 10px',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
          </div>

          {/* Repeat Days Selection */}
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
            {DAY_NAMES.map((d, idx) => {
              const active = selectedDays.includes(idx);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => toggleDay(idx)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-color)',
                    background: active ? 'var(--accent)' : 'var(--bg-primary)',
                    color: active ? '#000' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>

          <button
            className="touch-btn"
            type="submit"
            style={{
              background: 'var(--accent)',
              color: '#000',
              fontWeight: 700,
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Plus size={16} /> Add Alarm
          </button>
        </form>

        {/* Existing Alarms List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }} className="custom-scroll">
          {alarms.length === 0 ? (
            <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '16px' }}>No alarms configured</div>
          ) : (
            alarms.map(a => (
              <div
                key={a.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <div className="tabular-nums" style={{ fontSize: '18px', fontWeight: 700, color: a.enabled ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {a.time}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{a.label}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    className="touch-btn"
                    onClick={() => handleToggleAlarm(a.id)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      background: a.enabled ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                      color: a.enabled ? '#22c55e' : 'var(--text-muted)',
                      borderColor: a.enabled ? '#22c55e' : 'var(--border-color)',
                    }}
                  >
                    {a.enabled ? 'ON' : 'OFF'}
                  </button>
                  <button className="touch-btn" onClick={() => handleDeleteAlarm(a.id)} style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px', padding: 0 }}>
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
