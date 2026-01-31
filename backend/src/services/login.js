import bcrypt from "bcrypt"
import generateToken, {generateRefreshToken} from "../utils/jwtUtil.js"
import User from "../models/User.js"
import crypto from "crypto"

const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex")
}

const login = async (email, password) => {
    try {
        const existingUser = await User.findOne({email})
        if(!existingUser) {
            throw new Error("User not found")
        }

        const validPassword = await bcrypt.compare(password, existingUser.password)
        if(!validPassword) {
            throw new Error("Incorrect password")
        }

        const token = generateToken(existingUser)
        const refreshToken = generateRefreshToken(existingUser)

        const refreshHash = hashToken(refreshToken)

        if(!existingUser.refreshTokens.includes(refreshHash)) {
            existingUser.refreshTokens.push(refreshHash)
            await existingUser.save()
        }

        return {token, refreshToken, existingUser}
    }
    catch(err) {
        console.error("Login error: ", err.message)
        throw err
    }
    
}

export default login