import jwt from "jsonwebtoken"
import crypto from "crypto"
import User from "../models/User.js"

const hashToken =  (token) => {
    crypto.createHash('sha256').update(token).digest('hex')
}

const logout = async (refreshToken) => {
    const decoded = jwt.decode(refreshToken)
    if(decoded?.id) {
        const refreshHash = hashToken(refreshToken)

        await User.findByIdAndUpdate(decoded.id, {
            $pull: {refreshTokens: refreshHash}
        })
    }

    return
}

export default logout