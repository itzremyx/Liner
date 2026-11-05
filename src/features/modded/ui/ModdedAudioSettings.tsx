import { useState } from "react";
import { Button, MenuSelect, Slider, ToggleSwitch } from "@/shared/ui";
import { usePlayerStore } from "@/features/player";
import type { AudioQuality } from "@/features/player/store/playerStore";
import { useTranslation } from "@/languages";
import { useModdedSettingsStore, type VocalMode } from "../store/moddedStore";
import {
  SettingBlock,
  SettingRow,
  SettingSection,
} from "@/features/settings/ui/controls";

const QUALITY_OPTIONS: ReadonlyArray<{ value: AudioQuality; label: string }> = [
  { value: "low", label: "Eco" },
  { value: "standard", label: "Normal" },
  { value: "high", label: "High" },
  { value: "lossless", label: "Lossless" },
];

export function ModdedAudioSettings({ searchQuery }: { searchQuery?: string }) {
  const { t } = useTranslation();
  const [gpuNeedsRestart, setGpuNeedsRestart] = useState(false);

  const audioQuality = usePlayerStore((state) => state.audioQuality);
  const setAudioQuality = usePlayerStore((state) => state.setAudioQuality);

  const crossfadeEnabled = useModdedSettingsStore(
    (state) => state.crossfadeEnabled,
  );
  const crossfadeDurationMs = useModdedSettingsStore(
    (state) => state.crossfadeDurationMs,
  );
  const performanceMode = useModdedSettingsStore(
    (state) => state.performanceMode,
  );
  const smartShuffleEnabled = useModdedSettingsStore(
    (state) => state.smartShuffleEnabled,
  );
  const volumeNormalization = useModdedSettingsStore(
    (state) => state.volumeNormalization,
  );
  const targetLoudnessLUFS = useModdedSettingsStore(
    (state) => state.targetLoudnessLUFS,
  );
  const automixEnabled = useModdedSettingsStore(
    (state) => state.automixEnabled,
  );
  const automixDurationMs = useModdedSettingsStore(
    (state) => state.automixDurationMs,
  );
  const hoverPreviewEnabled = useModdedSettingsStore(
    (state) => state.hoverPreviewEnabled,
  );
  const metronomeEnabled = useModdedSettingsStore(
    (state) => state.metronomeEnabled,
  );
  const metronomeBpm = useModdedSettingsStore((state) => state.metronomeBpm);
  const vocalMode = useModdedSettingsStore((state) => state.vocalMode);
  const hardwareAcceleration = useModdedSettingsStore(
    (state) => state.hardwareAcceleration,
  );
  const set = useModdedSettingsStore((state) => state);

  const changeHardwareAcceleration = (enabled: boolean) => {
    set.setHardwareAcceleration(enabled);
    setGpuNeedsRestart(true);
    void window.linerElectron?.setHardwareAcceleration?.(enabled);
  };

  return (
    <SettingSection>
      <SettingRow
        title={t("settings.modded.audio_quality.title")}
        description={t("settings.modded.audio_quality.description")}
        titleKey="settings.modded.audio_quality.title"
        descKey="settings.modded.audio_quality.description"
        searchQuery={searchQuery}
        control={
          <MenuSelect
            options={QUALITY_OPTIONS}
            value={audioQuality}
            onChange={setAudioQuality}
            aria-label={t("settings.modded.audio_quality.title")}
            className="min-w-[130px]"
          />
        }
      />

      <SettingRow
        title={t("settings.modded.crossfade.title")}
        description={t("settings.modded.crossfade.description")}
        titleKey="settings.modded.crossfade.title"
        descKey="settings.modded.crossfade.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={crossfadeEnabled}
            onChange={set.setCrossfadeEnabled}
            ariaLabel={t("settings.modded.crossfade.title")}
          />
        }
      />
      <SettingBlock
        title={t("settings.modded.crossfade_duration.title")}
        description={`${(crossfadeDurationMs / 1000).toFixed(1)} s`}
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
          ariaLabel={t("settings.modded.crossfade_duration.title")}
        />
      </SettingBlock>

      <SettingRow
        title={t("settings.modded.automix.title")}
        description={t("settings.modded.automix.description")}
        titleKey="settings.modded.automix.title"
        descKey="settings.modded.automix.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={automixEnabled}
            onChange={set.setAutomixEnabled}
            ariaLabel={t("settings.modded.automix.title")}
          />
        }
      />
      {automixEnabled ? (
        <SettingBlock
          title={t("settings.modded.automix_duration.title")}
          description={`${(automixDurationMs / 1000).toFixed(1)} s`}
          titleKey="settings.modded.automix_duration.title"
          descKey="settings.modded.automix_duration.description"
          searchQuery={searchQuery}
        >
          <Slider
            value={automixDurationMs / 1000}
            min={0}
            max={20}
            step={0.5}
            unit="s"
            showValue
            onChange={(value) => set.setAutomixDurationMs(value * 1000)}
            ariaLabel={t("settings.modded.automix_duration.title")}
          />
        </SettingBlock>
      ) : null}

      <SettingRow
        title={t("settings.modded.smart_shuffle.title")}
        description={t("settings.modded.smart_shuffle.description")}
        titleKey="settings.modded.smart_shuffle.title"
        descKey="settings.modded.smart_shuffle.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={smartShuffleEnabled}
            onChange={set.setSmartShuffleEnabled}
            ariaLabel={t("settings.modded.smart_shuffle.title")}
          />
        }
      />

      <SettingRow
        title={t("settings.modded.volume_norm.title")}
        description={t("settings.modded.volume_norm.description")}
        titleKey="settings.modded.volume_norm.title"
        descKey="settings.modded.volume_norm.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={volumeNormalization}
            onChange={set.setVolumeNormalization}
            ariaLabel={t("settings.modded.volume_norm.title")}
          />
        }
      />
      {volumeNormalization ? (
        <SettingBlock
          title={t("settings.modded.target_loudness.title")}
          description={`${targetLoudnessLUFS} LUFS`}
          titleKey="settings.modded.target_loudness.title"
          descKey="settings.modded.target_loudness.description"
          searchQuery={searchQuery}
        >
          <Slider
            value={targetLoudnessLUFS}
            min={-23}
            max={-5}
            step={1}
            unit=" LUFS"
            showValue
            onChange={(value) => set.setTargetLoudnessLUFS(value)}
            ariaLabel={t("settings.modded.target_loudness.title")}
          />
        </SettingBlock>
      ) : null}

      <SettingRow
        title={t("settings.modded.hover_preview.title")}
        description={t("settings.modded.hover_preview.description")}
        titleKey="settings.modded.hover_preview.title"
        descKey="settings.modded.hover_preview.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={hoverPreviewEnabled}
            onChange={set.setHoverPreviewEnabled}
            ariaLabel={t("settings.modded.hover_preview.title")}
          />
        }
      />

      <SettingRow
        title={t("settings.modded.metronome.title")}
        description={t("settings.modded.metronome.description")}
        titleKey="settings.modded.metronome.title"
        descKey="settings.modded.metronome.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={metronomeEnabled}
            onChange={set.setMetronomeEnabled}
            ariaLabel={t("settings.modded.metronome.title")}
          />
        }
      />
      {metronomeEnabled ? (
        <SettingBlock
          title={t("settings.modded.metronome_bpm.title")}
          description={`${metronomeBpm} BPM`}
          titleKey="settings.modded.metronome_bpm.title"
          descKey="settings.modded.metronome_bpm.description"
          searchQuery={searchQuery}
        >
          <Slider
            value={metronomeBpm}
            min={30}
            max={260}
            step={1}
            unit=" BPM"
            showValue
            onChange={(value) => set.setMetronomeBpm(value)}
            ariaLabel={t("settings.modded.metronome_bpm.title")}
          />
        </SettingBlock>
      ) : null}

      <SettingRow
        title={t("settings.modded.vocal_mode.title")}
        description={t("settings.modded.vocal_mode.description")}
        titleKey="settings.modded.vocal_mode.title"
        descKey="settings.modded.vocal_mode.description"
        searchQuery={searchQuery}
        control={
          <MenuSelect
            options={[
              { value: "off", label: t("settings.modded.vocal_mode.off") },
              {
                value: "instrumental",
                label: t("settings.modded.vocal_mode.instrumental"),
              },
              {
                value: "vocals",
                label: t("settings.modded.vocal_mode.vocals"),
              },
            ]}
            value={vocalMode}
            onChange={(value) => set.setVocalMode(value as VocalMode)}
            aria-label={t("settings.modded.vocal_mode.title")}
            className="min-w-[140px]"
          />
        }
      />

      <SettingRow
        title={t("settings.modded.performance.title")}
        description={t("settings.modded.performance.description")}
        titleKey="settings.modded.performance.title"
        descKey="settings.modded.performance.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={performanceMode}
            onChange={set.setPerformanceMode}
            ariaLabel={t("settings.modded.performance.title")}
          />
        }
      />

      <SettingRow
        title={t("settings.modded.gpu.title")}
        description={t("settings.modded.gpu.description")}
        titleKey="settings.modded.gpu.title"
        descKey="settings.modded.gpu.description"
        searchQuery={searchQuery}
        control={
          <ToggleSwitch
            checked={hardwareAcceleration}
            onChange={changeHardwareAcceleration}
            ariaLabel={t("settings.modded.gpu.title")}
          />
        }
      />
      {gpuNeedsRestart ? (
        <SettingBlock
          title={t("settings.modded.gpu_restart.title")}
          description={t("settings.modded.gpu_restart.description")}
          titleKey="settings.modded.gpu_restart.title"
          descKey="settings.modded.gpu_restart.description"
          searchQuery={searchQuery}
        >
          <Button
            size="sm"
            variant="secondary"
            onClick={() => void window.linerElectron?.relaunchApp?.()}
          >
            {t("settings.modded.gpu_restart.button")}
          </Button>
        </SettingBlock>
      ) : null}
    </SettingSection>
  );
}
