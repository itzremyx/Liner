import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { sidebarNavItems } from "@/features/navigation/data/navigation";
import { useTranslation } from "@/languages";
import { Tooltip } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useOfflineModeStore } from "@/features/connectivity";
import { useModdedSettingsStore } from "@/features/modded/store/moddedStore";

export interface SidebarNavItemsProps {
  searchOpen: boolean;
  onSearchToggle: () => void;
}

export function SidebarNavItems({
  searchOpen,
  onSearchToggle,
}: SidebarNavItemsProps) {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const offline = useOfflineModeStore((state) => state.offline);
  const pinnedItems = useModdedSettingsStore((state) => state.pinnedItems);

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const isRouteActive = (href: string) => {
    if (pendingHref) return href === pendingHref;
    if (href === "/") {
      return pathname === "/" || pathname === "/home";
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const isItemActive = (id: string, href?: string) => {
    if (id === "search") {
      return searchOpen;
    }
    return href ? isRouteActive(href) : false;
  };

  return (
    <>
      {sidebarNavItems
        .filter((item) => item.id !== "settings")
        .filter(
          (item) =>
            !offline || item.id === "library" || item.id === "statistics",
        )
        .map((item) => {
          const active = isItemActive(item.id, item.href);
          const Icon = item.Icon;
          const tooltipLabel = t(`common.sidebar.${item.id}`) || item.label;

          if (item.id === "search") {
            return (
              <Tooltip
                key={item.id}
                content={tooltipLabel}
                side="right"
                sideOffset={12}
              >
                <button
                  type="button"
                  aria-pressed={searchOpen}
                  onClick={onSearchToggle}
                  className="group relative inline-flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer active:scale-[0.96] transition-transform duration-100"
                >
                  <Icon
                    size={26}
                    className={cn(
                      "relative z-10 text-text-primary transition-opacity duration-150 ease-out",
                      active
                        ? "opacity-100"
                        : "opacity-55 group-hover:opacity-90",
                    )}
                  />
                </button>
              </Tooltip>
            );
          }

          return (
            <Tooltip
              key={item.id}
              content={tooltipLabel}
              side="right"
              sideOffset={12}
            >
              <Link
                key={item.id}
                to={item.href!}
                aria-current={active ? "page" : undefined}
                onPointerDown={(event) => {
                  if (event.button === 0) setPendingHref(item.href!);
                }}
                onPointerLeave={(event) => {
                  if (event.buttons & 1) setPendingHref(null);
                }}
                onPointerCancel={() => setPendingHref(null)}
                className="group relative inline-flex items-center justify-center cursor-pointer active:scale-[0.96] transition-transform duration-100"
              >
                <Icon
                  size={26}
                  className={cn(
                    "relative z-10 text-text-primary",
                    active
                      ? "opacity-100"
                      : "opacity-55 transition-opacity duration-150 ease-out group-hover:opacity-90",
                  )}
                />
              </Link>
            </Tooltip>
          );
        })}
      {pinnedItems.length > 0 ? (
        <div className="mt-[2px] flex w-full flex-col items-center gap-[9px] border-t border-border-alpha-14 pt-[10px]">
          {pinnedItems.slice(0, 6).map((item) => (
            <Tooltip
              key={item.id}
              content={item.title}
              side="right"
              sideOffset={12}
            >
              <Link
                to={item.href}
                className="group relative flex h-[28px] w-[28px] items-center justify-center overflow-hidden rounded-control bg-border-alpha-14"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                  />
                ) : (
                  <span className="text-[10px] font-[600] text-text-secondary">
                    {item.title.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </Link>
            </Tooltip>
          ))}
        </div>
      ) : null}
    </>
  );
}
