import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Search, Plus, LogOut, User as UserIcon, Menu, X, Settings, LayoutGrid, ChevronDown } from "lucide-react";
import { gsap } from "gsap";

function HomeNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navRef = useRef(null);
  const profileMenuRef = useRef(null);

  const isFeedPage = location.pathname === "/home";

  function Logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  useEffect(() => {
    if (mobileOpen || profileOpen) {
      const timeout = setTimeout(() => {
        setMobileOpen(false);
        setProfileOpen(false);
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (profileOpen && profileMenuRef.current) {
      gsap.fromTo(profileMenuRef.current, 
        { y: 10, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "expo.out" }
      );
    }
  }, [profileOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        setSearchParams({ search: searchTerm });
      } else {
        const params = new URLSearchParams(searchParams);
        params.delete("search");
        setSearchParams(params);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setSearchParams]);

  useEffect(() => {
    function handleOutside(e) {
      if (profileOpen && !profileMenuRef.current?.contains(e.target)) {
        setProfileOpen(false);
      }
      if (mobileOpen && !menuRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [mobileOpen, profileOpen]);

  return (
    <nav ref={navRef} className="sticky top-0 left-0 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 z-[200] shadow-sm selection:bg-indigo-100">
      <div className="w-full px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate("/home")}>
            <div className="w-11 h-11 bg-white header rounded-2xl flex items-center justify-center border border-slate-100 shadow-xl shadow-indigo-100 group-hover:rotate-6 group-hover:scale-105 transition-all duration-500 overflow-hidden">
              <img src="/logo.svg" alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <h1 className="text-xl header font-black text-slate-900 tracking-tighter uppercase text-nowrap">
              Blog<span className="text-indigo-600">Verse</span>
            </h1>
          </div>

          <div className="hidden sm:flex flex-1 max-w-sm mx-8">
             <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="search" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium outline-none focus:bg-white focus:border-indigo-200 transition-all" 
                placeholder="Explore stories..." 
              />
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <button 
              onClick={() => navigate("/home")}
              className={`text-[11px] font-black uppercase tracking-widest transition-all ${location.pathname === '/home' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Feed
            </button>

            <button 
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100" 
              onClick={() => navigate("/create")}
            >
              <Plus size={16} strokeWidth={3} className="inline mr-2" /> Create
            </button>

            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 group p-1 rounded-full hover:bg-slate-50 transition-all"
              >
                <img 
                  src={user.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                  className="w-10 h-10 rounded-full aspect-square object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all" 
                  alt="profile"
                />
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div 
                  ref={profileMenuRef}
                  className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-[2rem] shadow-2xl shadow-indigo-100/50 p-2 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-50 mb-2">
                    <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tighter">{user.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate tracking-wide">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all text-[11px] font-bold uppercase tracking-widest"
                  >
                    <UserIcon size={16} /> My Profile
                  </button>
                  <button 
                    onClick={() => navigate('/settings')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all text-[11px] font-bold uppercase tracking-widest"
                  >
                    <Settings size={16} /> Settings
                  </button>
                  <div className="h-px bg-slate-50 my-2 mx-2" />
                  <button 
                    onClick={Logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            ref={buttonRef}
            className="sm:hidden p-2.5 bg-slate-50 rounded-xl text-slate-600 active:scale-90 transition-transform"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div ref={menuRef} className="sm:hidden border-t border-slate-100 bg-white overflow-hidden">
          <div className="p-6 space-y-6">
            {isFeedPage && (
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="search" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium" 
                  placeholder="Search stories..." 
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => navigate("/home")} className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all active:scale-95 ${location.pathname === '/home' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600'}`}>
                <LayoutGrid size={22} className="mb-2" />
                <span className="text-[9px] font-black uppercase">Feed</span>
              </button>
              <button onClick={() => navigate("/create")} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-3xl text-slate-600 active:scale-95 transition-all">
                <Plus size={22} className="mb-2" />
                <span className="text-[9px] font-black uppercase">Create</span>
              </button>
              <button onClick={() => navigate("/profile")} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-3xl text-slate-600 active:scale-95 transition-all">
                <UserIcon size={22} className="mb-2" />
                <span className="text-[9px] font-black uppercase">Profile</span>
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-[2.5rem]">
              <img src={user.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} className="w-12 h-12 rounded-full aspect-square object-cover" alt="user" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                <p className="text-xs font-medium text-slate-400 truncate">{user.email}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('/settings')} className="p-3 bg-white text-slate-400 hover:text-indigo-600 rounded-xl shadow-sm"><Settings size={18} /></button>
                <button onClick={Logout} className="p-3 bg-white text-red-500 rounded-xl shadow-sm active:bg-red-50"><LogOut size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default HomeNav;