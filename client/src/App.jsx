import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import Drafts from './pages/Drafts'
import Layout from './component/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import BlogDetails from './component/BlogDetails'
import Signup from './pages/Signup'
import Coverpage from './pages/Coverpage'
import ProtectedRoute from './component/ProtectedRoute'
import CreateBlog from './component/CreateBlog'
import EditBlog from './component/EditBlog'
import Profile from './pages/Profile'
import SavedBlogs from './pages/SavedBlogs'
import { getProfile } from './services/api'
import Settings from './pages/Settings'
import ForgotPassword from './pages/ForgotPassword'

function App() {
  useEffect(() => {
    const syncSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await getProfile();
          localStorage.setItem("user", JSON.stringify(res.data));
        } catch (err) {
          console.error("Session sync failed");
          console.log(err)
        }
      }
    };
    syncSession();
  }, []);

  return (
    <>
      <ToastContainer 
        className="app-toast-container" 
        position="bottom-center" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Coverpage />} />
        <Route path="/home" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
        <Route path="/blog/:id" element={<Layout><BlogDetails /></Layout>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/profile/:id" element={<Layout><Profile /></Layout>} />
        <Route path="/bookmarks" element={<ProtectedRoute><Layout><SavedBlogs /></Layout></ProtectedRoute>} />
        <Route path="/drafts" element={<ProtectedRoute><Layout><Drafts /></Layout></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><Layout><CreateBlog /></Layout></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><Layout><EditBlog /></Layout></ProtectedRoute>} />
        <Route path='/settings' element={<ProtectedRoute><Layout><Settings/></Layout></ProtectedRoute>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>
    </>
  )
}

export default App;