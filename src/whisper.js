import {spawn} from "child_process"
import path from "path"

const audio_filename = "audio for Human History" + ".mp3"


const file_path = path.join("C:", "Users", "prana", "Desktop", "W", "Bytelearn Content", "Extracted_audios", audio_filename)
const output_path = path.join("C:", "Users", "prana", "Desktop", "W", "Bytelearn Content", "Text_files")

const generate_txt = spawn("whisper", [file_path , "--model", "base", "--output_format", "txt", "--output_dir", output_path])

generate_txt.on("close", (code) => {
  if (code === 0) {
    console.log("Transcript saved to:", output_path);
  } else {
    console.log("Whisper failed with code:", code);
  }
});

/*
generate_txt.stdout.on("data", (data)=> {
    console.log(`stdout: ${data}`)
})

generate_txt.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`)
})

generate_txt.on("close", (close)=>{
    console.log("Closing process, from child_process, whisper")
})
    */