import path from "path"
import { spawn } from "child_process"
import { fileURLToPath } from "url"

export const ffmpeg = (file_name) =>{
    return new Promise((resolve, reject) => {

        const vid_path = path.join("C:", "Users", "prana", "Desktop", "W", "Bytelearn Content", "Videos", `${file_name}.mp4`)
        const audio_name = `Audio${Date.now()}${file_name}`

        const __dirname = path.dirname(fileURLToPath(import.meta.url))
        const rootDir = path.resolve(__dirname, "..", "..")

        const audio_path = path.join(rootDir, "temp", "Extracted_audios", `${audio_name}.mp3`)

        console.log("Starting real ffmpeg")
        const create_audio = spawn("ffmpeg", ["-i", vid_path, "-vn", "-acodec", "mp3", audio_path])

          /*create_audio.stderr.on("data", (data) => {
            console.log(data.toString());
          })*/

        create_audio.once("close", code => {
            if(code == 0){
                resolve({
                    message: "Successfully done with extracting audio",
                    audio_filename: audio_name
                })
            }else{
                reject(new Error(`ffmpeg exied with error code ${code}`))
            }
        })

        create_audio.once("error", (error) => {
            reject(new Error(`While creating the audio from video, error occured: ${error}`))
        })
        
    })
}

//const fileName = `Audio_${Date.now()}.mp3`;