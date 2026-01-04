import { useEffect, useState } from 'react'
import Tree from '../Tree'
import { RefreshCw } from 'lucide-react';



const Dashboard = () => {

    const [url, setUrl] = useState("")
    const [repo, setRepo] = useState("")
    const [owner, setOwner] = useState("")
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)



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
            <Tree owner={owner} repo={repo} url={url} updateUrl={setUrl} page={page} setPage={setPage} setLoading={setLoading}/>
            <form className='flex absolute top-15 mx-auto w-1/2 left-50 right-50' onSubmit={handleSubmit}>
                <div className='h-22 p-2 py-5 px-5 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(38,166,65,0.37)] rounded-2xl '>
                    <input className='bg-neutral-800 w-150 p-2 py-3 rounded focus: outline-green-600 mr-3' autoComplete="off"  type="text" id='url' placeholder='https://github.com/username/repository' onChange={(e) => setUrl(e.target.value)}  value={url ? url : 'https://github.com/'}/>
                    <button className={`bg-green-600 px-4 py-3 rounded ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`} type='submit' disabled={loading}>{loading ? 'Analyzing...' : 'Analyze'}</button>
                    
                </div>
            </form>
            <div className='h-22 w-50 p-2 pl-5 flex items-center bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(38,166,65,0.37)] rounded-2xl absolute top-15 right-40'>
                <RefreshCw className={`mr-5 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={(e) => {handleSubmit(e)}} disabled={loading}/>
                <button className={`bg-green-600 px-4 py-3 rounded ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => {setPage(prev => prev+1)}}disabled={loading}>{loading ? 'Loading...' : 'Load More'}</button>
            </div>
            
        </div>
    )
}

export default Dashboard