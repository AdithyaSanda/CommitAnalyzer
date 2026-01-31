import React from 'react'
import { Navigate } from 'react-router-dom'
import axiosPrivate from './api/axiosPrivate'
import { useState } from 'react'
import { useEffect } from 'react'

const ProtectedRoute = ({children}) => {
  
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')

      if(token) {
        setAllowed(true)
        setLoading(false)
        return
      }

      try {
        const res = await axiosPrivate.post('/api/refresh', {}, {withCredentials: true})

        localStorage.setItem('token', res.data.token)
        setAllowed(true)
      }
      catch(err) {
        setAllowed(false)
      }
      finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if(loading) return <div className='text-white p-5'>Loading ...</div>

  if(!allowed) return <Navigate to="/login" replace/>

  return children
}

export default ProtectedRoute