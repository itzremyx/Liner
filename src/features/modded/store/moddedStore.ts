import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ModdedThemeStyle = "classic" | "blur" | "acrylic" | "liquid-glass";
export type LyricsFont = "inter" | "serif" | "mono" | "rounded";
export type VocalMode = "off" | "instrumental" | "vocals";

export interface PinnedModdedItem {
  id: string;
  type: "playlist" | "artist";
  title: string;
  imageUrl?: string;
  href: string;
}

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
  automixEnabled: boolean;
  automixDurationMs: number;
  hardwareAcceleration: boolean;
  hoverPreviewEnabled: boolean;
  personalizedHome: boolean;
  longerDailyMixes: boolean;
  lyricsTranslationEnabled: boolean;
  lyricsFont: LyricsFont;
  vocalMode: VocalMode;
  metronomeEnabled: boolean;
  metronomeBpm: number;
  animationsEnabled: boolean;
  christmasTheme: boolean;
  pinnedItems: PinnedModdedItem[];
  playlistCovers: Record<string, string>;
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
  setAutomixEnabled: (enabled: boolean) => void;
  setAutomixDurationMs: (durationMs: number) => void;
  setHardwareAcceleration: (enabled: boolean) => void;
  setHoverPreviewEnabled: (enabled: boolean) => void;
  setPersonalizedHome: (enabled: boolean) => void;
  setLongerDailyMixes: (enabled: boolean) => void;
  setLyricsTranslationEnabled: (enabled: boolean) => void;
  setLyricsFont: (font: LyricsFont) => void;
  setVocalMode: (mode: VocalMode) => void;
  setMetronomeEnabled: (enabled: boolean) => void;
  setMetronomeBpm: (bpm: number) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setChristmasTheme: (enabled: boolean) => void;
  pinItem: (item: PinnedModdedItem) => void;
  unpinItem: (id: string) => void;
  setPlaylistCover: (playlistId: string, url: string) => void;
}

export type ModdedSettingsStore = ModdedSettingsState & ModdedSettingsActions;

const STORAGE_KEY = "liner_modded_settings_v1";

const clampCrossfade = (value: number) =>
  Math.max(0, Math.min(12_000, Math.round(value)));
const clampAutomix = (value: number) =>
  Math.max(0, Math.min(20_000, Math.round(value)));

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
      automixEnabled: false,
      automixDurationMs: 4_000,
      hardwareAcceleration: true,
      hoverPreviewEnabled: true,
      personalizedHome: true,
      longerDailyMixes: false,
      lyricsTranslationEnabled: false,
      lyricsFont: "inter",
      vocalMode: "off",
      metronomeEnabled: false,
      metronomeBpm: 120,
      animationsEnabled: true,
      christmasTheme: false,
      pinnedItems: [],
      playlistCovers: {},

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
      setAutomixEnabled: (automixEnabled) => set({ automixEnabled }),
      setAutomixDurationMs: (automixDurationMs) =>
        set({ automixDurationMs: clampAutomix(automixDurationMs) }),
      setHardwareAcceleration: (hardwareAcceleration) =>
        set({ hardwareAcceleration }),
      setHoverPreviewEnabled: (hoverPreviewEnabled) =>
        set({ hoverPreviewEnabled }),
      setPersonalizedHome: (personalizedHome) => set({ personalizedHome }),
      setLongerDailyMixes: (longerDailyMixes) => set({ longerDailyMixes }),
      setLyricsTranslationEnabled: (lyricsTranslationEnabled) =>
        set({ lyricsTranslationEnabled }),
      setLyricsFont: (lyricsFont) => set({ lyricsFont }),
      setVocalMode: (vocalMode) => set({ vocalMode }),
      setMetronomeEnabled: (metronomeEnabled) => set({ metronomeEnabled }),
      setMetronomeBpm: (metronomeBpm) =>
        set({ metronomeBpm: Math.max(30, Math.min(260, Math.round(metronomeBpm))) }),
      setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
      setChristmasTheme: (christmasTheme) => set({ christmasTheme }),
      pinItem: (item) =>
        set((state) => ({
          pinnedItems: [
            item,
            ...state.pinnedItems.filter((candidate) => candidate.id !== item.id),
          ].slice(0, 12),
        })),
      unpinItem: (id) =>
        set((state) => ({
          pinnedItems: state.pinnedItems.filter((item) => item.id !== id),
        })),
      setPlaylistCover: (playlistId, url) =>
        set((state) => {
          const playlistCovers = { ...state.playlistCovers };
          if (url.trim()) playlistCovers[playlistId] = url.trim();
          else delete playlistCovers[playlistId];
          return { playlistCovers };
        }),
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
        state.automixDurationMs = clampAutomix(state.automixDurationMs);
        if (!Array.isArray(state.pinnedItems)) state.pinnedItems = [];
        if (!state.playlistCovers || typeof state.playlistCovers !== "object") {
          state.playlistCovers = {};
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
  if (state.automixEnabled) return Math.max(state.crossfadeDurationMs, state.automixDurationMs);
  return state.crossfadeEnabled ? state.crossfadeDurationMs : 180;
}
