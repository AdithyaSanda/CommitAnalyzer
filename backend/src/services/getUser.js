import User from '../models/User.js'

const getUser = async (userId)=> {
    const user = await User.findOne({userId})
    return user;
}

export default getUser