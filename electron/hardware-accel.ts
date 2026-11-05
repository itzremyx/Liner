import { app, ipcMain } from "electron";
import fs from "node:fs";
import path from "node:path";

interface ModdedPreferences {
  hardwareAcceleration: boolean;
}

const FILE_NAME = "modded-preferences.json";

function preferencesPath(): string {
  return path.join(app.getPath("userData"), FILE_NAME);
}

export function readHardwareAcceleration(): boolean {
  try {
    const parsed = JSON.parse(
      fs.readFileSync(preferencesPath(), "utf8"),
    ) as Partial<ModdedPreferences>;
    if (typeof parsed.hardwareAcceleration === "boolean") {
      return parsed.hardwareAcceleration;
    }
  } catch {
    // missing or corrupt preferences default to hardware acceleration
  }
  return true;
}

export function writeHardwareAcceleration(enabled: boolean): void {
  try {
    const target = preferencesPath();
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(
      target,
      JSON.stringify({ hardwareAcceleration: enabled }, null, 2),
    );
  } catch (error) {
    console.error(
      "\x1b[41;37m main error \x1b[0m failed to persist hardware acceleration:",
      error,
    );
  }
}

/**
 * Must run before app.whenReady(): Chromium reads this flag during startup.
 */
export function applyHardwareAccelerationPreference(): void {
  if (!readHardwareAcceleration()) app.disableHardwareAcceleration();
}

export function registerHardwareAccelerationIpc(): void {
  ipcMain.handle("modded:get-hardware-acceleration", () =>
    readHardwareAcceleration(),
  );
  ipcMain.handle(
    "modded:set-hardware-acceleration",
    (_event, enabled: boolean) => {
      writeHardwareAcceleration(Boolean(enabled));
      return true;
    },
  );
  ipcMain.handle("modded:relaunch", () => {
    app.relaunch();
    app.exit(0);
    return true;
  });
}
