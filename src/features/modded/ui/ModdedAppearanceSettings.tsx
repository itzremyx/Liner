import { Button, MenuSelect, TextInput, ToggleSwitch } from "@/shared/ui";
import { useTranslation } from "@/languages";
import {
  useModdedSettingsStore,
  type LyricsFont,
  type ModdedThemeStyle,
} from "../store/moddedStore";
import {
  SettingBlock,
  SettingRow,
  SettingSection,
} from "@/features/settings/ui/controls";

const THEME_OPTIONS: ReadonlyArray<{ value: ModdedThemeStyle; label: string }> =
  [
    { value: "classic", label: "Classic" },
    { value: "blur", label: "Blur" },
    { value: "acrylic", label: "Acrylic" },
    { value: "liquid-glass", label: "Liquid glass" },
  ];

export function ModdedAppearanceSettings({
  searchQuery,
}: {
  searchQuery?: string;
}) {
  const { t } = useTranslation();
  const themeStyle = useModdedSettingsStore((state) => state.themeStyle);
  const backgroundUrl = useModdedSettingsStore(
    (state) => state.customBackgroundUrl,
  );
  const logoUrl = useModdedSettingsStore((state) => state.customLogoUrl);
  const lyricsFont = useModdedSettingsStore((state) => state.lyricsFont);
  const animationsEnabled = useModdedSettingsStore(
    (state) => state.animationsEnabled,
  );
  const christmasTheme = useModdedSettingsStore(
    (state) => state.christmasTheme,
  );
  const pinnedItems = useModdedSettingsStore((state) => state.pinnedItems);
  const set = useModdedSettingsStore((state) => state);

  return (
    <SettingSection>
      <SettingRow
        title={t("settings.modded.visual_style.title")}
        description={t("settings.modded.visual_style.description")}
        titleKey="settings.modded.visual_style.title"
        descKey="settings.modded.visual_style.description"
        searchQuery={searchQuery}
        control={
          <MenuSelect
            options={THEME_OPTIONS}
            value={themeStyle}
            onChange={set.setThemeStyle}
            aria-label={t("settings.modded.visual_style.title")}
            className="min-w-[132px]"
          />
        }
      />
      <SettingRow
        title={t("settings.modded.background.title")}
        description={t("settings.modded.background.description")}
        titleKey="settings.modded.background.title"
        descKey="settings.modded.background.description"
        searchQuery={searchQuery}
        control={
          <TextInput
            value={backgroundUrl}
            onChange={(event) => set.setCustomBackgroundUrl(event.target.value)}
            placeholder="https://..."
            aria-label={t("settings.modded.background.title")}
            size="sm"
            className="w-[220px]"
          />
        }
      />
      <SettingRow
        title={t("settings.modded.logo.title")}
        description={t("settings.modded.logo.description")}
        titleKey="settings.modded.logo.title"
        descKey="settings.modded.logo.description"
        searchQuery={searchQuery}
        control={
          <TextInput
            value={logoUrl}
            onChange={(event) => set.setCustomLogoUrl(event.target.value)}
            placeholder="https://..."
            aria-label={t("settings.modded.logo.title")}
            size="sm"
            className="w-[220px]"
          />
        }
      />
      <SettingRow
        title={t("settings.modded.lyrics_font.title")}
        description={t("settings.modded.lyrics_font.description")}
        titleKey="settings.modded.lyrics_font.title"
        descKey="settings.modded.lyrics_font.description"
        searchQuery={searchQuery}
        control={
          <MenuSelect
            options={[
              { value: "inter", label: "Inter" },
              { value: "serif", label: "Serif" },
              { value: "mono", label: "Monospace" },
              { value: "rounded", label: "Rounded" },
            ]}
            value={lyricsFont}
            onChange={(value) => set.setLyricsFont(value as LyricsFont)}
            aria-label={t("settings.modded.lyrics_font.title")}
            className="min-w-[132px]"
          />
        }
      />
      <SettingRow
        title={t("settings.modded.animations.title")}
        description={t("settings.modded.animations.description")}
        titleKey="settings.modded.animations.title"
        descKey="settings.modded.animations.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={animationsEnabled}
            onChange={set.setAnimationsEnabled}
            ariaLabel={t("settings.modded.animations.title")}
          />
        }
      />
      <SettingRow
        title={t("settings.modded.christmas.title")}
        description={t("settings.modded.christmas.description")}
        titleKey="settings.modded.christmas.title"
        descKey="settings.modded.christmas.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={christmasTheme}
            onChange={set.setChristmasTheme}
            ariaLabel={t("settings.modded.christmas.title")}
          />
        }
      />

      <SettingBlock
        title={t("settings.modded.pinned_items.title")}
        description={t("settings.modded.pinned_items.description")}
        titleKey="settings.modded.pinned_items.title"
        descKey="settings.modded.pinned_items.description"
        searchQuery={searchQuery}
      >
        {pinnedItems.length === 0 ? (
          <p className="m-0 text-caption text-text-tertiary">
            {t("settings.modded.pinned_items.empty")}
          </p>
        ) : (
          <div className="flex flex-col gap-[6px]">
            {pinnedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-[10px] rounded-control bg-bg-elevated/60 px-[10px] py-[7px]"
              >
                <div className="flex min-w-0 items-center gap-[8px]">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-[24px] w-[24px] shrink-0 rounded-[5px] object-cover"
                    />
                  ) : null}
                  <span className="min-w-0 truncate text-label text-text-primary">
                    {item.title}
                  </span>
                  <span className="shrink-0 text-caption text-text-tertiary">
                    {item.type === "playlist" ? "Playlist" : "Artiste"}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => set.unpinItem(item.id)}
                >
                  {t("settings.modded.pinned_items.remove")}
                </Button>
              </div>
            ))}
          </div>
        )}
      </SettingBlock>
    </SettingSection>
  );
}
