import { useEffect } from "react";
import { usePlayerStore } from "@/features/player";
import { useModdedAnalyticsStore } from "../store/moddedAnalyticsStore";

export function useModdedAnalyticsSync() {
  useEffect(() => {
    let previousTrackId = usePlayerStore.getState().currentTrack?.id ?? null;
    let previousStatus = usePlayerStore.getState().status;
    const unsubscribe = usePlayerStore.subscribe((state) => {
      const track = state.currentTrack;
      const started =
        track &&
        track.id !== previousTrackId &&
        (state.status === "playing" || state.status === "loading");
      const resumed =
        track &&
        state.status === "playing" &&
        previousStatus !== "playing" &&
        previousTrackId === track.id;
      if (started || resumed) {
        useModdedAnalyticsStore.getState().recordTrack(track);
      }
      previousTrackId = track?.id ?? null;
      previousStatus = state.status;
    });
    return unsubscribe;
  }, []);
}
