import express from "express"
import path from "path"
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
    
    
        const create_audio = spawn("ffmpeg", ["-i", vid_path, "-vn", "-acodec", "mp3", audio_path])
    
        create_audio.on("close", (code) => {
            if (code == 0){
                console.log("Successfully exiting the ffmpeg function")
            }else{
                console.error(`Some error occured ${code}`)
            }
        })

        res.status(200).json("Sucessfully Extracted audio using ffmpeg")
    } catch (error) {
        res.status(400).json(`Some error occured while extracting audio using ffmpeg: ${error}`)
    }

} )

app.listen(8000 , () => {
    console.log("Server is running on port 8000")
})