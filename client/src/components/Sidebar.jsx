import React from 'react'

const Sidebar = () => {
  return (
    <div className="w-[50px] border-r border-gray-200 flex flex-col items-center py-4 space-y-6 text-gray-500 bg-white z-10 bg-gray-500/10">
          <div className="hover:text-black cursor-pointer">✛</div>
          <div className="hover:text-black cursor-pointer">/</div>
          <div className="hover:text-black cursor-pointer">☰</div>
          <div className="hover:text-black cursor-pointer">T</div>
        </div>
  )
}

export default Sidebar