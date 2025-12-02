import crypto from "crypto"

const secretKey = await crypto.randomBytes(32).toString('hex')

export default secretKey