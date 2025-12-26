import client from "../config/redisConfig.js"


const getCacheSummary = async (req, res, next) => {
    try {
        const {sha} = req.body
        const response = await client.get(sha)

        if(response) {
            return res.send(JSON.parse(response))
        }

        return next()
    }
    catch(err) {
        res.status(500).json({error: `redis error: ${err.message}`})
    }
}

export default getCacheSummary