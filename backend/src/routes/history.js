import express from "express"
import addHistory from "../controllers/history.js"
import { getUserHistory } from "../controllers/history.js"
import { getRepoDetails } from "../controllers/history.js"

const router = express()


router.post('/addrepo', addHistory)
router.get('/getHistory/:userId', getUserHistory)
router.get('/item/:id', getRepoDetails)

export default router