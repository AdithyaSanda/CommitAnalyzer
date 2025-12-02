import login from "../services/login.js"

const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;
        const token = await login(email, password)
        res.json({token: token})
    }
    catch(err) {
        res.status(401).json({error: err.message})
    }
}

export default loginController