import type { Lyric } from "@braccato/parsers";
import { getScoutcodeApiKey } from "../store/moddedStore";

export async function translateLyricLines(
  lyrics: readonly Lyric[],
  targetLanguage: string,
  signal?: AbortSignal,
): Promise<Lyric[]> {
  const apiKey = getScoutcodeApiKey();
  if (!apiKey) throw new Error("Scoutcode API key is not configured.");
  const lines = lyrics.map((line) => line.words ?? "");
  const response = await fetch("https://scoutcode.dev/v1/chat/completions", {
    method: "POST",
    signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "MiniMax-M3.1-Flash",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `Translate each lyric line to ${targetLanguage}. Return a JSON array with exactly one translated string per input line. Keep line order and do not add commentary.`,
        },
        { role: "user", content: JSON.stringify(lines) },
      ],
    }),
  });
  if (!response.ok) throw new Error(`Translation failed (${response.status}).`);
  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content ?? "[]";
  const parsed = JSON.parse(content.replace(/^```json\s*|\s*```$/g, ""));
  if (!Array.isArray(parsed) || parsed.length !== lyrics.length) {
    throw new Error("Translation returned an invalid line count.");
  }
  return lyrics.map((line, index) => ({
    ...line,
    words: typeof parsed[index] === "string" ? parsed[index] : line.words,
  }));
}
