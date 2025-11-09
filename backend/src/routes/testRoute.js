import express from "express"
import { analyzeCommit } from "../services/geminiService.js"
import { fetchCommit, fetchCommitDiff } from "../services/githubService.js"

const router = express.Router()

async function fetchDiff(owner, repo) {
    try {
        const commits = await fetchCommit(owner, repo, 1)
        const sha = commits[0].sha
        const diff = await fetchCommitDiff(owner, repo, sha)
        return diff
    }
    catch(err) {
        console.error("GITHUB fetch err: ", err.message)
        throw err
    }
}

// const owner = "freeCodeCamp"
// const repo = "freeCodeCamp"




// router.get("/", async (req, res) => {
//     try {
        
//     }
//     catch(err) {  
//         res.status(500).json({error: `Analyze commit error: ${err.message}`})
//     }
// })

router.post("/",async (req, res) => {
    try {
        const {owner, repo} = req.body;
        console.log(owner, repo)
        const diffText = await fetchDiff(owner, repo)

        const prompt = `
            You are an AI that explains Git commit diffs clearly.
            Analyze the following diff and summarize:
            Here is a commit diff: ${diffText}
            1. What was changed
            2. Why it might have been changed
            3. Potential impact or risk

            Return JSON like:
            {
                "summary": "...",
                "reason": "...",
                "impact": "..."
            }

            When responding, provide the answer strictly in JSON format with three fields: "summary", "reason", and "impact". Do NOT include any markdown, code blocks, or extra formatting. Each field should contain a concise, clear explanation relevant to the question. The JSON should be valid and parseable.
            Respond only with valid JSON. Do not add \`\`\`json\`\`\` or any code block formatting. Only include the JSON object with keys: summary, reason, impact.


        `;

        const explanation = await analyzeCommit(prompt)
        res.json({explanation})
    }
    catch(err) {
        console.error("Error in /post method", err.message)
        res.status(500).json({error: err.message})
    }
    
})
export default router