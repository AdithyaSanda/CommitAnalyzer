import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'

const SideBar = ({commit, open}) => {
  const [details, setDetails] = useState()
  const [summary, setSummary] = useState("")
  const [showContent, setShowContent] = useState(false)
  const [loading, setLoading] = useState(false)
  const sha = commit?.id
  const owner = commit?.data.owner
  const repo = commit?.data.repo
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [summary])

  useEffect(() => {

    if(!owner || !repo || !sha) return 

    const getDetails = async () => {
      const res = await axios.post("/api/getGraphData", {owner, repo, sha})
      setDetails(res)
    }

    const getSummary = async () => {
        setSummary("")
        setLoading(true)

        try {
          
          const res = await fetch("/api/commit/summary", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({owner, repo, sha})
        })

        let hasReceivedFirstChunk = false
        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        while(true) {
          const {value, done} = await reader.read()
          if(done) break;

          if(!hasReceivedFirstChunk) {
            setLoading(false)
            hasReceivedFirstChunk = true
          }

          const chunk = decoder.decode(value, {stream: true})
          const lines = chunk.split("\n")
          for(const line of lines) {
            
            if(!line.startsWith("data: "))  continue

            const text = line.slice(6)
            if(text == "[DONE]") {
              return
            }

            try {
              const parsed = JSON.parse(text)
              setSummary(prev => prev + parsed.content)  
            }
            catch(err) {
              console.log("JSON Parse Error on chunk:", text)
            }
    
            
          }

        }
      }
      catch(err) {
        console.log("Stream err: ", err)
      }
      

      
    }

    getDetails()
    getSummary()
    
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



  return (
    <div className={`bg-white/10 backdrop-blur-3xl border-l border-white/20 h-full flex absolute top-0 right-0 z-10  transition-all duration-500 ${open ? "w-84 2xl:w-96" : "w-0 pointer-events-none"} flex-col overflow-auto`}>
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
          {<div className='flex-col space-y-3'>
            <hr className='mr-3 border-neutral-600'/>
            <p className='font-semibold'>AI Summary</p>
            {loading && <span className='w-4 h-4 bg-white rounded-full animate-[blink_0.8s_infinite_both] inline-block'/>}
            <article className="
              prose max-w-full overflow-hidden
              [&_pre]:max-w-full
              [&_pre]:overflow-x-auto
              [&_pre]:whitespace-pre-wrap
              [&_code]:wrap-break-words
              [&_table]:block
              [&_table]:max-w-full
              [&_table]:overflow-x-auto
              [&_img]:max-w-full
              [&_img]:h-auto
            ">
              <ReactMarkdown remarkPlugins={[remarkBreaks]}>{summary}</ReactMarkdown>
            </article>
            <div ref={bottomRef}/>
          </div>}
      </div>}
    </div>
  )
}

export default SideBar