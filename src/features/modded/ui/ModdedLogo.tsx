import type { ImgHTMLAttributes } from "react";
import { useModdedSettingsStore } from "../store/moddedStore";

export function ModdedLogo({
  fallbackSrc,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { fallbackSrc: string }) {
  const customLogoUrl = useModdedSettingsStore((state) => state.customLogoUrl);
  const source = customLogoUrl.trim() || fallbackSrc;
  return <img {...props} src={source} />;
}
