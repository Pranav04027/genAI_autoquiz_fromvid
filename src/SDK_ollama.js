import { Ollama } from "ollama"
       
const ollama = new Ollama({host: "http://127.0.0.1:11434" })
       
const response = await ollama.generate({
    model:"qwen2.5:7b-instruct",
    prompt: "How are you",
});

console.log(response.response)