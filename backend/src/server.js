import express from "express"
import dotenv from "dotenv"
import getGraph from "./routes/getGraph.js"
import getGraphData from "./routes/getGraphData.js"
import testGit from "./routes/testGit.js"
import getCommitSummary from "./routes/getCommitSummary.js"
import cors from "cors"
import { connectDB } from "./config/dbConfig.js"
import signupRoute from './routes/signup.js'
import loginRoute from './routes/login.js'
import historyRoute from './routes/history.js'
import userRoute from './routes/getUser.js'
import summaryRoute from './routes/getSummary.js'


dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

connectDB()

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});


app.use("/api/getGraph", getGraph)
app.use("/api/git", testGit)
app.use("/api/getGraphData", getGraphData)
app.use("/api/getSummary", getCommitSummary)
app.use('/user', signupRoute)
app.use('/auth', loginRoute)
app.use('/history', historyRoute)
app.use('/users', userRoute)
app.use('/commit', summaryRoute)

app.listen(5000, () => {
    console.log(`server running on port 5000`)
})
