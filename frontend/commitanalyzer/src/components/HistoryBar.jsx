import React, { useContext, useEffect, useState } from 'react'
import { GitGraph, PanelLeft, Trash2 } from "lucide-react";
import axiosPrivate from '../api/axiosPrivate';
import {jwtDecode} from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import HistoryContext from '../HistroryContext';



const HistoryBar = ({onSend, setSideBarOpen, setHistoryOpen, historyOpen}) => {

    const token = localStorage.getItem('token')
    const user = jwtDecode(token)
    const userId = user.id

    const navigate = useNavigate()
    const {history, setHistory} = useContext(HistoryContext)

    const [userName, setUserName] = useState()
    const [small, setSmall] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [showContent, setShowContent] = useState(false)
    const [deleteHovered, setDeleteHovered] = useState(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if(!small) {
            const timer = setTimeout(() => setShowContent(true), 300)
            return () => clearTimeout(timer)
        }
        else {
            setShowContent(false)
        }
    }, [small])

    useEffect(() => {

        if(!userId) return
        async function getHistory() {
            const response = await axiosPrivate.get(`/api/history/getHistory/${userId}`)
            console.log(response)
            const repoArr = response.data.map((repo) => {
                const url = new URL(repo.repoUrl)
                const pathParts = url.pathname.split('/')
                return {id: repo._id, url: pathParts[1] + '/' + pathParts[2]}
            })
            
            setHistory(repoArr)
        }

        async function getUser() {
            const user = await axiosPrivate.get(`/api/users/getUser/${userId}`)
            setUserName(user.data.name)
        }

        getHistory()
        getUser()
    }, [])

    const send = (id) => {  
        onSend(id)
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate('/login', {replace: true})
    }

    const deleteRepo = async (e, id) => {
        e.stopPropagation()
        await axiosPrivate.delete(`/api/history/item/${id}`)
        setHistory(prev => prev.filter(item => item.id !== id));
    }    

    
    return (
        <>
            <div className='absolute top-4 ml-6 p-2 bg-white/30 rounded-2xl cursor-e-resize lg:hidden 2xl:hidden xl:hidden' onClick={() => {
                setOpen(prev => !prev)
                setHistoryOpen(true)
                setSmall(false)
                setShowContent(true)
            }}>
                <PanelLeft className=' w-5 h-5 text-neutral-400 '/>
            </div>
            
            <div className={`${historyOpen ? 'block' : 'hidden'} z-10 2xl:block lg:block xl:block h-screen bg-white/10 backdrop-blur-3xl border-r border-white/20 absolute top-0 overflow-y-auto transition-all duration-300 pb-4 ${small ? 'w-16' : 'w-66' }`}>

                {small ? (
                    !hovered ? (
                        <GitGraph className="h-6 w-6 text-green-500 absolute top-6 ml-4.5 cursor-pointer" onMouseEnter={() => {setHovered(true)}} onClick={() => send('clear')}/>
                    ) : (
                        <PanelLeft className='absolute top-6 ml-4.5 text-neutral-400 cursor-e-resize' onMouseLeave={() => {setHovered(false)}} onClick={() => {
                            setSmall((prev) => !prev)
                            setOpen(false)
                            setHistoryOpen(false)
                        }}/>
                    )
                ) : (
                    <>
                        <GitGraph className="h-6 w-6 text-green-500 absolute top-6 ml-4.5 cursor-pointer"  onClick={() => send('clear')}/>
                        <PanelLeft className='absolute top-6 right-3 text-neutral-400 cursor-e-resize' onClick={() =>{ setSmall((prev) => !prev)
                            setHovered(false)
                            setOpen(false)
                            setHistoryOpen(false)
                        }}/>
                    </>
                    
                )}

    
                <p className='ml-5 gap-x-2 absolute top-22 flex cursor-pointer' onClick={() => {send('clear')}}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>{showContent &&  'New Analysis'}</p>
                {showContent && <div className={`mt-34`}>
                    <p className='ml-5 mb-2 text-md text-zinc-400'>Your analyzes</p>
                    {history.map((repo, index) => (
                        <div 
                            key={index} 
                            className='overflow-x-hidden relative ml-1' 
                            onClick={() => {
                                send(repo.id)
                                setSideBarOpen(false)
                                setHistoryOpen(false)
                                setOpen(false)
                            }}  
                            onMouseEnter={() => {
                                setDeleteHovered(index)
                            }} 
                            onMouseLeave={() => {
                                setDeleteHovered(null)
                            }}>
                            <p className={` text-sm cursor-pointer ${deleteHovered === index ? 'bg-white/15 ml-2 mr-2 pl-2 mt-1 mb-1 pt-2 pb-2 rounded-md' : 'ml-4 mt-3 mb-3'}`}>{repo.url} {deleteHovered === index && <Trash2 className='h-4 w-4 absolute top-3.5 right-4 inline-block text-red-400 cursor-pointer' onClick={(e) => {deleteRepo(e, repo.id)
                                send('clear')
                            }}/>}</p>
                        </div>
                    ))}
                </div>}
            </div>
            <div className={` ${historyOpen ? 'max-sm:block sm:block md:block lg:block xl:block 2xl:block' : 'max-sm:hidden sm:hidden md:hidden lg:block xl:block 2xl:block'}  fixed h-12 z-10  bg-white/0 backdrop-blur-3xl border-t border-r border-white/20  2xl:absolute bottom-0 transition-all duration-300 ${small ? 'w-16' : 'w-66 border-t border-neutral-500'}`}>
                    {userName && <img src={`https://placehold.co/30?text=${userName.slice(0,1).toUpperCase()}`} alt="" className='rounded-3xl ml-4 mt-2'/>}
                    {!small && <p className='ml-5 text-sm absolute top-3 left-10 font-semibold'>{userName}</p>}
                    {!small && <button className='text-sm bg-green-500/10 border border-green-600 p-1.5 px-3 rounded-2xl absolute right-5 top-2 text-green-600 cursor-pointer' onClick={handleLogout}>Logout</button>}
            </div>
        </>
        
    )
}

export default HistoryBar

