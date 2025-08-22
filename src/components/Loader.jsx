import React from 'react'

const Loader = () => {
  return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-rose-500 border-solid"></div>
      </div>
  )
}

export default Loader