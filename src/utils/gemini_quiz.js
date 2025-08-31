import dotenv from "dotenv";
dotenv.config();

import path from "path";
import fs from "fs";

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error("The GOOGLE_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const generatequiz = async (file_name, quiz_count) => {
  const text_path = path.join(
    process.cwd(),
    "temp",
    "Text_files",
    `${file_name}.txt`
  );

  console.log(`Reading text file using fs: ${file_name}`);

  const read_file = fs.readFileSync(text_path);

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

  console.log("This is length of prompt being sent" + prompt.length)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  console.log("Sending prompt to Gemini...");

  try {
    const result = await model.generateContent({

      contents: [{
        role: "user",
        parts: [{
            text: prompt
        }]
      }],

      generationConfig: {
        temperature: 0.4,
      },

    });

    const response = result.response

    let raw = response.text()

    try{
      parsed = JSON.parse(raw)
    }catch(e){
      throw new Error("Failed to parse LLM output as JSON: " + e.message)
    }

    
    console.log("Done with genimi! sent the quiz to server!!")

    return parsed;

  } catch (error) {
    throw new Error("Failed to get response from Gemini: "+ error)
  }
};




/*
async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const prompt =
    "Write a short, catchy jingle for a new brand of coffee called 'Stellar Brew'.";

  console.log("Sending prompt to Gemini...");

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4, // randomness (0 = deterministic, 1 = more random)
      //topP: 0.9,              // nucleus sampling (probability mass to consider)
      //topK: 40,               // limits candidates to top-k tokens
      //maxOutputTokens: 150,   // maximum tokens to generate
      //stopSequences: ["###"], // optional, tells model when to stop
    },
  });
  const response = result.response;
  const text = response.text();

  console.log(text);
}
*/