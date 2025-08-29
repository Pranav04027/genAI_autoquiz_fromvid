import axios from "axios";
import fs from "fs";
import path from "path"

const textPath = path.join(
    "C:", "Users", "prana", "Desktop", "W",
    "Bytelearn Content", "Text_files", "Audio for Normal Multiply.txt"
  )

const transcript = fs.readFileSync(textPath, "utf-8");

const options = {
    model:"qwen2.5:7b-instruct",
    prompt:`Generate a detailed 5-question multiple-choice quiz from the following text transcript. The questions should test comprehension of the material. Format the output as a JSON object with a 'quiz' key, which is an array of question objects. Each question object should have 'question', 'options' (an array), and 'correct_answer' keys. \n\nTranscript: ${transcript}`,
    stream:false
}



function printresponse(raw){
    let response = ""
    for (a in raw){
        response = response + raw.response;
    }

    return response;
}

async function askOllama() {
    try {
        const respons = await axios.post("http://localhost:11434/api/generate", options)

        console.log(respons.data.response)
    } catch (error) {
        console.error("Something went wrong")
    }
}

askOllama()