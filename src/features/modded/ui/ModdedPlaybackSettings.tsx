import { useState } from "react";
import { Button, Slider, TextInput, ToggleSwitch } from "@/shared/ui";
import { usePlayerStore } from "@/features/player";
import { getScoutcodeRecommendations } from "../lib/scoutcode";
import { useModdedSettingsStore } from "../store/moddedStore";
import {
  SettingBlock,
  SettingRow,
  SettingSection,
} from "@/features/settings/ui/controls";

export function ModdedPlaybackSettings({
  searchQuery,
}: {
  searchQuery?: string;
}) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const [testState, setTestState] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const crossfadeEnabled = useModdedSettingsStore(
    (state) => state.crossfadeEnabled,
  );
  const crossfadeDurationMs = useModdedSettingsStore(
    (state) => state.crossfadeDurationMs,
  );
  const performanceMode = useModdedSettingsStore(
    (state) => state.performanceMode,
  );
  const aiRecommendationsEnabled = useModdedSettingsStore(
    (state) => state.aiRecommendationsEnabled,
  );
  const apiKey = useModdedSettingsStore((state) => state.scoutcodeApiKey);
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
        title="Custom crossfade"
        description="Fade smoothly between tracks using the existing low-memory audio pipeline."
        titleKey="settings.modded.crossfade.title"
        descKey="settings.modded.crossfade.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={crossfadeEnabled}
            onChange={set.setCrossfadeEnabled}
            ariaLabel="Custom crossfade"
          />
        }
      />
      <SettingBlock
        title="Crossfade duration"
        description={`${(crossfadeDurationMs / 1000).toFixed(1)} seconds`}
        titleKey="settings.modded.crossfade_duration.title"
        descKey="settings.modded.crossfade_duration.description"
        searchQuery={searchQuery}
      >
        <Slider
          value={crossfadeDurationMs / 1000}
          min={0}
          max={12}
          step={0.1}
          unit="s"
          showValue
          onChange={(value) => set.setCrossfadeDurationMs(value * 1000)}
          ariaLabel="Crossfade duration"
        />
      </SettingBlock>
      <SettingRow
        title="Performance mode"
        description="Reduce decorative effects and background work for lower CPU and RAM usage."
        titleKey="settings.modded.performance.title"
        descKey="settings.modded.performance.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={performanceMode}
            onChange={set.setPerformanceMode}
            ariaLabel="Performance mode"
          />
        }
      />
      <SettingRow
        title="AI recommendations"
        description="Use MiniMax M3.1 Flash through Scoutcode to suggest music from your listening context."
        titleKey="settings.modded.ai.title"
        descKey="settings.modded.ai.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={aiRecommendationsEnabled}
            onChange={set.setAiRecommendationsEnabled}
            ariaLabel="AI recommendations"
          />
        }
      />
      <SettingBlock
        title="Scoutcode API key"
        description="Stored locally on this device. It is never committed to the repository."
        titleKey="settings.modded.api_key.title"
        descKey="settings.modded.api_key.description"
        searchQuery={searchQuery}
      >
        <div className="flex flex-col gap-[8px]">
          <TextInput
            type="password"
            value={apiKey}
            onChange={(event) => set.setScoutcodeApiKey(event.target.value)}
            placeholder="sk-…"
            autoComplete="off"
            aria-label="Scoutcode API key"
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
              {testState === "testing" ? "Testing…" : "Test connection"}
            </Button>
            <span className="text-[11px] text-text-tertiary">
              {testState === "success" && "Connection successful"}
              {testState === "error" && "Connection failed or key missing"}
            </span>
          </div>
        </div>
      </SettingBlock>
    </SettingSection>
  );
}
