import path from "path";
import axios from "axios";
import fs, { readFileSync , writeFileSync } from "fs";

export const ollama_summery = async (file_name) => {

    const text_path = path.join("C:", "Users", "prana","Desktop","W","Bytelearn Content","Text_files",`${file_name}.txt`)

    console.log(`Reading text file using fs: ${file_name}`)

    console.log("Reading txt for summarization")
    const read_file = fs.readFileSync(text_path)

    const prompt = 
    `
    You are a summarizer. 
    Summarize the following transcript into a clear, concise summary (Size of summary according to the input provided). 
    Keep only the key concepts, definitions, steps, or arguments. 
    Do not include filler words, timestamps, or speaker notes remove them from summery. 
    Focus only on the educational content.
    this summary will later be used to create quizzes so keep the important concepts.

    Here is the input transcribed text of the video lesson:
    ${read_file}
    `
    const options = {
        model: "qwen2.5:7b-instruct",
        prompt: prompt,
        stream: false,
        options:{
      num_ctx: 32768,
      temperature: 0.6
    }
    }

    try {
        console.log("Sent request to ollama to summarise")
        const response = await axios.post(
            "http://127.0.0.1:11434/api/generate",
            options,
            { headers: { "Content-Type": "application/json" } }
        )

        console.log("Got summary from ollama")
        const raw = response.data.response

        try {
            const parsed = JSON.parse(raw)
        } catch (error) {
            throw new Error("Failed to parse response")
        }

        return parsed
    } catch (error) {
        throw new Error("Error occured while summarising: " + error)
    }
}