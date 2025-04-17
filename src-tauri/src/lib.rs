use std::env;
use tauri::Manager;
use tauri::PhysicalSize;
use tauri::Size;

mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            // setup basic config for app
            window.set_title("thumbi")?;
            window.set_resizable(false)?;
            window.set_size(Size::Physical(PhysicalSize {
                width: 600,
                height: 600,
            }))?;

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::generate_thumbnail
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
