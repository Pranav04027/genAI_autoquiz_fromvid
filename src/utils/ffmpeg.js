import path from "path"
import { spawn } from "child_process"
import { fileURLToPath } from "url"

// Accept an absolute video file path and extract audio to temp/Extracted_audios
export const ffmpeg = (videoFilePath) =>{
    return new Promise((resolve, reject) => {

        if(!videoFilePath){
            return reject(new Error("No video file path provided to ffmpeg()"))
        }

        const baseName = path.parse(videoFilePath).name
        const audio_name = `Audio${Date.now()}_${baseName}`

        const __dirname = path.dirname(fileURLToPath(import.meta.url))
        const rootDir = path.resolve(__dirname, "..", "..")

        const audio_path = path.join(rootDir, "temp", "Extracted_audios", `${audio_name}.mp3`)

        console.log("Starting real ffmpeg")
        const create_audio = spawn("ffmpeg", ["-i", videoFilePath, "-vn", "-acodec", "mp3", audio_path])

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