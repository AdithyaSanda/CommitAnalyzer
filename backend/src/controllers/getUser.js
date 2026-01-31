import getUser from "../services/getUser.js"

const findUser = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await getUser(userId)
        res.json(user)
        
    }
    catch(err) {
        res.status(401).json({error: err.message})
    }
}

export default findUser