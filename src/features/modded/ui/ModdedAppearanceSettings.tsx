import { MenuSelect, TextInput } from "@/shared/ui";
import {
  useModdedSettingsStore,
  type ModdedThemeStyle,
} from "../store/moddedStore";
import { SettingRow, SettingSection } from "@/features/settings/ui/controls";

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
  const themeStyle = useModdedSettingsStore((state) => state.themeStyle);
  const backgroundUrl = useModdedSettingsStore(
    (state) => state.customBackgroundUrl,
  );
  const logoUrl = useModdedSettingsStore((state) => state.customLogoUrl);
  const setThemeStyle = useModdedSettingsStore((state) => state.setThemeStyle);
  const setCustomBackgroundUrl = useModdedSettingsStore(
    (state) => state.setCustomBackgroundUrl,
  );
  const setCustomLogoUrl = useModdedSettingsStore(
    (state) => state.setCustomLogoUrl,
  );

  return (
    <SettingSection>
      <SettingRow
        title="Modded visual style"
        description="Choose the Blur, Acrylic or Liquid Glass surface treatment."
        titleKey="settings.modded.visual_style.title"
        descKey="settings.modded.visual_style.description"
        searchQuery={searchQuery}
        control={
          <MenuSelect
            options={THEME_OPTIONS}
            value={themeStyle}
            onChange={setThemeStyle}
            aria-label="Modded visual style"
            className="min-w-[132px]"
          />
        }
      />
      <SettingRow
        title="Custom background"
        description="Use an image URL as the app background."
        titleKey="settings.modded.background.title"
        descKey="settings.modded.background.description"
        searchQuery={searchQuery}
        control={
          <TextInput
            value={backgroundUrl}
            onChange={(event) => setCustomBackgroundUrl(event.target.value)}
            placeholder="https://…"
            aria-label="Custom background URL"
            size="sm"
            className="w-[220px]"
          />
        }
      />
      <SettingRow
        title="Custom logo"
        description="Use an image URL for the custom logo."
        titleKey="settings.modded.logo.title"
        descKey="settings.modded.logo.description"
        searchQuery={searchQuery}
        control={
          <TextInput
            value={logoUrl}
            onChange={(event) => setCustomLogoUrl(event.target.value)}
            placeholder="https://…"
            aria-label="Custom logo URL"
            size="sm"
            className="w-[220px]"
          />
        }
      />
    </SettingSection>
  );
}
