import express from "express"
import { fetchCommitDetails } from "../services/githubService.js";

const router = express()

router.post("/", async (req, res) => {
    const {owner, repo, sha} = req.body

    try {
        const response = await fetchCommitDetails(owner, repo, sha)
        res.send(response) 
    }
    catch(err) {
        console.error("Error in /post method of getGraphData", err)
        res.status(500).json({error: err.message})
    }
    
})

export default router