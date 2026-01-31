import logout from "../services/logout.js"

const logoutController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) {
            res.status(403).json("No refresh token")
        }

        await logout(refreshToken)

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        res.json("Logged Out")
    }
    catch(err) {
        res.status(500).json({msg: err.message})
    }
}

export default logoutController