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

* Just want to test the LLM? Use `src/express_axios.js` or `src/express_sdk.js`.
* Want the full pipeline? Run `src/FFmpeg.js`, plug in Whisper, then send the transcript to Ollama.

---

## 🚀 Features

* 🎞️ Extract audio from videos using **FFmpeg**
* 🗣️ Transcribe audio to text using **Whisper** *(implementation scaffold included)*
* 🧠 Generate quiz questions using **Ollama** (e.g., `qwen2.5:7b-instruct`)
* 🧩 Clean, modular **Express.js API**
* 🔁 Two flavors: **Axios** or **Ollama SDK**
* 🧪 Example prompts + sample response schema

---

## 🧱 Prerequisites

* **Node.js** v16+ (v18+ recommended)
* **FFmpeg** (in your system PATH)
* **Ollama** (running locally) + a compatible model (e.g., `qwen2.5:7b-instruct`)
* **Whisper** (OpenAI Whisper or faster-whisper/whisper.cpp—choose your flavor)

learn to use Ollama -> 2 ways -> SDK or axios -> use them -> use them with express

learn to use ffmpeg in terminal -> learn to use spawn + ffmpeg -> express + ffmpeg + spawn
learn to use whisper -> whisper + spawn -> whisper + spawn + expressQ