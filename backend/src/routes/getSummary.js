import express from "express"
import summaryController from '../controllers/getSummary.js'
import getCacheSummary from "../controllers/cacheSummary.js"

const router = express()

router.post('/summary', getCacheSummary, summaryController)

export default router