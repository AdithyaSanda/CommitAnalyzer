import jwt from 'jsonwebtoken'
import secretKey from '../config/jwtConfig.js'

const generateToken = (user) => {
    const payLoad = {
        id: user._id,
        name: user.name,
        email: user.email
    }

    return jwt.sign(payLoad, secretKey, {expiresIn: "15min"})
}

export default generateToken