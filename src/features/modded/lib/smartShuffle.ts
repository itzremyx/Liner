import type { Track } from "@/shared/types";
import { getScoutcodeApiKey } from "../store/moddedStore";

/**
 * Smart Shuffle uses AI to analyze tracks and create an intelligent shuffle order.
 * Instead of pure randomness, it considers:
 * - Genre transitions
 * - Energy flow
 * - Artist variety
 * - Tempo progression
 */

/**
 * Simple heuristic-based smart shuffle (no API call needed)
 * Creates a more pleasant listening experience by avoiding jarring transitions
 */
export function heuristicSmartShuffle(tracks: Track[]): Track[] {
  if (tracks.length <= 2) return [...tracks];

  const shuffled = [...tracks];
  const result: Track[] = [];

  // Start with a random track
  const startIndex = Math.floor(Math.random() * shuffled.length);
  result.push(shuffled[startIndex]);
  shuffled.splice(startIndex, 1);

  while (shuffled.length > 0) {
    const lastTrack = result[result.length - 1];
    let bestIndex = 0;
    let bestScore = -Infinity;

    // Score each remaining track based on how well it follows the last one
    shuffled.forEach((track, index) => {
      let score = 0;

      // Prefer different artists (avoid repetition)
      if (track.artistId !== lastTrack.artistId) {
        score += 10;
      }

      // Slight preference for similar duration (smooth transitions)
      const durationDiff = Math.abs(
        (track.durationMs || 180000) - (lastTrack.durationMs || 180000),
      );
      score += Math.max(0, 5 - durationDiff / 60000);

      // Add some randomness to avoid being too predictable
      score += Math.random() * 8;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });

    result.push(shuffled[bestIndex]);
    shuffled.splice(bestIndex, 1);
  }

  return result;
}

/**
 * AI-powered smart shuffle using Scoutcode API
 * Analyzes tracks deeply and creates optimal ordering
 */
export async function aiSmartShuffle(tracks: Track[]): Promise<Track[]> {
  if (tracks.length <= 2) return [...tracks];

  const apiKey = getScoutcodeApiKey();
  if (!apiKey) {
    // Fallback to heuristic if no API key
    return heuristicSmartShuffle(tracks);
  }

  try {
    const trackList = tracks
      .slice(0, 50) // Limit to avoid huge prompts
      .map(
        (t, i) =>
          `${i + 1}. "${t.title}" by ${t.artists} (${Math.round((t.durationMs || 0) / 1000)}s)`,
      )
      .join("\n");

    const response = await fetch("https://scoutcode.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "MiniMax-M3.1-Flash",
        messages: [
          {
            role: "system",
            content:
              "You are a music DJ expert. Create smooth, engaging playlists by ordering tracks intelligently.",
          },
          {
            role: "user",
            content: `I have these tracks. Create a smart shuffle order that flows well - consider artist variety, energy transitions, and tempo. Return ONLY a comma-separated list of track numbers (e.g., "3,7,1,5,2,8,4,6") with no other text:\n\n${trackList}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI shuffle failed: ${response.status}`);
    }

    const data = await response.json();
    const orderText = data.choices?.[0]?.message?.content?.trim() || "";
    const order = orderText
      .split(/[,\s]+/)
      .map((n: string) => parseInt(n.trim(), 10) - 1)
      .filter((n: number) => n >= 0 && n < tracks.length);

    // If AI returns valid order, use it
    if (
      order.length === tracks.length &&
      new Set(order).size === order.length
    ) {
      return order.map((i: number) => tracks[i]);
    }

    // Fallback to heuristic
    return heuristicSmartShuffle(tracks);
  } catch (error) {
    console.warn("AI smart shuffle failed, using heuristic:", error);
    return heuristicSmartShuffle(tracks);
  }
}

/**
 * Main smart shuffle function that chooses between heuristic and AI
 */
export async function smartShuffle(
  tracks: Track[],
  useAI: boolean = false,
): Promise<Track[]> {
  if (!useAI) {
    return heuristicSmartShuffle(tracks);
  }
  return aiSmartShuffle(tracks);
}
