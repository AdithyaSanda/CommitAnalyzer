import express from "express"
import addHistory from "../controllers/history.js"
import { getUserHistory } from "../controllers/history.js"
import { getRepoDetails, deleteRepoDetails } from "../controllers/history.js"

const router = express()


router.post('/addrepo', addHistory)
router.get('/getHistory/:userId', getUserHistory)
router.get('/item/:id', getRepoDetails)
router.delete('/item/:id', deleteRepoDetails)

export default router