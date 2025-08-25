import express from "express"
import cors from "cors"
import axios from "axios"

const app = express()
app.use(express.json())
app.use(cors())

app.post("/axios", async (req,res)=>{
    const prompt = req.body

    const response = await axios.post("http://localhost/")
})


app.listen(8000, () =>{
    console.log("Server is running")
})