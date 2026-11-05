import { useEffect, useState } from "react";
import {
  DialogActions,
  DialogButton,
  DialogHeader,
  TextInput,
  useToast,
} from "@/shared/ui";
import Dialog from "@/shared/ui/Dialog";
import { useTranslation } from "@/languages";
import { useModdedSettingsStore } from "@/features/modded/store/moddedStore";

interface PlaylistCoverDialogProps {
  open: boolean;
  playlistId: string | null;
  currentCoverUrl?: string;
  onClose: () => void;
}

export default function PlaylistCoverDialog({
  open,
  playlistId,
  currentCoverUrl,
  onClose,
}: PlaylistCoverDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const setPlaylistCover = useModdedSettingsStore(
    (state) => state.setPlaylistCover,
  );
  const [url, setUrl] = useState(currentCoverUrl ?? "");

  useEffect(() => {
    if (open) setUrl(currentCoverUrl ?? "");
  }, [open, currentCoverUrl]);

  const save = () => {
    if (!playlistId) return;
    setPlaylistCover(playlistId, url);
    toast(
      url.trim() ? t("playlist.cover.saved") : t("playlist.cover.cleared"),
      "success",
    );
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (next ? undefined : onClose())}
      maxWidth={430}
    >
      <div className="flex flex-col px-[20px] pb-[20px]">
        <DialogHeader
          className="mb-[18px]"
          title={t("playlist.cover.title")}
          description={t("playlist.cover.description")}
        />
        <div className="flex flex-col gap-[10px]">
          <div className="flex h-[150px] items-center justify-center overflow-hidden rounded-item bg-bg-elevated/60">
            {url.trim() ? (
              <img
                src={url.trim()}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-caption text-text-tertiary">
                {t("playlist.cover.empty_preview")}
              </span>
            )}
          </div>
          <TextInput
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://..."
            aria-label={t("playlist.cover.url_label")}
          />
        </div>
        <DialogActions className="mt-[18px]">
          <DialogButton onClick={onClose}>{t("common.cancel")}</DialogButton>
          <DialogButton onClick={save}>{t("common.save")}</DialogButton>
        </DialogActions>
      </div>
    </Dialog>
  );
}
