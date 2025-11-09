import express from "express"
import dotenv from "dotenv"
import testRoute from "./routes/testRoute.js"
import testGit from "./routes/testGit.js"
import cors from "cors"
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/test", testRoute)
app.use("/api/git", testGit)

app.listen(5000, () => {
    console.log(`server running on port 5000`)
})