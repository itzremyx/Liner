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

function artistInitial(name: string) {
  const letter = name.trim().charAt(0);
  return letter ? letter.toUpperCase() : "·";
}

export default function ModdedStatsPage() {
  const { t, locale } = useTranslation();
  const events = useModdedAnalyticsStore((state) => state.events);
  const clearStats = useModdedAnalyticsStore((state) => state.clear);
  const stats = useMemo(() => getWrappedStats(events), [events]);
  const recent = useMemo(() => events.slice(0, 12), [events]);

  const facts = [
    [t("modded.stats.minutes"), stats.minutes],
    [t("modded.stats.unique_tracks"), stats.uniqueTracks],
    [t("modded.stats.unique_artists"), stats.uniqueArtists],
    [t("modded.stats.events"), events.length],
  ];

  return (
    <div className="h-full w-full overflow-y-auto bg-transparent px-6 pt-(--page-inset-top) pb-(--page-inset-bottom)">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-8 pb-8">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-border-alpha-14 pt-4 pb-6">
          <div className="max-w-[640px]">
            <p className="m-0 text-caption font-[600] uppercase tracking-[0.16em] text-accent-primary">
              {t("modded.stats.eyebrow")}
            </p>
            <h1 className="m-0 mt-3 font-roboto-flex-heading text-[44px] leading-[0.95] tracking-[-0.04em] text-text-primary">
              {t("modded.stats.title")}
            </h1>
            <p className="m-0 mt-3 max-w-[520px] text-[15px] leading-[1.45] text-text-secondary">
              {t("modded.stats.description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
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

        <section className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4">
          {facts.map(([label, value]) => (
            <div key={label} className="border-t border-border-alpha-14 pt-3">
              <div className="text-[34px] leading-none font-[650] tracking-[-0.04em] text-text-primary">
                {value}
              </div>
              <div className="mt-2 text-caption text-text-tertiary">
                {label}
              </div>
            </div>
          ))}
        </section>

        {events.length === 0 ? (
          <section className="rounded-panel border border-border-alpha-14 px-6 py-12 text-center">
            <h2 className="m-0 text-[22px] font-[650] tracking-[-0.03em] text-text-primary">
              {t("modded.stats.empty.title")}
            </h2>
            <p className="m-0 mt-2 text-[15px] text-text-secondary">
              {t("modded.stats.empty.description")}
            </p>
          </section>
        ) : (
          <>
            <section>
              <h2 className="m-0 text-[22px] font-[650] tracking-[-0.03em] text-text-primary">
                {t("modded.stats.top_tracks")}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {stats.topTracks.map(({ event, count }, index) => (
                  <article key={event.trackId} className="min-w-0">
                    <div className="relative aspect-square overflow-hidden rounded-panel bg-bg-elevated">
                      {event.coverUrl ? (
                        <img
                          src={event.coverUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                      <span className="absolute top-2 left-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-black/70 px-2 text-[12px] font-[650] text-white">
                        {index + 1}
                      </span>
                    </div>
                    <div className="mt-2 truncate text-label font-[650] text-text-primary">
                      {event.title}
                    </div>
                    <div className="truncate text-caption text-text-tertiary">
                      {event.artists}
                    </div>
                    <div className="mt-1 text-caption text-accent-primary">
                      {count}×
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <h2 className="m-0 text-[22px] font-[650] tracking-[-0.03em] text-text-primary">
                  {t("modded.stats.top_artists")}
                </h2>
                <ol className="m-0 mt-4 grid list-none gap-2 p-0">
                  {stats.topArtists.map(([artist, count], index) => (
                    <li
                      key={artist}
                      className="flex items-center gap-3 border-t border-border-alpha-14 py-2"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-elevated text-[14px] font-[650] text-accent-primary">
                        {artistInitial(artist)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-label font-[650] text-text-primary">
                          {artist}
                        </span>
                        <span className="text-caption text-text-tertiary">
                          {index + 1}
                        </span>
                      </span>
                      <span className="text-caption text-text-secondary">
                        {count}×
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h2 className="m-0 text-[22px] font-[650] tracking-[-0.03em] text-text-primary">
                  {t("modded.stats.recent")}
                </h2>
                <div className="mt-4 grid gap-1">
                  {recent.map((event) => (
                    <div
                      key={`${event.trackId}-${event.playedAt}`}
                      className="flex items-center gap-3 rounded-control px-2 py-2 hover:bg-fill"
                    >
                      {event.coverUrl ? (
                        <img
                          src={event.coverUrl}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-control object-cover"
                        />
                      ) : (
                        <span className="h-10 w-10 shrink-0 rounded-control bg-bg-elevated" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-label text-text-primary">
                          {event.title}
                        </span>
                        <span className="block truncate text-caption text-text-tertiary">
                          {event.artists}
                        </span>
                      </span>
                      <span className="shrink-0 text-caption text-text-tertiary">
                        {formatDate(event.playedAt, locale)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
