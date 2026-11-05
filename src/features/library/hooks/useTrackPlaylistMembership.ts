import { useEffect, useState } from "react";
import { api } from "@/shared/api";
import { isLocalTrackId } from "@/shared/media/local";
import type { LibraryPlaylistSummary } from "./usePlaylists";

const cache = new Map<string, string[]>();
const pending = new Map<string, Promise<string[]>>();

async function loadMembership(
  trackId: string,
  playlists: LibraryPlaylistSummary[],
): Promise<string[]> {
  const key = `${trackId}:${playlists.map((playlist) => playlist.id).join(",")}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const active = pending.get(key);
  if (active) return active;

  const request = (async () => {
    const result: string[] = [];
    // Keep this sequential: opening a menu should not create a burst of API
    // requests on accounts with many playlists.
    for (const playlist of playlists) {
      try {
        const detail = await api.getUserPlaylist(playlist.id);
        if (detail.items.some((item) => item.track?.id === trackId)) {
          result.push(playlist.title);
        }
      } catch {
        // One unavailable playlist should not hide the rest of the menu.
      }
    }
    cache.set(key, result);
    return result;
  })().finally(() => pending.delete(key));
  pending.set(key, request);
  return request;
}

export function useTrackPlaylistMembership(
  trackId: string | undefined,
  playlists: LibraryPlaylistSummary[],
  enabled: boolean,
) {
  const [membership, setMembership] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !trackId || isLocalTrackId(trackId) || playlists.length === 0) {
      setMembership([]);
      return;
    }
    let active = true;
    setIsLoading(true);
    void loadMembership(trackId, playlists).then((result) => {
      if (!active) return;
      setMembership(result);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [enabled, playlists, trackId]);

  return { membership, isLoading };
}

