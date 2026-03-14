import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Home, Users, Zap, UserCircle } from "lucide-react";
import gsap from "gsap";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(".mobile-link", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.2 }
      );
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-16 py-5 text-white z-[100] border-b border-white/5 bg-[#020617]">
      
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
          <img src="/logo.svg" alt="Logo" className="w-5 h-5" />
        </div>
        <h1 className="text-lg font-black tracking-tighter uppercase">
          Blog<span className="text-indigo-400">Verse</span>
        </h1>
      </Link>

      <div className="hidden md:flex items-center gap-10">
        <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Home</Link>
        <div className="h-4 w-px bg-slate-700 mx-2" />
        <Link to='/login' className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Login</Link>
        <Link to='/signup'>
          <button className="bg-white text-slate-950 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all flex items-center gap-2 group">
            Get Started <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>

      <button 
        className="md:hidden w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl active:scale-90 transition-transform" 
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </button>

      <div className={`fixed inset-0 z-[110] transition-all duration-500 ease-in-out ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
        
        <div 
          className="absolute inset-0 bg-[#020617]" 
          onClick={() => setIsOpen(false)} 
        />
        
        <div className={`absolute top-0 right-0 w-full h-full p-8 flex flex-col bg-[#020617] transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${isOpen ? "translate-y-0" : "-translate-y-full"}`}>
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <img src="/logo.svg" alt="Logo" className="w-4 h-4" />
              </div>
              <span className="font-black uppercase tracking-tighter">BlogVerse</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/10 rounded-full active:scale-90 transition-transform"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <MobileLink to="/" icon={<Home size={20}/>} label="Home" onClick={() => setIsOpen(false)} />
            <MobileLink to="/login" icon={<UserCircle size={20}/>} label="Login" onClick={() => setIsOpen(false)} />
          </div>

          <div className="mt-auto pb-8 mobile-link">
            <Link to='/signup' onClick={() => setIsOpen(false)}>
              <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3">
                Join Community <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileLink({ to, icon, label, onClick }) {
  return (
    <Link 
      to={to} 
      onClick={onClick} 
      className="mobile-link group flex items-center justify-between py-6 border-b border-white/5"
    >
      <div className="flex items-center gap-4">
        <div className="text-indigo-400">{icon}</div>
        <span className="text-2xl font-black uppercase tracking-tighter text-slate-200 group-active:text-white">{label}</span>
      </div>
      <ArrowRight size={20} className="text-slate-800" />
    </Link>
  );
}

export default Navbar;