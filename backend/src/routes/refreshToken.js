import express from "express"
import refreshTokenController from "../controllers/refreshToken.js"

const router = express()

router.post('/', refreshTokenController)

export default router