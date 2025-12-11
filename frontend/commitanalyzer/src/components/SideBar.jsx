import axios from 'axios'
import React, { useEffect, useState } from 'react'

const SideBar = ({commit, open, owner, repo}) => {
  const [details, setDetails] = useState()
  const [summary, setSummmary] = useState()
  const [showContent, setShowContent] = useState(false)
  const sha = commit?.id

  useEffect(() => {

    if(!owner || !repo || !sha) return

    const getDetails = async () => {
      const res = await axios.post("http://localhost:5000/api/getGraphData", {owner, repo, sha})
      setDetails(res)
    }

    // const getSummary = async () => {
    //   const res = await axios.post("http://localhost:5000/api/getSummary", {owner, repo, sha})
    //   setSummmary(res)
    // }

    getDetails()
    // getSummary()

    
  }, [sha])

  useEffect(() => {
    if(open) {
      const timer = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(timer)
    }
    else {
      setShowContent(false)
    }

  }, [open])


  console.log(open)

  return (
    <div className={`bg-neutral-800 h-full flex absolute top-0 right-0  transition-all duration-500 ${open ? "w-96 " : "w-0 pointer-events-none"} flex-col overflow-auto`}>
      {showContent && <h1 className='text-2xl font-semibold ml-3 mt-3'>Commit Details</h1>}
      {showContent && details && <div className='ml-3.5 mt-4 flex-col space-y-3'>
          <p><span className='font-semibold'>SHA:</span> {details.data.sha.slice(-5)}</p>  
          <hr className='mr-3 border-neutral-600'/>
          <p><span className='font-semibold'>Date:</span> <span className='font-mono'>{details.data.commit.committer.date.slice(0,10)}</span></p>
          <hr className='mr-3 border-neutral-600'/>
          <p ><span className='font-semibold'>Time:</span> <span className='font-mono'>{details.data.commit.committer.date.slice(12,-4)}</span></p>
          <hr className='mr-3 border-neutral-600'/>
          <p><span className='font-semibold'>Author:</span> {details.data.commit.author.name}</p>
          <hr className='mr-3 border-neutral-600'/>
          <p className='font-semibold'>Changes</p>
          <p><span className='font-mono'>{details.data.files.length}</span> files changed </p>
          <p><span className='text-green-400 font-mono'>+{details.data.stats.additions}</span> <span className='ml-3 mr-3 text-red-500 font-mono'>-{details.data.stats.deletions}</span> <span className='text-sm'>lines changed</span></p>
          <hr className='mr-3 border-neutral-600'/>
          <p className='font-semibold'>Message</p>
          <p style={{whiteSpace: "pre-wrap"}}>{details.data.commit.message}</p>
          {summary && <div className='flex-col space-y-3'>
            <hr className='mr-3 border-neutral-600'/>
            <p className='font-semibold'>AI Summary</p>
            <p style={{whiteSpace: "pre-wrap"}}>{summary.data}</p>
          </div>}
      </div>}
    </div>
  )
}

export default SideBar