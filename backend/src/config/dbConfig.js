import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/commitAnalyzer")
        console.log("MongoDB connected successfully")
    }
    catch(err) {
        console.error("MongoDB connection error: ", err.message)
    }
}

export default mongoose