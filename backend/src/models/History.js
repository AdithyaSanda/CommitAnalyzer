import mongoose from "../config/dbConfig.js"

const History = new mongoose.Schema({
    userId: String,
    repoUrl: String,
    nodes: Array,
    edges: Array,
    createdAt: Date
})

export default mongoose.model("History", History)