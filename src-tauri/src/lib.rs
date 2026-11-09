use serde_json::Value;
use std::fs;
use std::path::PathBuf;
use tauri::{Emitter, Manager, WebviewWindow};
use tauri_plugin_updater::UpdaterExt;

const PREFS_FILE: &str = "modded-preferences.json";

fn app_data_dir(app: &tauri::AppHandle) -> PathBuf {
    app.path()
        .app_data_dir()
        .unwrap_or_else(|_| std::env::temp_dir())
}

fn prefs_path(app: &tauri::AppHandle) -> PathBuf {
    let dir = app_data_dir(app);
    let _ = fs::create_dir_all(&dir);
    dir.join(PREFS_FILE)
}

#[tauri::command]
fn window_minimize(window: WebviewWindow) -> Result<(), String> {
    window.minimize().map_err(|e| e.to_string())
}

#[tauri::command]
fn window_toggle_maximize(window: WebviewWindow) -> Result<(), String> {
    if window.is_maximized().unwrap_or(false) {
        window.unmaximize().map_err(|e| e.to_string())
    } else {
        window.maximize().map_err(|e| e.to_string())
    }
}

#[tauri::command]
fn window_toggle_fullscreen(window: WebviewWindow) -> Result<(), String> {
    let is_fullscreen = window.is_fullscreen().unwrap_or(false);
    window
        .set_fullscreen(!is_fullscreen)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn window_close(window: WebviewWindow) -> Result<(), String> {
    window.close().map_err(|e| e.to_string())
}

#[tauri::command]
fn window_is_maximized(window: WebviewWindow) -> bool {
    window.is_maximized().unwrap_or(false)
}

#[tauri::command]
fn window_is_fullscreen(window: WebviewWindow) -> bool {
    window.is_fullscreen().unwrap_or(false)
}

#[tauri::command]
fn window_drag_start(window: WebviewWindow) -> Result<(), String> {
    window.start_dragging().map_err(|e| e.to_string())
}

#[tauri::command]
fn app_get_version(app: tauri::AppHandle) -> String {
    app.package_info().version.to_string()
}



#[tauri::command]
fn app_relaunch(app: tauri::AppHandle) {
    if let Ok(exe) = std::env::current_exe() {
        let _ = std::process::Command::new(exe).spawn();
    }
    app.exit(0);
}

#[tauri::command]
fn get_hardware_acceleration(app: tauri::AppHandle) -> bool {
    let path = prefs_path(&app);
    let parsed = fs::read_to_string(path)
        .ok()
        .and_then(|raw| serde_json::from_str::<Value>(&raw).ok());
    parsed
        .as_ref()
        .and_then(|v| v.get("hardwareAcceleration"))
        .and_then(|v| v.as_bool())
        .unwrap_or(true)
}

#[tauri::command]
fn set_hardware_acceleration(app: tauri::AppHandle, enabled: bool) -> bool {
    let path = prefs_path(&app);
    let mut parsed = fs::read_to_string(&path)
        .ok()
        .and_then(|raw| serde_json::from_str::<Value>(&raw).ok())
        .unwrap_or_else(|| Value::Object(Default::default()));
    if let Value::Object(map) = &mut parsed {
        map.insert("hardwareAcceleration".into(), Value::Bool(enabled));
    }
    let _ = fs::write(&path, parsed.to_string());
    enabled
}

#[tauri::command]
fn relaunch_app(app: tauri::AppHandle) -> bool {
    app_relaunch(app);
    true
}

#[tauri::command]
fn shell_open_path(app: tauri::AppHandle, path: Option<String>) -> Result<bool, String> {
    #[cfg(desktop)]
    {
        use tauri_plugin_opener::OpenerExt;
        let target = match path {
            Some(p) if !p.is_empty() => PathBuf::from(p),
            _ => app
                .path()
                .download_dir()
                .map_err(|e| e.to_string())?,
        };
        app.opener()
            .open_path(target.to_string_lossy().to_string(), None::<&str>)
            .map_err(|e| e.to_string())?;
        return Ok(true);
    }
    #[allow(unreachable_code)]
    Ok(false)
}

#[tauri::command]
async fn updater_check(app: tauri::AppHandle) -> Result<Value, String> {
    let updater = app.updater().map_err(|e| e.to_string())?;
    match updater.check().await {
        Ok(Some(update)) => Ok(serde_json::json!({
            "available": true,
            "version": update.version,
            "releaseNotes": update.body,
        })),
        Ok(None) => Ok(serde_json::json!({ "available": false })),
        Err(err) => Ok(serde_json::json!({
            "available": false,
            "error": err.to_string(),
        })),
    }
}

#[tauri::command]
async fn updater_download(app: tauri::AppHandle) -> Result<Value, String> {
    let updater = app.updater().map_err(|e| e.to_string())?;
    let update = match updater.check().await {
        Ok(Some(update)) => update,
        Ok(None) => {
            return Ok(serde_json::json!({
                "success": false,
                "error": "no update available"
            }))
        }
        Err(err) => {
            return Ok(serde_json::json!({
                "success": false,
                "error": err.to_string()
            }))
        }
    };
    let version = update.version.clone();
    let mut downloaded: u64 = 0;
    let app_handle = app.clone();
    let result = update
        .download_and_install(
            move |chunk_length, content_length| {
                downloaded += chunk_length as u64;
                let percent = content_length
                    .map(|total| (downloaded as f64 / total as f64) * 100.0)
                    .unwrap_or(0.0);
                let _ = app_handle.emit(
                    "updater:download-progress",
                    serde_json::json!({
                        "percent": percent,
                        "transferred": downloaded,
                        "total": content_length.unwrap_or(0),
                        "bytesPerSecond": 0,
                    }),
                );
            },
            || {},
        )
        .await;
    match result {
        Ok(()) => {
            let _ = app.emit(
                "updater:update-downloaded",
                serde_json::json!({ "version": version }),
            );
            Ok(serde_json::json!({ "success": true }))
        }
        Err(err) => Ok(serde_json::json!({
            "success": false,
            "error": err.to_string(),
        })),
    }
}

#[tauri::command]
fn updater_quit_and_install(app: tauri::AppHandle) -> bool {
    app_relaunch(app);
    true
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Apply the GPU preference before the webview is created so the flag is
    // picked up by WebView2 on the next launch.
    if let Ok(appdata) = std::env::var("APPDATA") {
        let prefs = PathBuf::from(appdata)
            .join("com.itzremyx.liner")
            .join(PREFS_FILE);
        if let Ok(raw) = fs::read_to_string(prefs) {
            if let Ok(value) = serde_json::from_str::<Value>(&raw) {
                let enabled = value
                    .get("hardwareAcceleration")
                    .and_then(|v| v.as_bool())
                    .unwrap_or(true);
                if !enabled {
                    let existing = std::env::var("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS")
                        .unwrap_or_default();
                    let combined = if existing.is_empty() {
                        "--disable-gpu".to_string()
                    } else {
                        format!("{existing} --disable-gpu")
                    };
                    std::env::set_var("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", combined);
                }
            }
        }
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            window_minimize,
            window_toggle_maximize,
            window_toggle_fullscreen,
            window_close,
            window_is_maximized,
            window_is_fullscreen,
            window_drag_start,
            app_get_version,
            app_relaunch,
            relaunch_app,
            get_hardware_acceleration,
            set_hardware_acceleration,
            shell_open_path,
            updater_check,
            updater_download,
            updater_quit_and_install,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
