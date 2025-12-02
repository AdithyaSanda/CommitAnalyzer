import bcrypt from "bcrypt"
import generateToken from "../utils/jwtUtil.js"
import User from "../models/User.js"

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
        return token
    }
    catch(err) {
        console.error("Login error: ", err.message)
        throw err
    }
    
}

export default login