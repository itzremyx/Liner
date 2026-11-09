import React from "react";
import ReactDOM from "react-dom/client";
import { initGlobalErrorHandlers } from "@/shared/utils/globalErrorHandlers";
import { hydrateScreenCache } from "@/shared/cache/screenCache";
import { applyStoredTheme } from "@/shared/utils/storedTheme";
import { installTauriShim } from "@/platform/tauriShim";

initGlobalErrorHandlers();

// registers window.linerElectron when running inside the Tauri shell, so the
// rest of the app keeps using the same bridge as the Electron build.
installTauriShim();

const isOverlay = window.location.hash.startsWith("#/overlay");

if (!isOverlay) applyStoredTheme();

async function loadRoot(): Promise<React.ReactElement> {
  if (isOverlay) {
    const { default: OverlayApp } = await import("./app/OverlayApp");
    return <OverlayApp />;
  }
  const [
    { initMainWindowServices },
    { default: App },
    { default: RootErrorBoundary },
  ] = await Promise.all([
    import("./app/mainWindowServices"),
    import("./app/App"),
    import("@/shared/ui/RootErrorBoundary"),
    hydrateScreenCache(),
  ]);
  initMainWindowServices();
  return (
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  );
}

const rootElement = document.getElementById("root");

if (rootElement) {
  void loadRoot().then((root) => {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>{root}</React.StrictMode>,
    );
  });
}
