import React from 'react'
import HomeNav from '../pages/HomeNav'
import Sidebar from '../component/Sidebar'
import Rightbar from '../component/Rightbar'
import { BackToTop } from '../components/BackToTop'

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FCFCFD]">
      <HomeNav />

      <div className="flex-1 w-full max-w-full mx-auto flex justify-between relative ">
        <Sidebar />

        <main className="flex-1 w-full max-w-3xl min-h-screen bg-white md:border-x border-slate-100 shadow-[0_0_50px_-12px_rgba(0,0,0,0.02)] overflow-x-hidden">
          {children}
        </main>

        <Rightbar />
      </div>

      <BackToTop />
    </div>
  )
}

export default Layout