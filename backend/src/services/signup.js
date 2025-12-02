import User from "../models/User.js"
import bcrypt from "bcrypt"

const createNewUser = async (userData) => {
    const {name, email, password} = userData
    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = new User({
        name,
        email,
        password: hashedPassword
    })

    const savedUser = createdUser.save()
    return savedUser
}

export default createNewUser