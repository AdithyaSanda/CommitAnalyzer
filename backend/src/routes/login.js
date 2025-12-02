import express from "express"
import loginController from "../controllers/login.js"

const router = express()

router.post('/login', loginController)

export default router