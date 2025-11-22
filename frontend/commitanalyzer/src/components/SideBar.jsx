import React from 'react'

const SideBar = ({open}) => {
  return (
    <div className={`bg-neutral-800 w-1/4 h-full flex absolute top-0 right-0  transition-all duration-500 ease-out ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>

    </div>
  )
}

export default SideBar