import getSummary from "../services/qwenService.js"
import client from "../config/redisConfig.js"

const getCommitSummary = async (req, res) => {
    try {
        const {owner, repo, sha} = req.body
        const summary = await getSummary(owner, repo, sha)
        client.set(`${sha}`, JSON.stringify(summary))
        res.send(summary)
    }
    catch(err) {
        res.status(500).json({error:`HF error: ${err.message}`})
    }
}

export default getCommitSummary