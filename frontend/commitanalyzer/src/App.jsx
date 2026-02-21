import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './ProtectedRoute'
import Home from './pages/Home'
import { useEffect } from 'react'

const App = () => {
  
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
      </Routes>
      
    </>
  )
}

export default App