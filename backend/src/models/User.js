import mongoose from "../config/dbConfig.js"

const User = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    refreshTokens: {type: [String], default: []}
})

export default mongoose.model("User", User)