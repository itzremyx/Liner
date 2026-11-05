import type { ComponentType } from "react";
import {
  Home7Fill,
  Search3Fill,
  BookmarksFill,
  ChartBarFill,
  Settings4Fill,
  SparklesFill,
} from "@mingcute/react";

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
}

export const sidebarNavItems: NavItem[] = [
  { id: "home", label: "Home", href: "/", Icon: Home7Fill },
  { id: "search", label: "Search", Icon: Search3Fill },
  { id: "library", label: "Library", href: "/library", Icon: BookmarksFill },
  { id: "modded", label: "Modded", href: "/modded", Icon: SparklesFill },
  {
    id: "statistics",
    label: "Statistics",
    href: "/statistics",
    Icon: ChartBarFill,
  },
  { id: "settings", label: "Settings", Icon: Settings4Fill },
];
