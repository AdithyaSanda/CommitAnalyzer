import { useEffect, useState } from 'react'
import Tree from '../Tree'
import { RefreshCw } from 'lucide-react';



const Dashboard = () => {

    const [url, setUrl] = useState("")
    const [repo, setRepo] = useState("")
    const [owner, setOwner] = useState("")
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [fromRefresh, setFromRefresh] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!url) return

        const Url = new URL(url)
        const pathParts = Url.pathname.split("/")
        const owner = pathParts[1]
        const repo = (pathParts[2])

        setOwner(owner)
        setRepo(repo)
        setFromRefresh(false)
    }


    return (
        <div className='relative w-full min-h-screen'>
            <Tree owner={owner} repo={repo} url={url} updateUrl={setUrl} page={page} setPage={setPage} setLoading={setLoading} fromRefresh={fromRefresh}/>
            <form className='flex absolute top-18 max-sm:left-1/2 max-sm:-translate-x-1/2 2xl:left-50 2xl:right-50 2xl:mx-auto 2xl:w-1/2' onSubmit={handleSubmit}>
                <div className='h-22 py-5 pl-7 max-sm:w-90 2xl:w-190 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(38,166,65,0.37)] rounded-2xl '>
                    <input className='bg-neutral-800 max-sm:w-50 2xl:w-150 p-2 py-3 rounded focus: outline-green-600 mr-3' autoComplete="off"  type="text" id='url' placeholder='https://github.com/username/repository' onChange={(e) => setUrl(e.target.value)}  value={url ? url : 'https://github.com/'}/>
                    <button className={`bg-green-600 px-4 py-3 rounded ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`} type='submit' disabled={loading}>{loading ? 'Analyzing...' : 'Analyze'}</button>
                    
                </div>
            </form>
            <div className='hidden 2xl:h-22 2xl:w-50 2xl:p-2 2xl:pl-5 2xl:flex 2xl:items-center 2xl: bg-white/10 2xl:backdrop-blur-2xl 2xl:border 2xl: border-white/20 2xl:shadow-[0_8px_32px_0_rgba(38,166,65,0.37)] 2xl:rounded-2xl 2xl:absolute 2xl:top-18 2xl:right-40'>
                <RefreshCw className={`mr-5 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={(e) => {handleSubmit(e)
                setFromRefresh(true)}} disabled={loading}/>
                <button className={`bg-green-600 px-4 py-3 rounded ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => {setPage(prev => prev+1)}}disabled={loading}>{loading ? 'Loading...' : 'Load More'}</button>
            </div>
            
        </div>
    )
}

export default Dashboard