import { useEffect } from "react";
import { useModdedSettingsStore } from "../store/moddedStore";

export function useModdedThemeSync() {
  const themeStyle = useModdedSettingsStore((state) => state.themeStyle);
  const performanceMode = useModdedSettingsStore(
    (state) => state.performanceMode,
  );
  const backgroundUrl = useModdedSettingsStore(
    (state) => state.customBackgroundUrl,
  );
  const christmasTheme = useModdedSettingsStore((state) => state.christmasTheme);
  const animationsEnabled = useModdedSettingsStore((state) => state.animationsEnabled);
  const lyricsFont = useModdedSettingsStore((state) => state.lyricsFont);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.moddedTheme = themeStyle;
    root.dataset.performanceMode = performanceMode ? "on" : "off";
    root.dataset.moddedAnimations = animationsEnabled ? "on" : "off";
    const today = new Date();
    const christmasWindow =
      (today.getMonth() === 10 && today.getDate() >= 20) ||
      today.getMonth() === 11 && today.getDate() <= 29;
    root.dataset.christmasTheme = christmasTheme && christmasWindow ? "on" : "off";
    const fontFamily = {
      inter: "Inter",
      serif: "Georgia",
      mono: "ui-monospace",
      rounded: "Arial Rounded MT Bold",
    }[lyricsFont];
    root.style.setProperty("--font-montserrat-family", fontFamily);
    if (backgroundUrl.trim()) {
      root.style.setProperty(
        "--modded-background-image",
        `url(${JSON.stringify(backgroundUrl.trim())})`,
      );
    } else {
      root.style.removeProperty("--modded-background-image");
    }
  }, [animationsEnabled, backgroundUrl, christmasTheme, lyricsFont, performanceMode, themeStyle]);
}
