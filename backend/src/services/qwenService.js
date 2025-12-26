import axios from "axios"
import { fetchCommitDetails, fetchCommitDiff } from "./githubService.js"

const model = "Qwen/Qwen2.5-Coder-7B-Instruct"


const getSummary = async (owner, repo, sha) => {

    const diff = await fetchCommitDiff(owner, repo, sha)


    const prompt = `You will be given a GitHub repository commit diff. Analyze the diff and summarize the changes. Your goal is to clearly describe what was added, removed,    modified, or refactored, and explain the intent or impact when possible in 2-3 lines.

    Output Format (plain text only, no markdown or special characters):
    Change summary:

    **Added**:

    **Removed**:

    **Modified**:

    **Refactored**:

    **Impact**:

    Fill in only the sections that apply. Keep the wording concise and clear. Do not include code or explanations of the diff format. Explain each section in 2-3 lines in simple words.

    Here is the diff:\n\n
    ${diff}`


    const response = await axios.post("https://router.huggingface.co/v1/chat/completions", 
        {
            model: model,
            messages : [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.HF_API}`,
                "Content-Type": "application/json",
            }
        }
    )
    

    return response.data
}


export default getSummary


