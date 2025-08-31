import express from "express"
import cors from "cors"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
dotenv.config()
import { ffmpeg } from "./utils/ffmpeg.js"
import { runollama } from "./utils/ollama_quiz.js"
import { whisper } from "./utils/whisper.js"
import {generatequiz} from "./utils/gemini_quiz.js"
import upload from "../middlewares/upload.js"

const app = express()

app.use(express.json())
app.use(cors())

app.post("/generate_quiz_ollama", upload.single("video"), async (req, res) => {
    try {
        const quiz_count = req.body?.quiz_count

        if(!req.file?.path){
            throw new Error("No video uploaded. Send a 'video' file field via multipart/form-data")
        }

        if(!quiz_count){
            throw new Error("quiz count not in req.body")
        }
        
        // Start FFMPEG 
        const extracted_audio = await ffmpeg(req.file.path)

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
        console.log("Sucessss in creating quizzes")

        try {
            const __dirname = path.dirname(fileURLToPath(import.meta.url))
            const rootDir = path.resolve(__dirname, "..")

            await fs.promises.unlink(path.join(rootDir, "temp", "Extracted_audios", `${audio_filename}.mp3`))
            console.log("Deleted created audio file from temp")

            await fs.promises.unlink(path.join(rootDir, "temp", "Text_files", `${txt_filename}.txt`))
            console.log("Deleted created text filename from temp")

            // Delete uploaded source video
            await fs.promises.unlink(req.file.path)
            console.log("Deleted uploaded source video")

        } catch (error) {
            throw new Error("Error occured while deleting files from temp" + error)
        }
    
        res.status(200).json(created_quiz)
    } catch (error) {
        // Best-effort cleanup of uploaded file on error
        try { if (req.file?.path) { await fs.promises.unlink(req.file.path) } } catch (_) {}
        res.status(400).json({ error: error.message })
    }

})

app.post("/generate_quiz_gemini", upload.single("video"), async (req, res) => {

    try {
        const quiz_count = req.body?.quiz_count

        if(!req.file?.path){
            throw new Error("No video uploaded. Send a 'video' file field via multipart/form-data")
        }

        if(!quiz_count){
            throw new Error("quiz count not in req.body")
        }
        
        // Start FFMPEG 
        const extracted_audio = await ffmpeg(req.file.path)

        //Get the new Audio_filename returned by ffmpeg
        const audio_filename = extracted_audio.audio_filename

        console.log(`message: ${extracted_audio.message} and created the file -> ${audio_filename}`)


        // use whisper
        const created_text= await whisper(audio_filename)

        // Text file name
        const txt_filename = created_text.txt_filename

        console.log(`message: ${created_text.message} and created the file -> ${txt_filename}`)


        //Use gemmini
        const created_quiz = await generatequiz(txt_filename, quiz_count)

        try {
                const __dirname = path.dirname(fileURLToPath(import.meta.url))
                const rootDir = path.resolve(__dirname, "..")
    
                await fs.promises.unlink(path.join(rootDir, "temp", "Extracted_audios", `${audio_filename}.mp3`))
                console.log("Deleted created audio file from temp")
    
                await fs.promises.unlink(path.join(rootDir, "temp", "Text_files", `${txt_filename}.txt`))
            console.log("Deleted created text filename from temp")

                await fs.promises.unlink(req.file.path)
                console.log("Deleted uploaded source video")
        
        } catch (error) {
            throw new Error("Error occured while deleting files from temp" + error)
        }
    
        res.status(200).json(created_quiz)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

})

const port = process.env.PORT || 8001

app.listen(port, ()=>{
    console.log(`Port is running on the port ${port}`)
})