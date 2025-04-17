use std::{path::Path, process::Command, thread};

pub async fn gen_thumb(
    ffmpeg_path: String,
    source_file: String,
    destination: String,
) -> Result<String, String> {
    let file_path = Path::new(destination.as_str()).join("thumb_%03d.jpg");

    let gen_thumb = thread::spawn(move || {
        let status = match Command::new(ffmpeg_path)
            .args([
                "-i",
                source_file.as_str(),
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
    });

    match gen_thumb.join() {
        Ok(_) => Ok(destination.to_string()),
        Err(_) => Err(String::from("proccess crashed!!")),
    }
}
