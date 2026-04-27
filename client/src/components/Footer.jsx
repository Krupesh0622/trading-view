import React from 'react'

const Footer = () => {
  return (
    <div className="h-[40px] border-t border-gray-200 flex items-center px-4 space-x-2 text-sm text-gray-600 bg-gray-500/10">
        <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded font-bold cursor-pointer">
          1D
        </span>
        <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
          5D
        </span>
        <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
          1M
        </span>
        <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
          1Y
        </span>
        <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
          5Y
        </span>
        <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
          ALL
        </span>
        <div className="border-l h-4 mx-2"></div>
        <span className="cursor-pointer hover:text-black">
          15:30:45 (UTC+5:30)
        </span>
      </div>
  )
}

export default Footer