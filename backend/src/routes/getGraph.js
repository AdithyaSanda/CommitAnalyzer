import express from "express"
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


router.post("/",async (req, res) => {
    try {
        const {owner, repo, page} = req.body;

        const commits = await fetchCommit(owner, repo, page)
        res.json({commits})
    }
    catch(err) {
        console.error("Error in /post method", err.message)
        res.status(500).json({error: err.message})
    }
    
})
export default router