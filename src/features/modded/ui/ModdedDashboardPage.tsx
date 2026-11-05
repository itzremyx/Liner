import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextInput, ToggleSwitch } from "@/shared/ui";
import { usePlayerStore } from "@/features/player";
import { playerEngine } from "@/features/player/engine/playerEngine";
import { useLocalLibraryStore } from "@/features/library/local/store/localLibraryStore";
import { getScoutcodeRecommendations } from "../lib/scoutcode";
import { smartShuffle } from "../lib/smartShuffle";
import {
  useModdedSettingsStore,
  type LyricsFont,
  type VocalMode,
} from "../store/moddedStore";
import {
  getWrappedStats,
  useModdedAnalyticsStore,
} from "../store/moddedAnalyticsStore";

const featureRows = [
  [1, "Crossfade personnalisé"],
  [2, "Recommandations IA Scoutcode"],
  [3, "Mode RAM/CPU réduit"],
  [4, "Presets speed / slowed / reverb"],
  [5, "Import de musiques locales"],
  [6, "Smart Shuffle"],
  [7, "Automix"],
  [8, "Liner Wrapped"],
  [9, "Blur / Acrylic / Liquid Glass"],
  [10, "Fond et logo personnalisés"],
  [11, "Accélération GPU"],
  [12, "Playlists et artistes épinglés"],
  [13, "Timestamp près de l’artiste"],
  [14, "Cleaner Library"],
  [15, "Indicateur du titre actuel"],
  [16, "Mix IA dans les playlists"],
  [17, "Cover de playlist personnalisée"],
  [18, "Extrait au survol"],
  [19, "Métronome avec BPM"],
  [20, "Traduction des paroles"],
  [21, "Animations supplémentaires"],
  [22, "Accueil personnalisé"],
  [23, "Isolation vocale"],
  [24, "Performance mode"],
  [25, "Normalisation du volume"],
  [26, "Qualité Eco → Lossless"],
  [27, "Titres déjà présents dans une playlist"],
  [28, "Polices de paroles"],
  [29, "Thème Noël automatique"],
  [30, "Daily Mixes plus longs"],
] as const;

function ToggleRow({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-[16px] rounded-control bg-bg-elevated/60 px-[12px] py-[10px]">
      <div className="min-w-0">
        <div className="text-label font-[500] text-text-primary">{label}</div>
        {hint ? <div className="text-caption text-text-tertiary">{hint}</div> : null}
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} ariaLabel={label} />
    </div>
  );
}

