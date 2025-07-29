import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn, useUser } from '@clerk/clerk-react'
import { assets } from '../assets/assets'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useUser()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SignIn />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white h-16 shadow z-50 flex items-center px-6 justify-between">
        <img
          src={assets.logo}
          alt="Logo"
          className="h-10 cursor-pointer"
          onClick={() => navigate('/')}
        />
        <div className="sm:hidden">
          {sidebarOpen ? (
            <X onClick={() => setSidebarOpen(false)} className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu onClick={() => setSidebarOpen(true)} className="w-6 h-6 text-gray-600" />
          )}
        </div>
      </nav>

      {/* Layout */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div
          className={`fixed top-16 left-0 z-40 h-full bg-white w-60 border-r border-gray-200 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 sm:static`}
        >
          <Sidebar sidebar={sidebarOpen} setSidebar={setSidebarOpen} />
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-[#F4F7FB] p-6 overflow-y-auto h-[calc(100vh-4rem)]">
  <Outlet />
</main>

      </div>
    </div>
  )
}

export default Layout
