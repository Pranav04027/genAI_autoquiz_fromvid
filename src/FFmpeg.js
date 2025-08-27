import { spawn } from "child_process";
import path from "path";

const filename = "Human History";

const vid_path = path.join("C:", "Users", "prana", "Desktop", "W", "Bytelearn Content", "Videos", `${filename}.mp4`);
const audio_path = path.join("C:", "Users", "prana", "Desktop", "W", "Bytelearn Content", "Extracted_audios", `audio for ${filename}.mp3`);

console.log("Video path:", vid_path);
console.log("Audio path:", audio_path);

const create_audio = spawn("ffmpeg", ["-i", vid_path, "-vn", "-acodec", "mp3", audio_path ]);

create_audio.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

create_audio.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

create_audio.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});