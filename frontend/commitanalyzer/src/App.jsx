import React from 'react'
import { useState } from 'react'
import axios from "axios"

const App = () => {


  const [url, setUrl] = useState("")
  const [res, setRes] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const Url = new URL(url)
    const pathParts = Url.pathname.split("/")
    const owner = pathParts[1]
    const repo = (pathParts[2])

    try {
      const response = await axios.post("http://localhost:5000/api/test", {owner,repo})
      // setRes(response.data.explanation.replace('/```json|```/g', '').trim())
      setRes(response.data)
    }
    catch(err) {
      console.error(err.message)
      throw err
    }
      
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={(e) => setUrl(e.target.value)}/>
        <button type='submit'>Analyze</button>
        {res && <p>{JSON.stringify(res, null, 2)}</p>}
        {res && <p>{res.explanation}</p>}
        {res && <p>{res.reason}</p>}
        {res && <p>{res.impact}</p>}
      </form>
      
    </div>
  )
}

export default App