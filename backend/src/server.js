import express from "express"
import dotenv from "dotenv"
import getGraph from "./routes/getGraph.js"
import testGit from "./routes/testGit.js"
import cors from "cors"
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/getGraph", getGraph)
app.use("/api/git", testGit)

app.listen(5000, () => {
    console.log(`server running on port 5000`)
})