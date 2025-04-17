use crate::ffmpeg;

#[tauri::command]
pub async fn generate_thumbnail(
    source_file: String,
    destination: String,
    ffmpeg_path: String,
) -> Result<String, String> {
    // need to absolute file path
    println!("source_file path: {:?}", source_file);
    println!("destination path: {:?}", destination);
    println!("ffmpeg path: {:?}", ffmpeg_path);

    match ffmpeg::gen_thumb(ffmpeg_path, source_file, destination).await {
        Ok(_) => Ok(String::from("success")),
        Err(_) => Err(String::from("failed")),
    }
}
