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
import verify from "./utils/AuthMiddleware.js"
import cookieParser from 'cookie-parser'
import refreshRoute from './routes/refreshToken.js'
import { globalLimiter, authLimiter } from "./utils/rateLimiter.js"
import logoutRoute from "./routes/logout.js"


dotenv.config()
const app = express()
// app.use(cors())
app.use(express.json())

connectDB()

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use('/api/user', authLimiter, signupRoute)
app.use('/api/auth', authLimiter, loginRoute)
app.use('/api/refresh', refreshRoute)
app.use('/api/log', logoutRoute)

app.use(globalLimiter)

app.use("/api/getGraph", verify, getGraph)
app.use("/api/git", verify, testGit)
app.use("/api/getGraphData", verify, getGraphData)
app.use("/api/getSummary", verify, getCommitSummary)
app.use('/api/history', verify, historyRoute)
app.use('/api/users', verify, userRoute)
app.use('/api/commit', verify, summaryRoute)


app.listen(5000, () => {
    console.log(`server running on port 5000`)
})
