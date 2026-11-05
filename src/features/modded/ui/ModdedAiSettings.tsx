import { useState } from "react";
import { Button, TextInput, ToggleSwitch } from "@/shared/ui";
import { usePlayerStore } from "@/features/player";
import { useTranslation } from "@/languages";
import { getScoutcodeRecommendations } from "../lib/scoutcode";
import { useModdedSettingsStore } from "../store/moddedStore";
import {
  SettingBlock,
  SettingRow,
  SettingSection,
} from "@/features/settings/ui/controls";

export function ModdedAiSettings({ searchQuery }: { searchQuery?: string }) {
  const { t } = useTranslation();
  const [testState, setTestState] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");

  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const aiRecommendationsEnabled = useModdedSettingsStore(
    (state) => state.aiRecommendationsEnabled,
  );
  const apiKey = useModdedSettingsStore((state) => state.scoutcodeApiKey);
  const lyricsTranslationEnabled = useModdedSettingsStore(
    (state) => state.lyricsTranslationEnabled,
  );
  const personalizedHome = useModdedSettingsStore(
    (state) => state.personalizedHome,
  );
  const longerDailyMixes = useModdedSettingsStore(
    (state) => state.longerDailyMixes,
  );
  const set = useModdedSettingsStore((state) => state);

  const testScoutcode = async () => {
    setTestState("testing");
    try {
      await getScoutcodeRecommendations(currentTrack ? [currentTrack] : []);
      setTestState("success");
    } catch {
      setTestState("error");
    }
  };

  return (
    <SettingSection>
      <SettingRow
        title={t("settings.modded.ai.title")}
        description={t("settings.modded.ai.description")}
        titleKey="settings.modded.ai.title"
        descKey="settings.modded.ai.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={aiRecommendationsEnabled}
            onChange={set.setAiRecommendationsEnabled}
            ariaLabel={t("settings.modded.ai.title")}
          />
        }
      />

      <SettingBlock
        title={t("settings.modded.api_key.title")}
        description={t("settings.modded.api_key.description")}
        titleKey="settings.modded.api_key.title"
        descKey="settings.modded.api_key.description"
        searchQuery={searchQuery}
      >
        <div className="flex flex-col gap-[8px]">
          <TextInput
            type="password"
            value={apiKey}
            onChange={(event) => set.setScoutcodeApiKey(event.target.value)}
            placeholder="sk-..."
            autoComplete="off"
            aria-label={t("settings.modded.api_key.title")}
            size="sm"
          />
          <div className="flex items-center gap-[10px]">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={testScoutcode}
              disabled={testState === "testing"}
            >
              {testState === "testing"
                ? t("settings.modded.api_key.testing")
                : t("settings.modded.api_key.test")}
            </Button>
            <span className="text-[11px] text-text-tertiary">
              {testState === "success" && t("settings.modded.api_key.success")}
              {testState === "error" && t("settings.modded.api_key.error")}
            </span>
          </div>
        </div>
      </SettingBlock>

      <SettingRow
        title={t("settings.modded.lyrics_translation.title")}
        description={t("settings.modded.lyrics_translation.description")}
        titleKey="settings.modded.lyrics_translation.title"
        descKey="settings.modded.lyrics_translation.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={lyricsTranslationEnabled}
            onChange={set.setLyricsTranslationEnabled}
            ariaLabel={t("settings.modded.lyrics_translation.title")}
          />
        }
      />

      <SettingRow
        title={t("settings.modded.personalized_home.title")}
        description={t("settings.modded.personalized_home.description")}
        titleKey="settings.modded.personalized_home.title"
        descKey="settings.modded.personalized_home.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={personalizedHome}
            onChange={set.setPersonalizedHome}
            ariaLabel={t("settings.modded.personalized_home.title")}
          />
        }
      />

      <SettingRow
        title={t("settings.modded.longer_daily_mixes.title")}
        description={t("settings.modded.longer_daily_mixes.description")}
        titleKey="settings.modded.longer_daily_mixes.title"
        descKey="settings.modded.longer_daily_mixes.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={longerDailyMixes}
            onChange={set.setLongerDailyMixes}
            ariaLabel={t("settings.modded.longer_daily_mixes.title")}
          />
        }
      />
    </SettingSection>
  );
}
