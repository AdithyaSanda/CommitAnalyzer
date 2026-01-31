import jwt from "jsonwebtoken"

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({error:"Token is invalid",message: err.message})
        }

        req.user = user
        next()
    })
}

export default verify