import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Refresh3Line, Sparkles2Fill } from "@mingcute/react";
import { useTranslation } from "@/languages";
import { SectionHeading } from "./SectionHeading";
import { useModdedSettingsStore } from "@/features/modded/store/moddedStore";
import { useModdedAnalyticsStore } from "@/features/modded/store/moddedAnalyticsStore";
import {
  getScoutcodeRecommendations,
  type ScoutcodeRecommendation,
} from "@/features/modded/lib/scoutcode";

export function HomeRecommendationsSection({
  marginTop = "mt-[22px]",
}: {
  marginTop?: string;
}) {
  const { t } = useTranslation();
  const events = useModdedAnalyticsStore((state) => state.events);
  const aiRecommendationsEnabled = useModdedSettingsStore(
    (state) => state.aiRecommendationsEnabled,
  );
  const personalizedHome = useModdedSettingsStore(
    (state) => state.personalizedHome,
  );
  const apiKey = useModdedSettingsStore((state) => state.scoutcodeApiKey);

  const [recommendations, setRecommendations] = useState<
    ScoutcodeRecommendation[]
  >([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const lastContext = useRef<string | null>(null);

  const contextTracks = useMemo(
    () =>
      events.slice(0, 12).map((event) => ({
        id: event.trackId,
        title: event.title,
        artists: event.artists,
        coverUrl: event.coverUrl,
        durationMs: event.durationMs,
        playCount: 0,
      })),
    [events],
  );
  const contextKey = contextTracks.map((track) => track.id).join("|");

  const load = useCallback(async () => {
    if (!apiKey || contextTracks.length === 0) return;
    setStatus("loading");
    try {
      setRecommendations(await getScoutcodeRecommendations(contextTracks));
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }, [apiKey, contextTracks]);

  useEffect(() => {
    if (
      !aiRecommendationsEnabled ||
      !personalizedHome ||
      !apiKey ||
      contextTracks.length === 0
    ) {
      return;
    }
    if (lastContext.current === contextKey) return;
    lastContext.current = contextKey;
    void load();
  }, [
    aiRecommendationsEnabled,
    personalizedHome,
    apiKey,
    contextKey,
    contextTracks.length,
    load,
  ]);

  if (
    !aiRecommendationsEnabled ||
    !personalizedHome ||
    contextTracks.length === 0
  ) {
    return null;
  }

  return (
    <section>
      <SectionHeading
        title={t("modded.recommendations.title")}
        subtitle={t("modded.recommendations.description")}
        icon={<Sparkles2Fill />}
        marginTop={marginTop}
        badge={
          <button
            type="button"
            onClick={() => void load()}
            disabled={!apiKey || status === "loading"}
            className="ml-[2px] inline-flex h-[30px] w-[30px] items-center justify-center rounded-control border-0 bg-transparent text-text-tertiary transition-colors hover:bg-fill hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t("modded.recommendations.refresh")}
          >
            <Refresh3Line size={18} />
          </button>
        }
      />

      <div className="mt-[12px] px-3">
        {!apiKey ? (
          <p className="m-0 text-body text-text-tertiary">
            {t("modded.recommendations.missing_key")}
          </p>
        ) : status === "error" ? (
          <p className="m-0 text-body text-text-tertiary">
            {t("modded.recommendations.error")}
          </p>
        ) : status === "loading" && recommendations.length === 0 ? (
          <div className="grid gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[92px] animate-pulse rounded-item bg-bg-elevated/60"
              />
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <p className="m-0 text-body text-text-tertiary">
            {t("modded.recommendations.empty")}
          </p>
        ) : (
          <div className="grid gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="flex min-w-0 flex-col gap-[4px] rounded-item bg-bg-elevated/70 p-[12px]"
              >
                <div className="truncate text-label font-[600] text-text-primary">
                  {item.title}
                </div>
                {item.artist ? (
                  <div className="truncate text-caption text-text-secondary">
                    {item.artist}
                  </div>
                ) : null}
                {item.reason ? (
                  <div className="line-clamp-2 text-caption text-text-tertiary">
                    {item.reason}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
