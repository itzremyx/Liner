import { describe, expect, it } from "vitest";
import { calculateNormalizationGain, getNormalizedVolume } from "./volumeNormalization";

const track = {
  id: "stable-track",
  title: "Stable",
  artists: "Artist",
  coverUrl: "",
  durationMs: 1000,
  playCount: 0,
};

describe("modded volume normalization", () => {
  it("uses a stable fallback gain for a streamed track", () => {
    expect(calculateNormalizationGain(track, -14)).toBe(
      calculateNormalizationGain(track, -14),
    );
  });

  it("never returns a volume outside the media element range", () => {
    expect(getNormalizedVolume(track, -14, 1, true)).toBeGreaterThanOrEqual(0);
    expect(getNormalizedVolume(track, -14, 1, true)).toBeLessThanOrEqual(1);
  });
});
