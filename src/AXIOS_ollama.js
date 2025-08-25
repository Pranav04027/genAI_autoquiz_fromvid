import axios from "axios";

const options = {
    model:"qwen2.5:7b-instruct",
    prompt:"Please tell me how you are feeling",
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