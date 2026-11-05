import { ModdedAiSettings } from "@/features/modded/ui/ModdedAiSettings";

export function AiTab({ searchQuery }: { searchQuery?: string }) {
  return <ModdedAiSettings searchQuery={searchQuery} />;
}
