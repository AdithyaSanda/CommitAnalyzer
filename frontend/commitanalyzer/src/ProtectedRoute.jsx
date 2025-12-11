import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
  const token = localStorage.getItem('token')
  const expiry = localStorage.getItem('tokenExpiry')
  
  if(!token || !expiry || Date.now() > expiry) {
    localStorage.removeItem('token')
    localStorage.removeItem('tokenExpiry')
    return <Navigate to='/login' replace/>
  }

  return children
}

export default ProtectedRoute