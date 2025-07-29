import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import { Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users }
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user, isLoaded } = useUser()
  const { signOut, openUserProfile } = useClerk()

  if (!isLoaded || !user) return null

  return (
    <div className="fixed top-14 mt-3 left-0 w-60 h-[calc(100vh-56px)] bg-white border-r border-gray-200 z-40">
      
      <div className='my-7 w-full'>
        <img src={user.imageUrl} alt="user avatar" className='w-13 rounded-full mx-auto' />
        <h1 className='mt-1 text-center'>{user.fullName}</h1>

        <div className='mt-6 flex flex-col gap-2 px-4'>
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded transition 
                ${isActive ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white' : 'text-gray-700 hover:bg-gray-100'}`
              }>
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* 👇 Moved this up from the bottom and styled consistently */}
      <div className='w-full mt-12 border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
        <div onClick={openUserProfile} className='flex gap-2 items-center cursor-pointer'>
          <img src={user.imageUrl} alt="" className='w-8 rounded-full' />
          <div>
            <h1 className='text-sm font-medium'>{user.fullName}</h1>
            <p className='text-xs text-gray-500'>
              <Protect plan='premium' fallback="Free">Premium</Protect> Plan
            </p>
          </div>
        </div>
        <LogOut onClick={signOut} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer' />
      </div>
    </div>
  )
}

export default Sidebar
