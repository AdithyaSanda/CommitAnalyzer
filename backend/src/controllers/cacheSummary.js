import client from "../config/redisConfig.js"


const getCacheSummary = async (req, res, next) => {
    try {
        const {sha} = req.body

        const response = await client.get(sha)

        if(response) {

            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            
            res.write(`data: ${JSON.stringify({content: response})}\n\n`)
            
            res.write("data: [DONE]\n\n")
            res.end()
            return
        }

        next()
    }   
    catch(err) {
        next(err)   
    }
}

export default getCacheSummary