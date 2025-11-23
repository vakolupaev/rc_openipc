use tauri::{Manager, State};
use tokio::sync::Mutex;

mod webrtc;

#[derive(Default)]
pub struct AppData {
    local_session_description_webview: String,
    remote_session_description: String,
}

#[tauri::command(rename_all = "snake_case")]
async fn set_local_session_description_webview(local_session_description_webview: String, state: State<'_, Mutex<AppData>>) -> Result<(), String> {
    let mut state = state.lock().await;
    state.local_session_description_webview = local_session_description_webview;
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
async fn get_remote_session_description(state: State<'_, Mutex<AppData>>) -> Result<String, String> {
    let state = state.lock().await.remote_session_description.clone();
    Ok(state)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            app.manage(Mutex::new(AppData::default()));

            let app_handle = app.handle().clone();

            tauri::async_runtime::spawn(async move {
                let _ = webrtc::proc(&app_handle).await;
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![set_local_session_description_webview, get_remote_session_description])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


