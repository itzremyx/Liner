import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui";
import { useTranslation } from "@/languages";
import {
  getWrappedStats,
  useModdedAnalyticsStore,
} from "../store/moddedAnalyticsStore";

function formatDate(timestamp: number, locale: string) {
  return new Date(timestamp).toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ModdedStatsPage() {
  const { t, locale } = useTranslation();
  const events = useModdedAnalyticsStore((state) => state.events);
  const clearStats = useModdedAnalyticsStore((state) => state.clear);
  const stats = useMemo(() => getWrappedStats(events), [events]);

  const recent = useMemo(() => events.slice(0, 25), [events]);
  const maxTrackCount = stats.topTracks[0]?.count ?? 1;
  const maxArtistCount = stats.topArtists[0]?.[1] ?? 1;

  return (
    <div className="h-full w-full overflow-y-auto bg-transparent px-[18px] pt-(--page-inset-top) pb-(--page-inset-bottom)">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-[18px] pb-[24px]">
        <header className="flex flex-wrap items-start justify-between gap-[14px] pt-[10px]">
          <div>
            <div className="text-caption font-[600] uppercase tracking-[0.14em] text-text-tertiary">
              {t("modded.stats.eyebrow")}
            </div>
            <h1 className="m-0 mt-[4px] text-[30px] font-[700] tracking-[-0.03em] text-text-primary">
              {t("modded.stats.title")}
            </h1>
            <p className="m-0 mt-[6px] max-w-[680px] text-body text-text-secondary">
              {t("modded.stats.description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-[8px]">
            <Link to="/modded" className="no-underline">
              <Button size="sm" variant="secondary">
                {t("modded.stats.back")}
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearStats}
              disabled={events.length === 0}
            >
              {t("modded.stats.clear")}
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-[10px] md:grid-cols-4">
          {[
            [t("modded.stats.minutes"), stats.minutes],
            [t("modded.stats.unique_tracks"), stats.uniqueTracks],
            [t("modded.stats.unique_artists"), stats.uniqueArtists],
            [t("modded.stats.events"), events.length],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-item bg-bg-elevated/70 p-[14px]"
            >
              <div className="text-caption text-text-tertiary">{label}</div>
              <div className="mt-[3px] text-[24px] font-[650] text-text-primary">
                {value}
              </div>
            </div>
          ))}
        </section>

        {events.length === 0 ? (
          <section className="rounded-item bg-bg-elevated/70 p-[24px] text-center">
            <div className="text-heading font-[600] text-text-primary">
              {t("modded.stats.empty.title")}
            </div>
            <p className="m-0 mt-[6px] text-body text-text-secondary">
              {t("modded.stats.empty.description")}
            </p>
          </section>
        ) : (
          <>
            <section className="grid gap-[14px] lg:grid-cols-2">
              <div className="rounded-item bg-bg-elevated/70 p-[16px]">
                <h2 className="m-0 text-heading font-[600] text-text-primary">
                  {t("modded.stats.top_tracks")}
                </h2>
                <div className="mt-[14px] grid gap-[8px]">
                  {stats.topTracks.map(({ event, count }, index) => (
                    <div
                      key={event.trackId}
                      className="flex items-center gap-[10px]"
                    >
                      <span className="w-[16px] shrink-0 text-caption text-text-tertiary">
                        {index + 1}
                      </span>
                      {event.coverUrl ? (
                        <img
                          src={event.coverUrl}
                          alt=""
                          className="h-[34px] w-[34px] shrink-0 rounded-[6px] object-cover"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-label text-text-primary">
                          {event.title}
                        </div>
                        <div className="truncate text-caption text-text-tertiary">
                          {event.artists}
                        </div>
                        <div className="mt-[4px] h-[3px] overflow-hidden rounded-full bg-bg-primary/70">
                          <div
                            className="h-full rounded-full bg-accent-primary"
                            style={{
                              width: `${Math.max(6, (count / maxTrackCount) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="shrink-0 text-caption text-text-tertiary">
                        {count}×
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-item bg-bg-elevated/70 p-[16px]">
                <h2 className="m-0 text-heading font-[600] text-text-primary">
                  {t("modded.stats.top_artists")}
                </h2>
                <div className="mt-[14px] grid gap-[8px]">
                  {stats.topArtists.map(([artist, count], index) => (
                    <div key={artist} className="flex items-center gap-[10px]">
                      <span className="w-[16px] shrink-0 text-caption text-text-tertiary">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-label text-text-primary">
                          {artist}
                        </div>
                        <div className="mt-[4px] h-[3px] overflow-hidden rounded-full bg-bg-primary/70">
                          <div
                            className="h-full rounded-full bg-accent-primary"
                            style={{
                              width: `${Math.max(6, (count / maxArtistCount) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="shrink-0 text-caption text-text-tertiary">
                        {count}×
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-item bg-bg-elevated/70 p-[16px]">
              <h2 className="m-0 text-heading font-[600] text-text-primary">
                {t("modded.stats.recent")}
              </h2>
              <div className="mt-[12px] grid gap-[2px]">
                {recent.map((event) => (
                  <div
                    key={`${event.trackId}-${event.playedAt}`}
                    className="flex items-center gap-[10px] rounded-control px-[6px] py-[6px] hover:bg-border-alpha-14"
                  >
                    {event.coverUrl ? (
                      <img
                        src={event.coverUrl}
                        alt=""
                        className="h-[30px] w-[30px] shrink-0 rounded-[5px] object-cover"
                      />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-label text-text-primary">
                        {event.title}
                      </div>
                      <div className="truncate text-caption text-text-tertiary">
                        {event.artists}
                      </div>
                    </div>
                    <span className="shrink-0 text-caption text-text-tertiary">
                      {formatDate(event.playedAt, locale)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
