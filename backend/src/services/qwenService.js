import axios from "axios"
import { fetchCommitDiff } from "./githubService.js"
import { InferenceClient } from "@huggingface/inference"

const model = "Qwen/Qwen2.5-Coder-7B-Instruct"

const client = new InferenceClient(process.env.HF_API)



export async function* getSummary(owner, repo, sha) {

    const diff = await fetchCommitDiff(owner, repo, sha)

    let out = ""

    const prompt = `You are a senior developer reviewing a git commit. 
    Analyze the following diff and summarize the changes.

    Rules:
    1. Format your response in **Markdown**.
    2. Use **bold** for section headers (e.g., **Added:**).
    3. **CRITICAL:** Insert TWO new lines between every section to ensure proper paragraph breaks.
    4. Keep descriptions concise (max 2-3 lines).
    5. Only include sections that have changes.

    Required Output Format:

    **Added**:
    <summary of additions>

    **Removed**:
    <summary of deletions>

    **Modified**:
    <summary of modifications>

    **Refactored**:
    <summary of code cleanup>

    **Impact**:
    <summary of impact>

    Here is the diff:
    ${diff}`

    


    const stream = client.chatCompletionStream(
        {
            model: model,
            messages : [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 500,
            temperature: 0.2
        }
    ) 
        
    for await(const chunk of stream) {
        if(chunk.choices && chunk.choices.length > 0) {
            const newContent = chunk.choices[0].delta.content
            if(newContent) {
                yield newContent
            }
        }
    }

}




