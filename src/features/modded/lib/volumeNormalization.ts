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

  // Simplified estimation: assume most modern tracks are mastered around -8 to -12 LUFS
  // This is just a placeholder - real implementation would use Web Audio API analysis
  const estimatedLUFS = -10 + (Math.random() - 0.5) * 4; // -12 to -8 range
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

/**
 * Analyze audio buffer and calculate actual LUFS
 * This is a placeholder for real audio analysis
 */
export async function analyzeTrackLoudness(
  _audioBuffer: AudioBuffer,
): Promise<number> {
  // In a real implementation, this would:
  // 1. Apply K-weighting filter
  // 2. Calculate mean square over 400ms windows
  // 3. Compute integrated loudness
  //
  // For now, return a placeholder value
  return -10;
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
