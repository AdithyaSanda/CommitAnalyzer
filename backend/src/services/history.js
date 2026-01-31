import History from "../models/History.js"

function createHistory(repoData, userId) {
    const {repoUrl, nodes, edges} = repoData

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

export const deleteHistory = async (id) => {
    await History.deleteOne({_id: id})
    return
}

export default createHistory