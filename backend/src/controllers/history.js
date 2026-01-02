import createHistory from "../services/history.js"
import { getHistory } from "../services/history.js"
import { getRepo, deleteHistory } from "../services/history.js"


async function addHistory(req, res) {
    try {
        const repoData = req.body
        const repo = await createHistory(repoData)
        res.status(200).json({repo: repo, message: "repo added successfully"})
    }
    catch(err) {
        res.status(401).json({error: err.message})
    }
}

export const getUserHistory = async (req, res) => {
    try {
        const userId = req.params.userId
        const history = await getHistory(userId)
        res.json(history)
    }
    catch(err) {
        res.status(401).json({error: err.message})
    }
}

export const getRepoDetails = async (req, res) => {
    try {
        const id = req.params.id
        const repo = await getRepo(id)
        res.status(200).json(repo)
    }
    catch(err) {
        res.status(401).json({error: err.message})
    }
}

export const deleteRepoDetails = async (req, res) => {
    try {
        const id = req.params.id
        await deleteHistory(id)
        res.status(200).json({msg: "Deleted Successfully"})
    }
    catch(err) {
        res.status(401).json({error: err.message})
    }
}


export default addHistory