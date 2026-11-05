import { describe, expect, it } from "vitest";
import { getWrappedStats, type ListeningEvent } from "./moddedAnalyticsStore";

const event = (id: string, artist: string, playedAt: number): ListeningEvent => ({
  trackId: id,
  title: id,
  artists: artist,
  coverUrl: "",
  durationMs: 120_000,
  playedAt,
});

describe("modded analytics", () => {
  it("builds Wrapped counters without sending data anywhere", () => {
    const stats = getWrappedStats([
      event("one", "A", 1),
      event("one", "A", 2),
      event("two", "B", 3),
    ]);
    expect(stats.minutes).toBe(6);
    expect(stats.uniqueTracks).toBe(2);
    expect(stats.uniqueArtists).toBe(2);
    expect(stats.topTracks[0]?.count).toBe(2);
  });
});
