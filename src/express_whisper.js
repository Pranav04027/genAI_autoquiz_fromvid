import express from "express"
import path from "path"
import cors from "cors"
import { spawn } from "child_process"

const app = express()
app.use(cors())
app.use(express.json())

app.post("/whisper", assync)

app.listen(8000, () => {
    console.log("Whisper server running on 8001")
})