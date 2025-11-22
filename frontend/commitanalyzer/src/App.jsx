import React from 'react'
import { useState } from 'react'
import axios from "axios"
import Tree from './Tree'

const App = () => {


  const [url, setUrl] = useState("")
  const [res, setRes] = useState("")
  const [repo, setRepo] = useState("")
  const [owner, setOwner] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const Url = new URL(url)
    const pathParts = Url.pathname.split("/")
    const owner = pathParts[1]
    const repo = (pathParts[2])

    setOwner(owner)
    setRepo(repo)

    // try {
    //   const response = await axios.post("http://localhost:5000/api/ge", {owner,repo})
    //   // setRes(response.data.explanation.replace('/```json|```/g', '').trim())
    //   setRes(response.data)
    // }
    // catch(err) {
    //   console.error(err.message)
    //   throw err
    // }
      
  }

  return (
    <div className='relative w-full h-screen'>
      <Tree owner={owner} repo={repo}/>
        <form className='flex absolute top-15 mx-auto w-1/2 left-50 right-50' onSubmit={handleSubmit}>
          <div className='h-22 p-2 py-5 px-5 bg-white/10 backdrop-blur-2xl border border-white/20 
            shadow-[0_8px_32px_0_rgba(38,166,65,0.37)] 
            rounded-2xl '>
            {/* <label className='text-green-600 text-2xl pr-1' htmlFor="url">URL : </label> */}
            <input className='bg-neutral-800 w-150 p-2 py-3 rounded focus: outline-green-600 mr-3' autoComplete="off"  type="text" id='url' placeholder='https://github.com/username/repository' onChange={(e) => setUrl(e.target.value)} defaultValue='https://github.com/'/>
            <button className='bg-green-600 px-5 py-3 rounded ' type='submit'>Analyze</button>
            {/* {res && <p>{JSON.stringify(res, null, 2)}</p>}
            {res && <p>{res.explanation}</p>}
            {res && <p>{res.reason}</p>}
            {res && <p>{res.impact}</p>} */}
          </div>
          
        </form>
    </div>
    

  )
}

export default App