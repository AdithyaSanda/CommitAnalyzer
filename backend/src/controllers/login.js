import login from "../services/login.js"

const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;
        const {token, refreshToken, existingUser} = await login(email, password)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7*24*60*60*1000
        })

        res.json({token: token, user: existingUser})
    }
    catch(err) {
        res.status(401).json({error: err.message})
    }
}

export default loginController