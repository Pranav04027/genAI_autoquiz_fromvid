# 🎯 Video Quiz Generator (FFmpeg × Whisper × Ollama)

Turn any video into an interactive quiz with a fully local, free stack. Extract audio with **FFmpeg**, transcribe with **Whisper**, then generate smart questions using an LLM via **Ollama**.

> A tiny, modular playground to learn by doing: each script is small, focused, and easy to swap or extend.

---

## ✨ Why this exists

While building **ByteLearn** (my main project), I wanted to tinker with GenAI. Since ByteLearn already has the option to create quizzes, I thought—why not automate it? That curiosity led me here: a mini side‑project where I explore how free, local tools can transform any video into an interactive learning experience.

The pipeline is simple:

1. **Extract audio** from a video with FFmpeg
2. **Transcribe speech → text** with Whisper
3. **Prompt an LLM** (via Ollama) to build high‑quality quizzes

**Why Ollama?** It’s free, local, and fast to iterate with. If you’re learning too, follow along—drop in any video, run the steps, and watch the pipeline come alive.

**Choose your path:**

* End-to-end API (upload a video and get quizzes): run `src/app.js` and call the upload routes below.
* Just want to tinker with LLM prompting? See `src/utils/ollama_quiz.js` and `src/utils/gemini_quiz.js`.

---

## 🚀 Features

* 🎞️ Extract audio from videos using **FFmpeg**
* 🗣️ Transcribe audio to text using **Whisper** *(implementation scaffold included)*
* 🧠 Generate quiz questions using **Ollama** (e.g., `qwen2.5:7b-instruct`)
* 🧩 Clean, modular **Express.js API** with file upload
* 🔁 Two flavors: **Axios** or **Ollama SDK**
* 🧪 Example prompts + sample response schema

---

## 🧱 Prerequisites

* **Node.js** v16+ (v18+ recommended)
* **FFmpeg** (in your system PATH)
* **Ollama** (running locally) + a compatible model (e.g., `qwen2.5:7b-instruct`)
* **Whisper** (OpenAI Whisper or faster-whisper/whisper.cpp—choose your flavor)
* A shell-accessible `ffmpeg` and `whisper` binary (in PATH)

---

## ⚡ Quick Start (Upload-based)

1) Install deps and start the server

```bash
npm install
npm run dev
```

2) Call the API with a video file and desired quiz count (multipart/form-data)

Ollama route:

```bash
curl -X POST http://localhost:8001/generate_quiz_ollama \
  -F "video=@/absolute/path/to/lesson.mp4" \
  -F "quiz_count=5"
```

Gemini route:

```bash
curl -X POST http://localhost:8001/generate_quiz_gemini \
  -F "video=@/absolute/path/to/lesson.mp4" \
  -F "quiz_count=5"
```

Response shape (example):

```json
{
  "questions": [
    {
      "questionText": "...",
      "options": [
        { "text": "...", "isCorrect": false },
        { "text": "...", "isCorrect": true },
        { "text": "...", "isCorrect": false },
        { "text": "...", "isCorrect": false }
      ]
    }
  ]
}
```

3) Cleanup

After processing, the server automatically deletes:

- The uploaded source video (`uploads/`)
- Extracted audio (`temp/Extracted_audios/*.mp3`)
- Generated transcript (`temp/Text_files/*.txt`)

If an error occurs, it attempts to remove the uploaded video as well.