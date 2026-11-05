import { ModdedAudioSettings } from "@/features/modded/ui/ModdedAudioSettings";

export function AudioTab({ searchQuery }: { searchQuery?: string }) {
  return <ModdedAudioSettings searchQuery={searchQuery} />;
}
