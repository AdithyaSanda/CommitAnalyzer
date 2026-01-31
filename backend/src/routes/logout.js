import express from "express"
import logoutController from "../controllers/logout.js"

const router = express()

router.post('/logout', logoutController)
export default router