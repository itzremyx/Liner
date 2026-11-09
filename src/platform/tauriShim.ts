// Compatibility shim that exposes the Electron preload surface
// (`window.linerElectron`) on top of Tauri commands, so the React frontend
// keeps working unchanged when built with Tauri instead of Electron.

type InvokeFn = (
  cmd: string,
  args?: Record<string, unknown>,
) => Promise<unknown>;

interface TauriEvent {
  payload: unknown;
}

interface TauriGlobal {
  core?: { invoke?: InvokeFn };
  event?: {
    listen?: (
      name: string,
      handler: (event: TauriEvent) => void,
    ) => Promise<() => void>;
  };
  window?: {
    getCurrentWindow?: () => {
      onResized?: (cb: () => void) => Promise<() => void>;
      onFocusChanged?: (cb: () => void) => Promise<() => void>;
    };
  };
}

interface WindowState {
  isMaximized: boolean;
  isFullScreen: boolean;
  isVisible?: boolean;
}

function getTauri(): TauriGlobal | null {
  const global = (window as unknown as { __TAURI__?: TauriGlobal }).__TAURI__;
  if (global?.core && typeof global.core.invoke === "function") return global;
  return null;
}

function detectPlatform(): string {
  const ua = navigator.userAgent;
  if (/Mac/i.test(ua)) return "darwin";
  if (/Win/i.test(ua)) return "win32";
  return "linux";
}

type Signer = typeof import("./signerWasm");
let signerPromise: Promise<Signer> | null = null;
function loadSigner(): Promise<Signer> {
  if (!signerPromise) signerPromise = import("./signerWasm");
  return signerPromise;
}

export function isTauriRuntime(): boolean {
  const internals = (window as unknown as { __TAURI_INTERNALS__?: unknown })
    .__TAURI_INTERNALS__;
  return Boolean(internals) || getTauri() !== null;
}

export function installTauriShim(): void {
  const target = window as unknown as {
    linerElectron?: unknown;
    __TAURI__?: TauriGlobal;
  };
  if (target.linerElectron) return;

  const tauri = getTauri();
  if (!tauri || !tauri.core?.invoke) return;

  const invoke = tauri.core.invoke;

  const windowStateListeners = new Set<(state: WindowState) => void>();

  const readWindowState = async (): Promise<WindowState> => ({
    isMaximized: Boolean(await invoke("window_is_maximized")),
    isFullScreen: Boolean(await invoke("window_is_fullscreen")),
    isVisible: true,
  });

  const emitWindowState = () => {
    void readWindowState().then((state) => {
      windowStateListeners.forEach((listener) => listener(state));
    });
  };

  const listen = (
    name: string,
    handler: (payload: unknown) => void,
  ): (() => void) => {
    const eventApi = tauri.event;
    if (!eventApi?.listen) return () => {};
    let unlisten: (() => void) | null = null;
    let cancelled = false;
    void eventApi
      .listen(name, (event) => handler(event.payload))
      .then((fn) => {
        if (cancelled) fn();
        else unlisten = fn;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      unlisten?.();
    };
  };

  if (tauri.window?.getCurrentWindow) {
    try {
      const win = tauri.window.getCurrentWindow();
      win.onResized?.(emitWindowState)?.catch(() => {});
      win.onFocusChanged?.(emitWindowState)?.catch(() => {});
    } catch {
      // ignore: window events are best-effort
    }
  }

  const api = {
    platform: detectPlatform(),
    isHyprland: false,

    minimize: async () => {
      await invoke("window_minimize");
      emitWindowState();
    },
    toggleMaximize: async () => {
      await invoke("window_toggle_maximize");
      emitWindowState();
    },
    toggleFullScreen: async () => {
      await invoke("window_toggle_fullscreen");
      emitWindowState();
    },
    close: () => invoke("window_close"),
    isMaximized: async () => Boolean(await invoke("window_is_maximized")),
    isFullScreen: async () => Boolean(await invoke("window_is_fullscreen")),
    onWindowStateChange: (cb: (state: WindowState) => void) => {
      windowStateListeners.add(cb);
      void readWindowState().then((state) => {
        if (windowStateListeners.has(cb)) cb(state);
      });
      return () => windowStateListeners.delete(cb);
    },

    dragStart: () => {
      void invoke("window_drag_start");
    },
    dragMove: () => {},
    dragEnd: () => {},

    signRequest: async (input: Parameters<Signer["signRequest"]>[0]) =>
      (await loadSigner()).signRequest(input),
    signMonitorRequest: async (
      input: Parameters<Signer["signMonitorRequest"]>[0],
    ) => (await loadSigner()).signMonitorRequest(input),
    syncServerTime: async (value: string | number) =>
      (await loadSigner()).syncServerTime(value),
    getServerTimeOffset: async () => (await loadSigner()).getServerTimeOffset(),
    signCoverUrl: async (payload: string) =>
      (await loadSigner()).signCoverUrl(payload),
    signRawPayload: async (payload: number[] | Uint8Array) =>
      (await loadSigner()).signRawPayload(payload),

    getAppVersion: async () => String(await invoke("app_get_version")),

    // called without a method-level guard by the deeplink handler; Tauri has
    // no deep-link plumbing yet, so it simply never fires.
    onDeeplink: (_cb: (target: unknown) => void) => () => {},

    // saved-track device storage is not ported yet; report an empty library.
    savedTracksUsage: async () => ({ bytes: 0, freeBytes: null }),
    savedTracksRemove: async () => 0,

    checkForUpdates: async () => invoke("updater_check"),
    downloadUpdate: async () => invoke("updater_download"),
    quitAndInstall: async () =>
      Boolean(await invoke("updater_quit_and_install")),
    onUpdateAvailable: () => () => {},
    onUpdateDownloadProgress: (cb: (progress: unknown) => void) =>
      listen("updater:download-progress", cb),
    onUpdateDownloaded: (cb: (info: unknown) => void) =>
      listen("updater:update-downloaded", cb),
    onUpdateError: (cb: (err: unknown) => void) => listen("updater:error", cb),

    openDownloads: async (customPath?: string) =>
      Boolean(await invoke("shell_open_path", { path: customPath ?? null })),
    openExportFolder: async (customPath?: string) =>
      Boolean(await invoke("shell_open_path", { path: customPath ?? null })),

    getHardwareAcceleration: async () =>
      Boolean(await invoke("get_hardware_acceleration")),
    setHardwareAcceleration: async (enabled: boolean) =>
      Boolean(await invoke("set_hardware_acceleration", { enabled })),
    relaunchApp: async () => Boolean(await invoke("relaunch_app")),
  };

  target.linerElectron = api;
}
