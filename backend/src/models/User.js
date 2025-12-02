import mongoose from "../config/dbConfig.js"

const User = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

export default mongoose.model("User", User)