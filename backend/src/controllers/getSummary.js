import { getSummary }from "../services/qwenService.js"
import client from "../config/redisConfig.js"

const getCommitSummary = async (req, res) => {
    try {
        const {owner, repo, sha} = req.body
        
        res.setHeader("Content-Type", "text/event-stream")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")

        let fullText = ""
        for await (const token of getSummary(owner, repo, sha)) {
            fullText += token
            res.write(`data: ${JSON.stringify({content: token})}\n\n`)
        }

        await client.set(`${sha}`, fullText)
        res.write("data: [DONE]\n\n")
        res.end()
    }   
    catch(err) {
        res.status(401).json({error:`HF error: ${err.message}`})
    }
}

export default getCommitSummary