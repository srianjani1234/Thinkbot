import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar' 
import {SignIn, useUser } from '@clerk/clerk-react'
import { assets } from '../assets/assets'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const {user} = useUser()

  return user ? (
    <div className='flex flex-col h-screen'>
      {/* Navbar */}
      <nav className='fixed top-0 left-0 right-0 bg-white h-16 shadow z-50 flex items-center px-6'>
        <img src={assets.logo} alt="Logo" className='h-10 cursor-pointer' onClick={() => navigate('/')}/>
        {sidebar ? (
          <X onClick={() => setSidebar(false)} className='w-6 h-6 sm:hidden text-gray-600' />
        ) : (
          <Menu onClick={() => setSidebar(true)} className='w-6 h-6 sm:hidden text-gray-600' />
        )}
      </nav>

      {/* Main Content */}
      <div className='flex flex-1'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <main className='flex-1 bg-[#F4F7FB] p-6 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  ) :(
    <div className='flex items-center justify-center h-screen'>
      <SignIn/>
    </div>
  )
}

export default Layout
