import express from "express";
import { Ollama } from "ollama";
import cors from "cors";

const agent = new Ollama({ host: "http://127.0.0.1:11434" });

const app = express();
app.use(express.json());
app.use(cors());

app.post("/sdk", async (req, res) => {
  try {
    const prompt = req.body.prompt;
  
    const options = {
      model: "qwen2.5:7b-instruct",
      prompt: prompt,
      stream: false,
    };
  
    const response = await agent.generate(options);

    res.status(200).json(response.response)
  } catch (error) {
    res.status(400).json(error)
  }
});

app.listen(8000, () => {
  console.log("App is running");
});

/*
const response = await Ollama.generate({
    model: "qwen2.5:7b-instruct",
    prompt:prompt,
})
*/
