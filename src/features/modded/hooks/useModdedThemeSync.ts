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

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.moddedTheme = themeStyle;
    root.dataset.performanceMode = performanceMode ? "on" : "off";
    if (backgroundUrl.trim()) {
      root.style.setProperty(
        "--modded-background-image",
        `url(${JSON.stringify(backgroundUrl.trim())})`,
      );
    } else {
      root.style.removeProperty("--modded-background-image");
    }
  }, [backgroundUrl, performanceMode, themeStyle]);
}
