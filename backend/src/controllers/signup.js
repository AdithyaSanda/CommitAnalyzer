import createNewUser from "../services/signup.js"

const createUser = async (req, res) => {
    try {
        const userData = req.body
        const user = await createNewUser(userData)
        res.status(200).json({user: user, message: "User created successfully"})
    }
    catch(err) {
        res.status(401).json({error: err.message})
    }
}

export default createUser