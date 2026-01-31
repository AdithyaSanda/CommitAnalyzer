import jwt from 'jsonwebtoken'

const generateToken = (user) => {
    const payLoad = {
        id: user._id,
        name: user.name,
        email: user.email
    }

    return jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"})
}

export const generateRefreshToken = (user) => {
    const payLoad = {
        id: user._id,
        name: user.name,
        email: user.email
    }

    return jwt.sign(payLoad, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"})
}

export default generateToken