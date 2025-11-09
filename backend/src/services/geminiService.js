import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"
dotenv.config()

console.log("API Key loaded:", process.env.GEMINI_API_KEY ? "Yes" : "No");

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = ai.getGenerativeModel({model: "gemini-2.5-pro"})

export async function analyzeCommit(prompt) {
    try {
        const result = await model.generateContent(prompt)
        const response = result.response
        return response.text()  
    }
    catch(err) {
        console.error("Gemini API error: ", err)
        throw err
    }
}

