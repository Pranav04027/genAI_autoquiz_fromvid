import axios from "axios";
import path from "path"
import fs from "fs"

export const runollama = async (file_name, quiz_count) => {

  const text_path = path.join(process.cwd() ,"temp","Text_files",`${file_name}.txt`)

  console.log(`Reading text file using fs: ${file_name}`)

  const read_file = fs.readFileSync(text_path)

  const prompt = `You are an educational quiz generator. I will provide you with a lesson (transcribed text). Your task is to create exactly ${quiz_count} quiz questions from the lesson. 
                  Do not mention that the content came from a "text file"; always refer to it as "the lesson."

Lesson:
""" 
${read_file}
"""

Guidelines:
- If the lesson is **theoretical knowledge** (e.g., learning colors, alphabets, human evolution, etc.), create questions that check understanding of the lesson directly.
- If the lesson is **technical or skill-based** (e.g., math, programming, problem-solving), mix the questions: 
  - Some should be direct (based on the lesson facts). 
  - Some should be new applied questions (e.g., addition, subtraction, multiplication problems based on what was taught).

The JSON must strictly follow this schema:

{
  "questions": [
    {
      "questionText": "string",
      "options": [
        { "text": "string", "isCorrect": true/false },
        { "text": "string", "isCorrect": true/false },
        { "text": "string", "isCorrect": true/false },
        { "text": "string", "isCorrect": true/false }
      ]
    }
  ]
}

Rules:
- Always generate exactly ${quiz_count} questions.
- Each question must have exactly 4 options with only ONE correct answer.
- Correct answer must appear **only once** in the options.
- Avoid generic or trivial questions—focus on the extracted key concepts.
- Do not include explanations or any text outside the JSON
`

  const options = {
    model: "qwen2.5:7b-instruct",
    prompt: prompt,
    stream: false,
    options:{
      num_ctx: 32768,
      temperature: 0.4
    }
  };

  try {

    console.log(`starting ollama on ${file_name}`)

    const response = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      options,
      { headers: { "Content-Type": "application/json" } }
    );

    const raw = response.data.response;

    let parsed;
    try{
      parsed = JSON.parse(raw)
    }catch(e){
      throw new Error("Failed to parse LLM output as JSON: " + e.message)
    }

    return parsed
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};