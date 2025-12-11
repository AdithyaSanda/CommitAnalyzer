import express from "express"
import { fetchCommitDiff } from "../services/githubService.js"
import { analyzeCommit } from "../services/geminiService.js"

const router = express()

router.post("/",async (req, res) => {
    const {owner, repo, sha} = req.body

    try {
        const diffText = await fetchCommitDiff(owner, repo, sha)

        const prompt = `You will be given a GitHub repository commit diff. Analyze the diff and summarize the changes. Your goal is to clearly describe what was added, removed, modified, or refactored, and explain the intent or impact when possible in 5-10 lines.

        Output Format (plain text only, no markdown or special characters):
        Change summary:
        Added:
        Removed:
        Modified:
        Refactored:
        Impact:

        Fill in only the sections that apply. Keep the wording concise and clear. Do not include code or explanations of the diff format.

        Here is the diff:
        ${diffText}`

        const summary = await analyzeCommit(prompt)
        res.send(summary)
    }
    catch(err) {
        console.error('Error in post method of getCommitSummary', err)
        res.status(500).json({error: err.message})
    }

})

export default router