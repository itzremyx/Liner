export interface ModdedAudioPreset {
  id:
    | "normal"
    | "speed-up"
    | "speed-up-pitched"
    | "slowed-reverb"
    | "ultra-slowed-reverb";
  label: string;
  rate: number;
  pitchSemitones: number;
  reverb: boolean;
  reverbLevel: number;
}

export const MODDED_AUDIO_PRESETS: readonly ModdedAudioPreset[] = [
  {
    id: "normal",
    label: "Normal",
    rate: 1,
    pitchSemitones: 0,
    reverb: false,
    reverbLevel: 0.35,
  },
  {
    id: "speed-up",
    label: "Speed up",
    rate: 1.25,
    pitchSemitones: 0,
    reverb: false,
    reverbLevel: 0.35,
  },
  {
    id: "speed-up-pitched",
    label: "Speed up + pitched",
    rate: 1.35,
    pitchSemitones: 2,
    reverb: false,
    reverbLevel: 0.35,
  },
  {
    id: "slowed-reverb",
    label: "Slowed + reverb",
    rate: 0.85,
    pitchSemitones: -2,
    reverb: true,
    reverbLevel: 0.45,
  },
  {
    id: "ultra-slowed-reverb",
    label: "Ultra-slowed + reverb",
    rate: 0.65,
    pitchSemitones: -5,
    reverb: true,
    reverbLevel: 0.6,
  },
];
