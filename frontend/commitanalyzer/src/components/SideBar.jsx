import axios from 'axios'
import React, { useEffect, useState } from 'react'

const SideBar = ({open, owner, repo}) => {
  const [details, setDetails] = useState()
  const [summary, setSummmary] = useState()
  const sha = open.id

  useEffect(() => {
    const getDetails = async () => {
      const res = await axios.post("http://localhost:5000/api/getGraphData", {owner, repo, sha})
      setDetails(res)
    }

    const getSummary = async () => {
      const res = await axios.post("http://localhost:5000/api/getSummary", {owner, repo, sha})
      setSummmary(res)
    }

    getDetails()
    getSummary()

    
  }, [])

  console.log(details)


  return (
    <div className={`bg-neutral-800 w-1/4 h-full flex absolute top-0 right-0  transition-all duration-500 ease-out ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"} flex-col overflow-auto`}>
      <h1 className='text-2xl font-semibold ml-3 mt-3'>Commit Details</h1>
      {details && <div className='ml-3.5 mt-4 flex-col space-y-3'>
          <p><span className='font-semibold'>SHA:</span> {details.data.sha.slice(-5)}</p>  
          <hr className='mr-3 border-neutral-600'/>
          <p><span className='font-semibold'>Date:</span> {details.data.commit.committer.date.slice(0,10)}</p>
          <hr className='mr-3 border-neutral-600'/>
          <p><span className='font-semibold'>Time:</span> {details.data.commit.committer.date.slice(12,-4)}</p>
          <hr className='mr-3 border-neutral-600'/>
          <p><span className='font-semibold'>Author:</span> {details.data.commit.author.name}</p>
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