import React, { useState } from 'react'
import axios from "axios"
import { useNavigate, Link } from 'react-router-dom'

const Signup = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate()

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
            const response = await axios.post("http://localhost:5000/user/register",formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            navigate('/login')
        }
        catch(err) {
            console.error(err.message)
        }
        finally {
            setFormData({
                name: '',
                email: '',
                password: ''
            })
        }
    }

    return (
        <div className='w-screen h-screen flex justify-center items-center'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-y-4 border border-green-300 rounded-md pt-9 p-15 pb-9'>
                <h1 className='text-3xl mb-3 text-green-300'>Sign Up</h1>
                <label htmlFor="name" className='text-xl text-green-300'>Name</label>
                <input className='bg-neutral-800 w-100 px-3 p-1 py-3 border border-green-400 rounded focus: outline-green-600 mr-3' type="text" placeholder='John Doe' name='name' id='name' value={formData.name} onChange={handleInputChange}/>
                <label htmlFor="email" className='text-xl text-green-300'>Email</label>
                <input id='email' className='bg-neutral-800 w-100 px-3 p-1 py-3 border border-green-400 rounded focus: outline-green-600 mr-3' type="email" placeholder='example@mail.com' name='email' value={formData.email} onChange={handleInputChange}/>
                <label htmlFor="password" className='text-xl text-green-300'>Password</label>
                <input id='password' className='bg-neutral-800 w-100 px-3 p-1 py-3 border border-green-400 rounded focus: outline-green-600 mr-3' type="password" placeholder='Password' name='password' value={formData.password} onChange={handleInputChange}/>
                <button className='bg-green-600 w-100 border border-green-600 mt-5 px-3 py-3 rounded cursor-pointer' type='submit'>Sign Up</button>
                <span className='mt-3 text-lg'>Already a user? <Link className='ml-2 text-green-400 underline' to={'/login'}>Login</Link></span>
            </form>
        </div>
    )
}

export default Signup