import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Navigate, useNavigate, Link } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const expiry = localStorage.getItem('tokenExpiry')
        if(token && Date.now() < expiry) {
            navigate('/dashboard', {replace: true})
        }
    }, [navigate])

    

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    



    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:5000/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            localStorage.setItem('token', response.data.token)
            localStorage.setItem('tokenExpiry', Date.now() + 48*60*60*1000)
            navigate('/dashboard')
        }
        catch(err) {
            console.error(err)
            alert("Invalid login credentials")
        }
        finally {
            setFormData({
                email:'',
                password:''
            })
        }
    }

    return (
        <div className='w-screen h-screen flex justify-center items-center'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-y-4 border border-green-300 rounded-md pt-9 p-15 pb-9'>
                <h1 className='text-3xl mb-3 text-green-300'>Login</h1>
                <label htmlFor="email" className='text-xl text-green-300'>Email</label>
                <input id='email' type="email" className='bg-neutral-800 w-100 px-3 p-1 py-3 border border-green-400 rounded focus: outline-green-600 mr-3' placeholder='example@mail.com' name='email' value={formData.email} onChange={handleInputChange}/>
                <label htmlFor="password" className='text-xl text-green-300'>Password</label>
                <input id='password' type="password" className='bg-neutral-800 w-100 px-3 p-1 py-3 border border-green-400 rounded focus: outline-green-600 mr-3' placeholder='Password' name='password' value={formData.password} onChange={handleInputChange}/>
                <button className='bg-green-600 w-100 border border-green-600 mt-5 px-3 py-3 rounded cursor-pointer' type='submit'>Login</button>
                <span className='mt-3 text-lg'>Not a user? <Link className='ml-2 text-green-400 underline' to={'/signup'}>Sign Up</Link></span>
            </form>      
        </div>
    )
}

export default Login