import React from 'react'
import { useState, useCallback } from 'react'
import Tree from '../Tree'
import { replace, useNavigate } from 'react-router-dom'



const Dashboard = () => {

    const [url, setUrl] = useState("")
    const [repo, setRepo] = useState("")
    const [owner, setOwner] = useState("")
    const [currOwner, setCurrOwner] = useState("")
    const [currRepo, setCurrRepo] = useState("")



    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!url) return

        const Url = new URL(url)
        const pathParts = Url.pathname.split("/")
        const owner = pathParts[1]
        const repo = (pathParts[2])

        setOwner(owner)
        setRepo(repo)

        
    }

    

    return (
        <div className='relative w-full h-screen'>
            <Tree owner={owner} repo={repo} url={url} updateUrl={setUrl}/>
            <form className='flex absolute top-15 mx-auto w-1/2 left-50 right-50' onSubmit={handleSubmit}>
                <div className='h-22 p-2 py-5 px-5 bg-white/10 backdrop-blur-2xl border border-white/20 
                    shadow-[0_8px_32px_0_rgba(38,166,65,0.37)] 
                    rounded-2xl '>
                    <input className='bg-neutral-800 w-150 p-2 py-3 rounded focus: outline-green-600 mr-3' autoComplete="off"  type="text" id='url' placeholder='https://github.com/username/repository' onChange={(e) => setUrl(e.target.value)}  value={url ? url : 'https://github.com/'}/>
                    <button className='bg-green-600 px-5 py-3 rounded cursor-pointer' type='submit'>Analyze</button>
                    
                </div>
            </form>
        </div>
    )
}

export default Dashboard