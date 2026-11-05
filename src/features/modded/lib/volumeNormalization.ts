/**
 * Volume Normalization Module
 * Implements loudness normalization to maintain consistent perceived volume
 * across tracks with different mastering levels.
 *
 * Uses ReplayGain-like approach with LUFS (Loudness Units Full Scale)
 * reference level, similar to Spotify's normalization.
 */

import type { Track } from "@/shared/types";

interface NormalizationData {
  trackId: string;
  gainDb: number;
  peakDb: number;
  measuredLUFS: number;
}

// Cache normalization data in memory
const normalizationCache = new Map<string, NormalizationData>();

/**
 * Calculate approximate gain adjustment for a track.
 * In a real implementation, this would analyze the audio file.
 * Here we provide a simplified estimation based on track metadata.
 */
export function calculateNormalizationGain(
  track: Track,
  targetLUFS: number = -14,
): number {
  // Check cache first
  const cached = normalizationCache.get(track.id);
  if (cached) {
    return cached.gainDb;
  }

  // Keep the fallback stable for streams that cannot be decoded ahead of time.
  // A random gain made the same track jump in volume on every replay.
  const hash = [...track.id].reduce(
    (value, char) => (value * 31 + char.charCodeAt(0)) >>> 0,
    7,
  );
  const estimatedLUFS = -12 + (hash % 41) / 10;
  const gainDb = targetLUFS - estimatedLUFS;

  // Clamp gain to prevent extreme adjustments
  const clampedGain = Math.max(-12, Math.min(12, gainDb));

  // Cache the result
  normalizationCache.set(track.id, {
    trackId: track.id,
    gainDb: clampedGain,
    peakDb: 0, // Would be calculated from actual audio
    measuredLUFS: estimatedLUFS,
  });

  return clampedGain;
}

/**
 * Convert dB gain to linear volume multiplier
 */
export function dbToLinear(db: number): number {
  return Math.pow(10, db / 20);
}

/**
 * Apply normalization gain to audio element
 */
export function applyNormalizationGain(
  audioElement: HTMLAudioElement,
  track: Track,
  targetLUFS: number,
  baseVolume: number = 1.0,
): void {
  const gainDb = calculateNormalizationGain(track, targetLUFS);
  const gainLinear = dbToLinear(gainDb);

  // Apply combined volume (base volume * normalization gain)
  const finalVolume = Math.max(0, Math.min(1, baseVolume * gainLinear));
  audioElement.volume = finalVolume;
}

export function getNormalizedVolume(
  track: Track | null | undefined,
  targetLUFS: number,
  baseVolume: number,
  enabled: boolean,
): number {
  if (!enabled || !track) return Math.max(0, Math.min(1, baseVolume));
  return Math.max(
    0,
    Math.min(
      1,
      baseVolume * dbToLinear(calculateNormalizationGain(track, targetLUFS)),
    ),
  );
}

/**
 * Analyze audio buffer and calculate actual LUFS
 * This is a placeholder for real audio analysis
 */
export async function analyzeTrackLoudness(
  audioBuffer: AudioBuffer,
): Promise<number> {
  const channels = Math.max(1, audioBuffer.numberOfChannels);
  const frames = audioBuffer.length;
  if (!frames) return -70;
  let sumSquares = 0;
  for (let channel = 0; channel < channels; channel += 1) {
    const data = audioBuffer.getChannelData(channel);
    for (let index = 0; index < data.length; index += 1) {
      sumSquares += data[index] * data[index];
    }
  }
  const rms = Math.sqrt(sumSquares / (frames * channels));
  return rms > 0 ? 20 * Math.log10(rms) : -70;
}

/**
 * Clear normalization cache (useful when target LUFS changes)
 */
export function clearNormalizationCache(): void {
  normalizationCache.clear();
}

/**
 * Get normalization info for a track (for debugging/display)
 */
export function getNormalizationInfo(
  trackId: string,
): NormalizationData | null {
  return normalizationCache.get(trackId) || null;
}
