import express from "express"
import dotenv from "dotenv"
import { fetchCommit, fetchCommitDiff } from "../services/githubService.js"

dotenv.config()

const router = express.Router()

router.get('/', async (req, res) => {
    const owner = "freeCodeCamp"
    const repo = "freeCodeCamp"

    try {
        const commits = await fetchCommit(owner, repo, 1)
        const sha = await commits[0].sha
        const diff = await fetchCommitDiff(owner, repo, sha)
        res.send({
            commit: sha,
            diff: diff
        })
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
})

export default router