import userController from '../controllers/getUser.js'
import express from "express"

const router = express()

router.get('/getUser/:id', userController)

export default router