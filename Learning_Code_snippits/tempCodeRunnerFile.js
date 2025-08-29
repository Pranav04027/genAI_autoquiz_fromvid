import express from "express"
import path from "path"
import cors from "cors"
import { spawn } from "child_process"

const app = express()
app.use(cors())
app.use(express.json())

app.post("/whisper", async (req, res) => {
  const file_name = req.body?.file_name

  const file_path = path.join(
    "C:", "Users", "prana", "Desktop", "W",
    "Bytelearn Content", "Extracted_audios",
    `${file_name}.mp3`
  )

  const output_path = path.join(
    "C:", "Users", "prana", "Desktop", "W",
    "Bytelearn Content", "Text_files"
  )

  const runwhisper = () => new Promise((resolve, reject) => {
    const create_text = spawn("whisper", [
      file_path,
      "--model", "base",
      "--output_format", "txt",
      "--output_dir", output_path
    ])

    create_text.on("close", code => {
      if (code === 0) {
        resolve("ran whisper successfully")
      } else {
        reject(new Error(`whisper exited with error code ${code}`))
      }
    })

    create_text.on("error", (err) => {
      reject(err)
    })
  })

  try {
    const message = await runwhisper()
    res.status(200).json({ success: true, message })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.listen(8000, () => {
  console.log("Whisper server running on 8000")
})
