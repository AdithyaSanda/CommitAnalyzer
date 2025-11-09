import axios from "axios"
import dotenv from "dotenv"

dotenv.config()
export async function fetchCommit(owner, repo, perPage=5) {
    try {
        const res = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${perPage}`,
            {headers: {Authorization : `token ${process.env.GITHUB_API_KEY}`}}
        )
        return res.data
    }
    catch(err) {
        console.error("GITHUB API error: ", err.message)
        throw err
    }
}

export async function fetchCommitDiff(owner, repo, sha) {
    try {
        const res = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,
            {headers: 
                {
                    Authorization: `token ${process.env.GITHUB_API_KEY}`,
                    Accept: "application/vnd.github.v3.diff"
                },
            }
        )

        // const diffs = res.data.files
        //     .filter(f => f.patch)
        //     .map(f => `--- ${f.filename}\n+++ ${f.filename}\n${f.patch}`)
        //     .join("\n");

        return res.data
    }
    catch(err) {
        console.error("GITHUB API error: ", err.message)
        throw err
    }
}