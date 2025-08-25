//include axios with express.

import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/axios", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    let options = {
      model: "qwen2.5:7b-instruct",
      prompt: prompt,
      stream: false,
    };

    const response = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      options,
      { headers: { "Content-Type": "application/json" } } //important
    );

    res.status(200).json(response.data.response);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res
      .status(400)
      .json(error.response?.data || { error: "Something went wrong" });
  }
});

app.listen(8000, () => {
  console.log("Server is running");
});
