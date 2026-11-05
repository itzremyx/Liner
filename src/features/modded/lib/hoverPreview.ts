import type { Track } from "@/shared/types";
import { resolvePlaybackStream } from "@/features/player/engine/streamResolver";

let previewAudio: HTMLAudioElement | null = null;
let previewController: AbortController | null = null;
let previewTimer: ReturnType<typeof setTimeout> | null = null;
let previewRelease: (() => void) | null = null;

export function stopTrackPreview() {
  previewController?.abort();
  previewController = null;
  if (previewTimer) clearTimeout(previewTimer);
  previewTimer = null;
  previewRelease?.();
  previewRelease = null;
  if (previewAudio) {
    previewAudio.pause();
    previewAudio.removeAttribute("src");
    previewAudio.load();
  }
}

export function scheduleTrackPreview(track: Track, delayMs = 350) {
  stopTrackPreview();
  const controller = new AbortController();
  previewController = controller;
  previewTimer = setTimeout(() => {
    void (async () => {
      try {
        const stream = await resolvePlaybackStream(track, controller.signal, {
          progressive: true,
        });
        if (controller.signal.aborted) {
          stream.release?.();
          return;
        }
        previewRelease = stream.release ?? null;
        previewAudio ??= new Audio();
        previewAudio.volume = 0.18;
        previewAudio.src = stream.blob
          ? URL.createObjectURL(stream.blob)
          : stream.url;
        await previewAudio.play();
        previewTimer = setTimeout(stopTrackPreview, 12_000);
      } catch {
        stopTrackPreview();
      }
    })();
  }, delayMs);
}