export default function ModdedDashboardPage() {
  const navigate = useNavigate();
  const player = usePlayerStore();
  const events = useModdedAnalyticsStore((state) => state.events);
  const clearStats = useModdedAnalyticsStore((state) => state.clear);
  const stats = useMemo(() => getWrappedStats(events), [events]);
  const settings = useModdedSettingsStore();
  const importFiles = useLocalLibraryStore((state) => state.pickFiles);
  const cleanDuplicates = useLocalLibraryStore((state) => state.removeDuplicates);
  const [recommendations, setRecommendations] = useState<
    { title: string; artist?: string; reason?: string }[]
  >([]);
  const [aiState, setAiState] = useState<"idle" | "loading" | "error">("idle");
  const [pinType, setPinType] = useState<"playlist" | "artist">("playlist");
  const [pinId, setPinId] = useState("");
  const [pinTitle, setPinTitle] = useState("");
  const [pinImage, setPinImage] = useState("");
  const [pinHref, setPinHref] = useState("");
  const [coverPlaylistId, setCoverPlaylistId] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const tracksForAi = useMemo(() => {
    if (player.queue.length > 0) return player.queue.slice(-12);
    return events.slice(0, 12).map((event) => ({
      id: event.trackId,
      title: event.title,
      artists: event.artists,
      coverUrl: event.coverUrl,
      durationMs: event.durationMs,
      playCount: 0,
    }));
  }, [events, player.queue]);

  const runRecommendations = async () => {
    setAiState("loading");
    try {
      setRecommendations(await getScoutcodeRecommendations(tracksForAi));
      setAiState("idle");
    } catch {
      setAiState("error");
    }
  };

  const runSmartShuffle = async () => {
    if (player.queue.length < 2) return;
    const ordered = await smartShuffle(player.queue, settings.smartShuffleEnabled);
    await playerEngine.playShuffled(ordered, player.playbackContext);
  };

  const pinItem = () => {
    if (!pinId.trim() || !pinTitle.trim() || !pinHref.trim()) return;
    settings.pinItem({
      id: pinId.trim(),
      type: pinType,
      title: pinTitle.trim(),
      imageUrl: pinImage.trim() || undefined,
      href: pinHref.trim(),
    });
    setPinId("");
    setPinTitle("");
    setPinImage("");
    setPinHref("");
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-transparent px-[18px] pt-(--page-inset-top) pb-(--page-inset-bottom)">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-[18px] pb-[24px]">
        <header className="pt-[10px]">
          <div className="text-caption font-[600] uppercase tracking-[0.14em] text-text-tertiary">Modded Liner</div>
          <h1 className="m-0 mt-[4px] text-[30px] font-[700] tracking-[-0.03em] text-text-primary">Centre de contrôle</h1>
          <p className="m-0 mt-[6px] max-w-[700px] text-body text-text-secondary">Toutes les options modifiées sont persistées localement sur cet appareil.</p>
        </header>

        <section className="grid grid-cols-2 gap-[10px] md:grid-cols-4">
          {[
            ["Minutes écoutées", stats.minutes],
            ["Titres uniques", stats.uniqueTracks],
            ["Artistes uniques", stats.uniqueArtists],
            ["Événements", events.length],
          ].map(([label, value]) => (
            <div key={label} className="rounded-item bg-bg-elevated/70 p-[14px]">
              <div className="text-caption text-text-tertiary">{label}</div>
              <div className="mt-[3px] text-[24px] font-[650] text-text-primary">{value}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-[14px] lg:grid-cols-2">
          <div className="rounded-item bg-bg-elevated/70 p-[16px]">
            <div className="flex items-center justify-between gap-[10px]">
              <div>
                <h2 className="m-0 text-heading font-[600] text-text-primary">Wrapped personnel</h2>
                <p className="m-0 mt-[3px] text-caption text-text-tertiary">Tes titres et artistes les plus écoutés sur cet appareil.</p>
              </div>
              <Button size="sm" variant="ghost" onClick={clearStats}>Effacer</Button>
            </div>
            <div className="mt-[14px] grid gap-[6px]">
              {stats.topTracks.length === 0 ? <div className="text-body text-text-tertiary">Écoute quelques titres pour générer ton Wrapped.</div> : stats.topTracks.map(({ event, count }) => (
                <div key={event.trackId} className="flex items-center justify-between gap-[10px] rounded-control px-[8px] py-[6px] hover:bg-border-alpha-14">
                  <div className="min-w-0 truncate text-label text-text-primary">{event.title} <span className="text-text-tertiary">— {event.artists}</span></div>
                  <span className="shrink-0 text-caption text-text-tertiary">{count}×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-item bg-bg-elevated/70 p-[16px]">
            <div className="flex items-center justify-between gap-[10px]">
              <div>
                <h2 className="m-0 text-heading font-[600] text-text-primary">Recommandations IA</h2>
                <p className="m-0 mt-[3px] text-caption text-text-tertiary">MiniMax M3.1 Flash via Scoutcode, basé sur ton écoute.</p>
              </div>
              <Button size="sm" onClick={() => void runRecommendations()} disabled={aiState === "loading" || tracksForAi.length === 0}>{aiState === "loading" ? "Analyse…" : "Recommander"}</Button>
            </div>
            {aiState === "error" ? <div className="mt-[12px] text-caption text-accent-secondary">Configure ta clé Scoutcode dans Paramètres → Lecture.</div> : null}
            <div className="mt-[14px] grid gap-[6px]">
              {recommendations.map((item, index) => <div key={`${item.title}-${index}`} className="rounded-control bg-bg-primary/50 px-[9px] py-[7px]"><div className="text-label text-text-primary">{item.title}{item.artist ? ` — ${item.artist}` : ""}</div>{item.reason ? <div className="text-caption text-text-tertiary">{item.reason}</div> : null}</div>)}
              {recommendations.length === 0 && aiState !== "error" ? <div className="text-body text-text-tertiary">Aucune recommandation chargée.</div> : null}
            </div>
          </div>
        </section>

        <section className="rounded-item bg-bg-elevated/70 p-[16px]">
          <div className="flex flex-wrap items-center justify-between gap-[10px]">
            <div><h2 className="m-0 text-heading font-[600] text-text-primary">Lecteur moddé</h2><p className="m-0 mt-[3px] text-caption text-text-tertiary">Automix, métadonnées et traitement audio.</p></div>
              <div className="flex flex-wrap gap-[8px]"><Button size="sm" variant="secondary" onClick={() => void importFiles()}>Importer des fichiers</Button><Button size="sm" variant="secondary" onClick={() => void cleanDuplicates()}>Nettoyer les doublons</Button><Button size="sm" variant="secondary" onClick={() => void runSmartShuffle()} disabled={player.queue.length < 2}>Smart Shuffle la file</Button></div>
          </div>
          <div className="mt-[14px] grid gap-[8px] sm:grid-cols-2">
            <ToggleRow label="Automix" hint="Prépare les transitions entre titres." checked={settings.automixEnabled} onChange={settings.setAutomixEnabled} />
            <ToggleRow label="Pré-écoute au survol" checked={settings.hoverPreviewEnabled} onChange={settings.setHoverPreviewEnabled} />
            <ToggleRow label="Isolation vocale" hint="Traitement expérimental du canal central." checked={settings.vocalMode !== "off"} onChange={(enabled) => settings.setVocalMode(enabled ? "instrumental" : "off")} />
            <ToggleRow label="Métronome" checked={settings.metronomeEnabled} onChange={settings.setMetronomeEnabled} />
            <ToggleRow label="Traduction des paroles" checked={settings.lyricsTranslationEnabled} onChange={settings.setLyricsTranslationEnabled} />
            <ToggleRow label="Accueil personnalisé" checked={settings.personalizedHome} onChange={settings.setPersonalizedHome} />
            <ToggleRow label="Daily Mixes longs" checked={settings.longerDailyMixes} onChange={settings.setLongerDailyMixes} />
            <ToggleRow label="Animations" checked={settings.animationsEnabled} onChange={settings.setAnimationsEnabled} />
            <ToggleRow label="Performance mode" hint="Désactive les effets coûteux pour réduire RAM/CPU." checked={settings.performanceMode} onChange={settings.setPerformanceMode} />
            <ToggleRow label="Accélération GPU" hint="Nécessite un redémarrage d’Electron." checked={settings.hardwareAcceleration} onChange={settings.setHardwareAcceleration} />
            <ToggleRow label="Thème Noël automatique" checked={settings.christmasTheme} onChange={settings.setChristmasTheme} />
          </div>
          <div className="mt-[14px] grid gap-[10px] sm:grid-cols-3">
            <label className="text-caption text-text-tertiary">Mode vocal<select className="mt-[5px] h-[36px] w-full rounded-control border-0 bg-bg-primary px-[9px] text-label text-text-primary" value={settings.vocalMode} onChange={(event) => settings.setVocalMode(event.target.value as VocalMode)}><option value="off">Désactivé</option><option value="instrumental">Instrumental</option><option value="vocals">Voix</option></select></label>
            <label className="text-caption text-text-tertiary">Police des paroles<select className="mt-[5px] h-[36px] w-full rounded-control border-0 bg-bg-primary px-[9px] text-label text-text-primary" value={settings.lyricsFont} onChange={(event) => settings.setLyricsFont(event.target.value as LyricsFont)}><option value="inter">Inter</option><option value="serif">Serif</option><option value="mono">Monospace</option><option value="rounded">Arrondie</option></select></label>
            <label className="text-caption text-text-tertiary">Qualité audio<select className="mt-[5px] h-[36px] w-full rounded-control border-0 bg-bg-primary px-[9px] text-label text-text-primary" value={player.audioQuality} onChange={(event) => player.setAudioQuality(event.target.value as typeof player.audioQuality)}><option value="low">Eco</option><option value="standard">Normal</option><option value="high">High</option><option value="lossless">Lossless</option></select></label>
          </div>
        </section>

        <section className="grid gap-[14px] lg:grid-cols-2">
          <div className="rounded-item bg-bg-elevated/70 p-[16px]"><h2 className="m-0 text-heading font-[600] text-text-primary">Épingler dans la sidebar</h2><p className="m-0 mt-[3px] text-caption text-text-tertiary">Ajoute un lien de playlist ou d’artiste avec sa cover.</p><div className="mt-[12px] grid gap-[8px] sm:grid-cols-2"><select className="h-[36px] rounded-control border-0 bg-bg-primary px-[9px] text-label text-text-primary" value={pinType} onChange={(event) => setPinType(event.target.value as "playlist" | "artist")}><option value="playlist">Playlist</option><option value="artist">Artiste</option></select><TextInput value={pinId} onChange={(event) => setPinId(event.target.value)} placeholder="ID" size="sm" /><TextInput value={pinTitle} onChange={(event) => setPinTitle(event.target.value)} placeholder="Nom affiché" size="sm" /><TextInput value={pinHref} onChange={(event) => setPinHref(event.target.value)} placeholder="#/collection?..." size="sm" /><TextInput value={pinImage} onChange={(event) => setPinImage(event.target.value)} placeholder="URL cover (optionnel)" size="sm" /></div><Button className="mt-[10px]" size="sm" onClick={pinItem}>Épingler</Button></div>
          <div className="rounded-item bg-bg-elevated/70 p-[16px]"><h2 className="m-0 text-heading font-[600] text-text-primary">Cover personnalisée</h2><p className="m-0 mt-[3px] text-caption text-text-tertiary">Valable pour les playlists de l’utilisateur.</p><div className="mt-[12px] grid gap-[8px]"><TextInput value={coverPlaylistId} onChange={(event) => setCoverPlaylistId(event.target.value)} placeholder="ID de playlist" size="sm" /><TextInput value={coverUrl} onChange={(event) => setCoverUrl(event.target.value)} placeholder="URL de l’image" size="sm" /></div><Button className="mt-[10px]" size="sm" onClick={() => { if (coverPlaylistId.trim()) settings.setPlaylistCover(coverPlaylistId, coverUrl); }}>Enregistrer la cover</Button></div>
        </section>

        <section className="rounded-item bg-bg-elevated/70 p-[16px]"><div className="flex items-center justify-between gap-[12px]"><div><h2 className="m-0 text-heading font-[600] text-text-primary">Les 30 fonctionnalités</h2><p className="m-0 mt-[3px] text-caption text-text-tertiary">État du socle modded actuel.</p></div><Button size="sm" variant="ghost" onClick={() => navigate("/library/local")}>Bibliothèque locale</Button></div><div className="mt-[14px] grid gap-[6px] sm:grid-cols-2 lg:grid-cols-3">{featureRows.map(([number, label]) => <div key={number} className="flex items-center gap-[8px] rounded-control bg-bg-primary/40 px-[9px] py-[7px] text-label text-text-primary"><span className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-btn-primary-bg text-[10px] text-btn-primary-text">{number}</span><span className="truncate">{label}</span></div>)}</div></section>
      </div>
    </div>
  );
}
