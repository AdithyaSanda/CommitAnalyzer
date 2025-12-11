import History from "../models/History.js"

function createHistory(repoData) {
    const {userId, repoUrl, nodes, edges} = repoData

    const createdHistory = new History({
        userId,
        repoUrl,
        nodes,
        edges,
        createdAt: new Date()
    })

    const savedHistory = createdHistory.save()
    return savedHistory
}

export const getHistory = async (userId) => {
    const history = await History.find({userId}).sort({createdAt: -1}).select("-nodes -edges")
    return history
}

export const getRepo = async (id) => {
    const repo = await History.findById(id)
    return repo
}

export default createHistory