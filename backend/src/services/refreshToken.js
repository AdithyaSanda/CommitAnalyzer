import jwt from "jsonwebtoken"
import User from "../models/User.js"
import crypto from "crypto"
import generateToken from "../utils/jwtUtil.js"

const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex')
}

const refreshAccessToken = async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decoded.id)
    if(!user) {
        throw Error("Forbidden user")
    }

    const refreshHash = hashToken(refreshToken)

    if(!user.refreshTokens.includes(refreshHash)) {
        throw Error("Invalid refresh token")
    }

    const newAccessToken = generateToken(user)
    return newAccessToken
}

export default refreshAccessToken