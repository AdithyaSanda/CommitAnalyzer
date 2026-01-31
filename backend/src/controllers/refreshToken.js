import refreshAccessToken from "../services/refreshToken.js"

const refreshTokenController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) {
            res.status(401).json({msg: "No refresh token"})
        }

        const newAccessToken = await refreshAccessToken(refreshToken)
        return res.status(200).json({token: newAccessToken})
    }
    catch(err) {
        return res.status(403).json({err: err.message})
    }
}

export default refreshTokenController