import express from "express"
import path, { resolve } from "path"
import { spawn } from "child_process"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

app.post("/ffmpeg", async (req, res) => {
    try {
        const file_name = req.body?.file_name
    
        const vid_path = path.join("C:", "Users", "prana", "Desktop", "W", "Bytelearn Content", "Videos", `${file_name}.mp4`)
        const audio_path = path.join("C:", "Users", "prana", "Desktop", "W", "Bytelearn Content", "Extracted_audios", `Audio for ${file_name}.mp3`)
    
    
        const runffmpeg = () => new Promise((resolve, reject) => {
            const create_audio = spawn("ffmpeg", ["-i", vid_path, "-vn", "-acodec", "mp3", audio_path]);

            create_audio.on("close", code => {
                if(code == 0){
                    resolve("Audio file created successfully")
                }else{
                    reject(new Error(`ffmpeg exied with error code ${code}`))
                }
            })

            create_audio.on("error", (error) => {
                console.error("Failed to start ffmpeg process:", err);
                reject(error)
            })
        });

         const message = await runffmpeg()

        res.status(200).json(`Sucessfully Extracted audio using ffmpeg message: ${message}`)
    } catch (error) {
        res.status(400).json(`Some error occured while extracting audio using ffmpeg: ${error}`)
    }

} )

app.listen(8000 , () => {
    console.log("Server is running on port 8000")
})