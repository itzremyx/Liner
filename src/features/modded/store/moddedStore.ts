import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ModdedThemeStyle = "classic" | "blur" | "acrylic" | "liquid-glass";

export interface ModdedSettingsState {
  crossfadeEnabled: boolean;
  crossfadeDurationMs: number;
  performanceMode: boolean;
  aiRecommendationsEnabled: boolean;
  scoutcodeApiKey: string;
  themeStyle: ModdedThemeStyle;
  customBackgroundUrl: string;
  customLogoUrl: string;
  volumeNormalization: boolean;
  targetLoudnessLUFS: number;
  smartShuffleEnabled: boolean;
}

interface ModdedSettingsActions {
  setCrossfadeEnabled: (enabled: boolean) => void;
  setCrossfadeDurationMs: (durationMs: number) => void;
  setPerformanceMode: (enabled: boolean) => void;
  setAiRecommendationsEnabled: (enabled: boolean) => void;
  setScoutcodeApiKey: (apiKey: string) => void;
  setThemeStyle: (style: ModdedThemeStyle) => void;
  setCustomBackgroundUrl: (url: string) => void;
  setCustomLogoUrl: (url: string) => void;
  setVolumeNormalization: (enabled: boolean) => void;
  setTargetLoudnessLUFS: (lufs: number) => void;
  setSmartShuffleEnabled: (enabled: boolean) => void;
}

export type ModdedSettingsStore = ModdedSettingsState & ModdedSettingsActions;

const STORAGE_KEY = "liner_modded_settings_v1";

const clampCrossfade = (value: number) =>
  Math.max(0, Math.min(12_000, Math.round(value)));

export const useModdedSettingsStore = create<ModdedSettingsStore>()(
  persist(
    (set) => ({
      crossfadeEnabled: true,
      crossfadeDurationMs: 1_800,
      performanceMode: false,
      aiRecommendationsEnabled: true,
      scoutcodeApiKey: "",
      themeStyle: "classic",
      customBackgroundUrl: "",
      customLogoUrl: "",
      volumeNormalization: false,
      targetLoudnessLUFS: -14,
      smartShuffleEnabled: false,

      setCrossfadeEnabled: (crossfadeEnabled) => set({ crossfadeEnabled }),
      setCrossfadeDurationMs: (durationMs) =>
        set({ crossfadeDurationMs: clampCrossfade(durationMs) }),
      setPerformanceMode: (performanceMode) => set({ performanceMode }),
      setAiRecommendationsEnabled: (aiRecommendationsEnabled) =>
        set({ aiRecommendationsEnabled }),
      setScoutcodeApiKey: (scoutcodeApiKey) => set({ scoutcodeApiKey }),
      setThemeStyle: (themeStyle) => set({ themeStyle }),
      setCustomBackgroundUrl: (customBackgroundUrl) =>
        set({ customBackgroundUrl }),
      setCustomLogoUrl: (customLogoUrl) => set({ customLogoUrl }),
      setVolumeNormalization: (volumeNormalization) =>
        set({ volumeNormalization }),
      setTargetLoudnessLUFS: (targetLoudnessLUFS) =>
        set({
          targetLoudnessLUFS: Math.max(-23, Math.min(-5, targetLoudnessLUFS)),
        }),
      setSmartShuffleEnabled: (smartShuffleEnabled) =>
        set({ smartShuffleEnabled }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.crossfadeDurationMs = clampCrossfade(state.crossfadeDurationMs);
        if (!Number.isFinite(state.crossfadeDurationMs)) {
          state.crossfadeDurationMs = 1_800;
        }
        if (!Number.isFinite(state.targetLoudnessLUFS)) {
          state.targetLoudnessLUFS = -14;
        }
      },
    },
  ),
);

export function getScoutcodeApiKey(): string {
  const localKey = useModdedSettingsStore.getState().scoutcodeApiKey.trim();
  const envKey =
    (import.meta.env.VITE_SCOUTCODE_API_KEY as string | undefined) ?? "";
  return localKey || envKey.trim();
}

export function getCrossfadeDurationMs(): number {
  const state = useModdedSettingsStore.getState();
  return state.crossfadeEnabled ? state.crossfadeDurationMs : 180;
}
