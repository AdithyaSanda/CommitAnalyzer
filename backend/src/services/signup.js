import User from "../models/User.js"
import bcrypt from "bcrypt"
import validator from "validator"

const createNewUser = async (userData) => {
    const {name, email, password} = userData

    if(!name || !email || !password) {
        throw Error("All fields must be filled")
    }
    if(!validator.isEmail(email)) {
        throw Error("Email is not valid")
    }
    if(!validator.isStrongPassword(password)) {
        throw Error("Password not strong enough")
    }

    const exists = await User.findOne({email})

    if(exists) {
        throw Error("Email already in use")
    }

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