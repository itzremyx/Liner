import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Track } from "@/shared/types";

export interface ListeningEvent {
  trackId: string;
  title: string;
  artists: string;
  coverUrl: string;
  durationMs: number;
  playedAt: number;
}

interface ModdedAnalyticsState {
  events: ListeningEvent[];
  recordTrack: (track: Track) => void;
  clear: () => void;
}

const MAX_EVENTS = 2_000;

export const useModdedAnalyticsStore = create<ModdedAnalyticsState>()(
  persist(
    (set) => ({
      events: [],
      recordTrack: (track) =>
        set((state) => {
          const last = state.events[0];
          if (last?.trackId === track.id && Date.now() - last.playedAt < 30_000) {
            return state;
          }
          const event: ListeningEvent = {
            trackId: track.id,
            title: track.title,
            artists: track.artists,
            coverUrl: track.coverUrl,
            durationMs: track.durationMs || 0,
            playedAt: Date.now(),
          };
          return { events: [event, ...state.events].slice(0, MAX_EVENTS) };
        }),
      clear: () => set({ events: [] }),
    }),
    {
      name: "liner-modded-analytics-v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function getWrappedStats(events: readonly ListeningEvent[]) {
  const tracks = new Map<string, { event: ListeningEvent; count: number }>();
  const artists = new Map<string, number>();
  let minutes = 0;
  for (const event of events) {
    minutes += event.durationMs / 60_000;
    const current = tracks.get(event.trackId);
    tracks.set(event.trackId, {
      event: current?.event ?? event,
      count: (current?.count ?? 0) + 1,
    });
    artists.set(event.artists, (artists.get(event.artists) ?? 0) + 1);
  }
  return {
    minutes: Math.round(minutes),
    uniqueTracks: tracks.size,
    uniqueArtists: artists.size,
    topTracks: [...tracks.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    topArtists: [...artists.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
  };
}
