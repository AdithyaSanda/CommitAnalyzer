import express from "express"
import createUser from "../controllers/signup.js"

const router = express()

router.post('/register', createUser)

export default router
