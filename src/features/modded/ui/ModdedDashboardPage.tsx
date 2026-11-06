import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  LuArrowUpRight,
  LuChartBar,
  LuFolderOpen,
  LuPalette,
  LuPin,
  LuSparkles,
  LuVolume2,
} from "react-icons/lu";
import { useTranslation } from "@/languages";
import { useModdedSettingsStore } from "@/features/modded/store/moddedStore";
import { useModalStore } from "@/features/library";
import {
  getWrappedStats,
  useModdedAnalyticsStore,
} from "../store/moddedAnalyticsStore";

const cardClass =
  "group relative flex min-h-[132px] flex-col justify-between overflow-hidden rounded-panel border border-border-alpha-14 bg-bg-elevated/80 p-5 text-left text-inherit no-underline shadow-[0_10px_28px_rgba(28,22,18,0.08)]";

export default function ModdedDashboardPage() {
  const { t } = useTranslation();
  const openSettings = useModalStore((state) => state.openSettings);
  const events = useModdedAnalyticsStore((state) => state.events);
  const stats = useMemo(() => getWrappedStats(events), [events]);
  const pinnedItems = useModdedSettingsStore((state) => state.pinnedItems);

  const destinations = [
    {
      id: "statistics",
      title: t("modded.hub.statistics.title"),
      description: t("modded.hub.statistics.description"),
      icon: <LuChartBar size={18} />,
      to: "/statistics",
    },
    {
      id: "home",
      title: t("modded.hub.home.title"),
      description: t("modded.hub.home.description"),
      icon: <LuSparkles size={18} />,
      to: "/",
    },
    {
      id: "local",
      title: t("modded.hub.local.title"),
      description: t("modded.hub.local.description"),
      icon: <LuFolderOpen size={18} />,
      to: "/library/local",
    },
  ];

  const settings = [
    {
      id: "ai",
      tab: "Ai" as const,
      title: t("modded.hub.ai.title"),
      description: t("modded.hub.ai.description"),
      icon: <LuSparkles size={18} />,
    },
    {
      id: "audio",
      tab: "Audio" as const,
      title: t("modded.hub.audio.title"),
      description: t("modded.hub.audio.description"),
      icon: <LuVolume2 size={18} />,
    },
    {
      id: "appearance",
      tab: "Appearance" as const,
      title: t("modded.hub.appearance.title"),
      description: t("modded.hub.appearance.description"),
      icon: <LuPalette size={18} />,
    },
  ];

  const facts = [
    [t("modded.stats.minutes"), stats.minutes],
    [t("modded.stats.unique_tracks"), stats.uniqueTracks],
    [t("modded.stats.unique_artists"), stats.uniqueArtists],
  ];

  return (
    <div className="relative h-full w-full overflow-y-auto overflow-x-hidden bg-transparent pt-(--page-inset-top) pb-(--page-inset-bottom)">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-8 px-6 pb-8">
        <header className="flex min-h-[34vh] flex-col justify-end gap-5 border-b border-border-alpha-14 pb-8">
          <p className="m-0 text-caption font-[600] uppercase tracking-[0.16em] text-accent-primary">
            {t("modded.hub.eyebrow")}
          </p>
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-[640px]">
              <h1 className="m-0 font-roboto-flex-heading text-[52px] leading-[0.95] tracking-[-0.04em] text-text-primary">
                {t("modded.hub.title")}
              </h1>
              <p className="m-0 mt-4 max-w-[520px] text-[16px] leading-[1.45] text-text-secondary">
                {t("modded.hub.description")}
              </p>
            </div>
            <dl className="hidden min-w-[240px] grid-cols-1 gap-3 md:grid">
              {facts.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-4 border-t border-border-alpha-14 pt-2"
                >
                  <dt className="text-caption text-text-tertiary">{label}</dt>
                  <dd className="m-0 text-[22px] font-[650] tracking-[-0.03em] text-text-primary">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-3">
          {destinations.map((item) => (
            <Link key={item.id} to={item.to} className={cardClass}>
              <span className="flex h-9 w-9 items-center justify-center rounded-control bg-fill text-accent-primary">
                {item.icon}
              </span>
              <span className="flex items-end justify-between gap-3">
                <span>
                  <span className="block text-label font-[650] text-text-primary">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-caption leading-[1.4] text-text-tertiary">
                    {item.description}
                  </span>
                </span>
                <LuArrowUpRight
                  size={16}
                  className="shrink-0 text-text-tertiary"
                />
              </span>
            </Link>
          ))}
        </section>

        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="m-0 text-[22px] font-[650] tracking-[-0.03em] text-text-primary">
              {t("modded.hub.settings_title")}
            </h2>
            {pinnedItems.length > 0 && (
              <span className="flex items-center gap-1.5 text-caption text-text-tertiary">
                <LuPin size={13} />
                {pinnedItems.length} {t("modded.hub.pinned_count")}
              </span>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {settings.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openSettings(item.tab)}
                className={`${cardClass} cursor-pointer`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-control bg-fill text-text-secondary group-hover:text-accent-primary">
                  {item.icon}
                </span>
                <span>
                  <span className="block text-label font-[650] text-text-primary">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-caption leading-[1.4] text-text-tertiary">
                    {item.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
