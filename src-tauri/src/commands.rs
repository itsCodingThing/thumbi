use std::{path, process::Command};

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn generate_thumbnail(
    source_file: &str,
    destination: &str,
    ffmpeg_path: &str,
) -> Result<String, tauri::Error> {
    println!("source_file path: {:?}", source_file);
    println!("destination path: {:?}", destination);
    println!("ffmpeg path: {:?}", ffmpeg_path);

    let file_path = path::Path::new(destination).join("thumb_%03d.jpg");

    let status = match Command::new(ffmpeg_path)
        .args([
            "-i",
            source_file,
            "-vf",
            "fps=1/10",
            file_path.to_str().unwrap(),
        ])
        .status()
    {
        Ok(s) => s,
        Err(_) => panic!("unablet to run command something went wrong!!!"),
    };

    if status.success() {
        println!("✅ Thumbnail created!");
    } else {
        eprintln!("❌ ffmpeg failed");
    }

    Ok(destination.to_string())
}
