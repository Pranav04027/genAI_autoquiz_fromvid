import { spawn } from "child_process";
import path from "path";

const vid_filename = "Human History.mp4";
const audio_filename = "audio for Human History.mp3";

const vid_path = path.join("C:", "Users", "prana", "Desktop", "W", "Bytelearn Content", "Videos", vid_filename);
const audio_path = path.join("C:", "Users", "prana", "Desktop", "W", "Bytelearn Content", "Extracted_audios", audio_filename);

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