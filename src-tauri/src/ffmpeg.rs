use std::{env, fs, path::PathBuf};
use tauri::{path::BaseDirectory, AppHandle, Error, Manager};

pub fn extract_ffmpeg(tauri_handle: &AppHandle) -> Result<PathBuf, Error> {
    let platform = std::env::consts::OS;
    let filename = match platform {
        "windows" => "_up_/binaries/ffmpeg-win.exe",
        "linux" => "_up_/binaries/ffmpeg-linux",
        _ => panic!("Unsupported platform"),
    };

    let resource_path = tauri_handle
        .path()
        .resolve(filename, BaseDirectory::Resource)?;
    println!("ffmpeg binary path: {}", resource_path.to_string_lossy());

    let temp_path = env::temp_dir();
    let embedded_path = temp_path.join("embedded-ffmpeg");
    println!("temp dir path: {:?}", embedded_path);

    // if already present
    if embedded_path.exists() {
        return Ok(embedded_path);
    }

    fs::copy(&resource_path, &embedded_path).expect("Failed to copy ffmpeg");
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        fs::set_permissions(&embedded_path, fs::Permissions::from_mode(0o755)).unwrap();
    }

    Ok(embedded_path)
}
