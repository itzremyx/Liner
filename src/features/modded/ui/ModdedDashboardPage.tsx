import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  LuArrowUpRight,
  LuChartBar,
  LuFolderOpen,
  LuLayoutDashboard,
  LuPalette,
  LuPin,
  LuSparkles,
  LuVolume2,
} from "react-icons/lu";
import { Button } from "@/shared/ui";
import { useTranslation } from "@/languages";
import { useModdedSettingsStore } from "@/features/modded/store/moddedStore";
import { useModalStore } from "@/features/library";
import {
  getWrappedStats,
  useModdedAnalyticsStore,
} from "../store/moddedAnalyticsStore";
import MixFluidSquare from "@/features/home/ui/MixFluidSquare";

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-roboto-flex), sans-serif",
  fontWeight: 564,
  fontVariationSettings:
    "'wght' 564, 'GRAD' 105, 'XOPQ' 100, 'wdth' 134, 'opsz' 144",
};

export default function ModdedDashboardPage() {
  const { t } = useTranslation();
  const openSettings = useModalStore((state) => state.openSettings);
  const events = useModdedAnalyticsStore((state) => state.events);
  const stats = useMemo(() => getWrappedStats(events), [events]);
  const pinnedItems = useModdedSettingsStore((state) => state.pinnedItems);

  const links = [
    {
      id: "statistics",
      title: t("modded.hub.statistics.title"),
      description: t("modded.hub.statistics.description"),
      icon: <LuChartBar size={20} />,
      to: "/statistics",
      accent: "to-[#8b5cf6]",
    },
    {
      id: "home",
      title: t("modded.hub.home.title"),
      description: t("modded.hub.home.description"),
      icon: <LuSparkles size={20} />,
      to: "/",
      accent: "to-[#f59e0b]",
    },
    {
      id: "local",
      title: t("modded.hub.local.title"),
      description: t("modded.hub.local.description"),
      icon: <LuFolderOpen size={20} />,
      to: "/library/local",
      accent: "to-[#10b981]",
    },
  ];

  const settingsLinks = [
    {
      id: "ai",
      tab: "Ai" as const,
      title: t("modded.hub.ai.title"),
      description: t("modded.hub.ai.description"),
      icon: <LuSparkles size={20} />,
      accent: "to-[#8b5cf6]",
    },
    {
      id: "audio",
      tab: "Audio" as const,
      title: t("modded.hub.audio.title"),
      description: t("modded.hub.audio.description"),
      icon: <LuVolume2 size={20} />,
      accent: "to-[#06b6d4]",
    },
    {
      id: "appearance",
      tab: "Appearance" as const,
      title: t("modded.hub.appearance.title"),
      description: t("modded.hub.appearance.description"),
      icon: <LuPalette size={20} />,
      accent: "to-[#ec4899]",
    },
  ];

  const statCards = [
    [t("modded.stats.minutes"), stats.minutes],
    [t("modded.stats.unique_tracks"), stats.uniqueTracks],
    [t("modded.stats.unique_artists"), stats.uniqueArtists],
    [t("modded.stats.events"), events.length],
  ];

  return (
    <div
      className="relative h-full w-full overflow-y-auto overflow-x-hidden bg-transparent pt-(--page-inset-top) pb-(--page-inset-bottom)"
      style={{ animation: "page-enter 200ms ease-out" }}
    >
      <div className="relative z-1 grid w-full grid-cols-1 items-start">
        <div className="col-start-1 row-start-1 w-full pb-[16px]">
          {/* Hero */}
          <div className="px-3 flex items-center justify-between pt-[6px]">
            <div className="flex items-center gap-3">
              <MixFluidSquare />
              <h2
                className="m-0 font-roboto-flex-heading text-text-primary text-[36px] leading-none tracking-tight"
                style={headingStyle}
              >
                {t("modded.hub.title")}
              </h2>
            </div>
          </div>
          <div className="px-3 mt-[6px]">
            <p className="m-0 max-w-[700px] text-body text-text-secondary">
              {t("modded.hub.description")}
            </p>
          </div>
          <div className="px-3 mt-[4px] text-caption font-[600] uppercase tracking-[0.14em] text-text-tertiary">
            {t("statistics.eyebrow")} — {t("modded.hub.eyebrow")}
          </div>

          {/* Statistics */}
          <section className="grid grid-cols-2 gap-[14px] px-3 md:grid-cols-4 mt-[22px]">
            {statCards.map(([label, value]) => (
              <div
                key={label}
                className="relative overflow-hidden rounded-item border border-white/5 bg-gradient-to-b from-bg-elevated/90 to-bg-elevated/40 p-[14px] shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
              >
                <div className="text-caption text-text-tertiary">{label}</div>
                <div className="mt-[3px] text-[26px] font-[700] tracking-[-0.02em] text-text-primary">
                  {value}
                </div>
                <div className="pointer-events-none absolute -right-[26px] -top-[26px] h-[80px] w-[80px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.18),transparent_65%)]" />
              </div>
            ))}
          </section>

          {/* Destination links */}
          <section className="mt-[22px]">
            <div className="px-3 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center text-text-tertiary [&>svg]:h-5 [&>svg]:w-5">
                    <LuLayoutDashboard size={20} />
                  </div>
                  <h2
                    className="m-0 font-roboto-flex-heading text-text-primary text-[24px] leading-none tracking-tight"
                    style={headingStyle}
                  >
                    {t("modded.hub.title")}
                  </h2>
                </div>
              </div>
            </div>
            <div className="mt-[12px] grid gap-[12px] px-3 md:grid-cols-3">
              {links.map((link) => (
                <Link
                  key={link.id}
                  to={link.to}
                  className="group relative flex min-h-[120px] flex-col justify-between overflow-hidden rounded-item border border-white/5 bg-gradient-to-b from-bg-elevated/90 to-bg-elevated/40 p-[16px] text-inherit no-underline shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-[2px]"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent ${link.accent} opacity-[0.10] transition-opacity duration-200 group-hover:opacity-[0.18]`}
                  />
                  <div className="flex items-start justify-between">
                    <span className="rounded-control bg-bg-primary/60 p-[8px] text-text-secondary transition-colors group-hover:text-text-primary">
                      {link.icon}
                    </span>
                    <LuArrowUpRight
                      size={18}
                      className="text-text-tertiary transition-colors group-hover:text-text-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-label font-[600] text-text-primary">
                      {link.title}
                    </span>
                    <span className="text-caption leading-[1.35] text-text-tertiary">
                      {link.description}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Settings shortcuts */}
          <section className="mt-[22px]">
            <div className="px-3 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center text-text-tertiary [&>svg]:h-5 [&>svg]:w-5">
                    <LuPalette size={20} />
                  </div>
                  <h2
                    className="m-0 font-roboto-flex-heading text-text-primary text-[24px] leading-none tracking-tight"
                    style={headingStyle}
                  >
                    {t("modded.hub.settings_title")}
                  </h2>
                </div>
                <p className="m-0 mt-0.5 font-normal text-body text-text-tertiary">
                  {t("modded.hub.settings_description")}
                </p>
              </div>
            </div>
            <div className="mt-[12px] grid gap-[12px] px-3 md:grid-cols-3">
              {settingsLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => openSettings(link.tab)}
                  className="group relative flex min-h-[108px] cursor-pointer flex-col justify-between overflow-hidden rounded-item border border-white/5 bg-gradient-to-b from-bg-elevated/90 to-bg-elevated/40 p-[16px] text-left transition-transform duration-200 hover:-translate-y-[2px]"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent ${link.accent} opacity-[0.10] transition-opacity duration-200 group-hover:opacity-[0.18]`}
                  />
                  <div className="flex items-start justify-between">
                    <span className="rounded-control bg-bg-primary/60 p-[8px] text-text-secondary transition-colors group-hover:text-text-primary">
                      {link.icon}
                    </span>
                    <LuArrowUpRight
                      size={18}
                      className="text-text-tertiary transition-colors group-hover:text-text-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-label font-[600] text-text-primary">
                      {link.title}
                    </span>
                    <span className="text-caption leading-[1.35] text-text-tertiary">
                      {link.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-[14px] flex items-center gap-[12px] px-3">
              <Link to="/statistics" className="no-underline">
                <Button size="sm" variant="secondary">
                  {t("modded.hub.open_statistics")}
                </Button>
              </Link>
              {pinnedItems.length > 0 && (
                <span className="flex items-center gap-[6px] text-caption text-text-tertiary">
                  <LuPin size={13} className="text-text-secondary" />
                  {pinnedItems.length} {t("modded.hub.pinned_count")}
                </span>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
