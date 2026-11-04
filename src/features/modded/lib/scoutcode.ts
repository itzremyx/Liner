import type { Track } from "@/shared/types";
import { getScoutcodeApiKey } from "../store/moddedStore";

export const SCOUTCODE_ENDPOINT = "https://scoutcode.dev/v1";
export const SCOUTCODE_MODEL = "MiniMax-M3.1-Flash";

export interface ScoutcodeRecommendation {
  title: string;
  artist?: string;
  reason?: string;
}

interface ScoutcodeResponse {
  choices?: Array<{ message?: { content?: string } }>;
  recommendations?: ScoutcodeRecommendation[];
}

function extractRecommendations(value: unknown): ScoutcodeRecommendation[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is ScoutcodeRecommendation =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as ScoutcodeRecommendation).title === "string",
    );
  }

  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return extractRecommendations(parsed);
  } catch {
    return value
      .split("\n")
      .map((line) => line.replace(/^[-*\d.)]+\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 8)
      .map((title) => ({ title }));
  }
}

export async function getScoutcodeRecommendations(
  tracks: readonly Track[],
  signal?: AbortSignal,
): Promise<ScoutcodeRecommendation[]> {
  const apiKey = getScoutcodeApiKey();
  if (!apiKey) throw new Error("Scoutcode API key is not configured.");

  const listeningContext = tracks.slice(-12).map((track) => ({
    title: track.title,
    artist: track.artists,
    durationMs: track.durationMs,
  }));

  const response = await fetch(`${SCOUTCODE_ENDPOINT}/chat/completions`, {
    method: "POST",
    signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: SCOUTCODE_MODEL,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            'Recommend eight songs based on the listening context. Return JSON only: [{"title":"...","artist":"...","reason":"..."}].',
        },
        {
          role: "user",
          content: JSON.stringify({ listeningContext }),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Scoutcode request failed (${response.status}).`);
  }

  const payload = (await response.json()) as ScoutcodeResponse;
  return extractRecommendations(
    payload.recommendations ?? payload.choices?.[0]?.message?.content,
  ).slice(0, 8);
}
