import { useEffect } from "react";
import { usePlayerStore } from "@/features/player";
import { useModdedSettingsStore } from "../store/moddedStore";

export function ModdedMetronomeSync() {
  const enabled = useModdedSettingsStore((state) => state.metronomeEnabled);
  const bpm = useModdedSettingsStore((state) => state.metronomeBpm);
  const playing = usePlayerStore((state) => state.status === "playing");

  useEffect(() => {
    if (!enabled || !playing || typeof window === "undefined") return;
    const intervalMs = 60_000 / bpm;
    const tick = () => {
      const win = window as Window & { __liner_audio_context?: AudioContext };
      const context =
        win.__liner_audio_context ??
        new (window.AudioContext || (window as any).webkitAudioContext)();
      win.__liner_audio_context = context;
      if (context.state === "suspended") void context.resume();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.045);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.05);
    };
    tick();
    const timer = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(timer);
  }, [bpm, enabled, playing]);

  return null;
}
