import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import { ffmpeg } from "./utils/ffmpeg.js"
import { runollama } from "./utils/ollama.js"
import { whisper } from "./utils/whisper.js"

const app = express()

app.use(express.json())
app.use(cors())

app.post("/generate_quiz", async (req, res) => {
    try {
        const file_name = req.body?.file_name;
        const quiz_count = req.body?.quiz_count
    
        if(!file_name){
            throw new Error("File name not in req.body")
        }

        if(!quiz_count){
            throw new Error("quiz count not in req.body")
        }
    
        // Start FFMPEG 
        const extracted_audio = await ffmpeg(file_name)

        //Get the new Audio_filename returned by ffmpeg
        const audio_filename = extracted_audio.audio_filename

        console.log(`message: ${extracted_audio.message} and created the file -> ${audio_filename}`)


        // use whisper
        const created_text= await whisper(audio_filename)

        // Text file name
        const txt_filename = created_text.txt_filename

        console.log(`message: ${created_text.message} and created the file -> ${txt_filename}`)


        //Use ollama
        const created_quiz = await runollama(txt_filename, quiz_count)
    
        res.status(200).json(created_quiz)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

})

const port = process.env.PORT || 8001

app.listen(port, ()=>{
    console.log(`Port is running on the port ${port}`)
})