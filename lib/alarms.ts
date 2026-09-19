import { AlarmItem } from './types';

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playAlarmSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Play a pleasant 3-tone chime sequence (E5, G5, B5) repeated twice
  const notes = [659.25, 783.99, 987.77, 659.25, 783.99, 987.77];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.2);

    gain.gain.setValueAtTime(0, now + idx * 0.2);
    gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.2 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.2 + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.2);
    osc.stop(now + idx * 0.2 + 0.2);
  });
}

export function checkTriggeredAlarms(alarms: AlarmItem[], date: Date): AlarmItem[] {
  const currentHours = date.getHours().toString().padStart(2, '0');
  const currentMinutes = date.getMinutes().toString().padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;
  const currentDay = date.getDay(); // 0 = Sun, 6 = Sat
  const currentSeconds = date.getSeconds();

  // Trigger only at the 00 second mark of a minute
  if (currentSeconds !== 0) return [];

  return alarms.filter(alarm => {
    if (!alarm.enabled) return false;
    if (alarm.time !== currentTimeStr) return false;

    // Check repeat days
    if (alarm.repeatDays.length === 0) return true; // One time alarm
    return alarm.repeatDays.includes(currentDay);
  });
}
