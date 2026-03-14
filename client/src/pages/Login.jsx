import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { gsap } from "gsap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      
      tl.from(".brand-panel", { xPercent: -100, duration: 1.4 })
        .from(".form-card", { scale: 0.9, opacity: 0, duration: 1.2 }, "-=1.0")
        .from(".stagger-field", { opacity: 0, y: 20, stagger: 0.1, duration: 0.8 }, "-=0.6");

      gsap.to(".glow-blob", {
        y: "random(-30, 30)",
        x: "random(-30, 30)",
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn("Email and Password are required");
      return;
    }
    setIsLoggingIn(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(`Welcome back, ${res.data.user.name}`);
      navigate('/home');
    } catch (err) {
      setIsLoggingIn(false);
      toast.error(err.response?.data?.message || "Invalid Email or Password");
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f8fafc] flex overflow-hidden selection:bg-indigo-600 selection:text-white">
      
      <div className="brand-panel hidden lg:flex lg:w-1/2 bg-[#020617] relative overflow-hidden flex-col justify-between p-16 xl:p-24">
        <div className="absolute inset-0 z-0">
          <div className="glow-blob absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="glow-blob absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>

        <Link to="/" className="relative z-10 flex items-center gap-3 w-fit group">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-6">
            <img src="/logo.svg" alt="Logo" className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-white uppercase tracking-tighter">BlogVerse</span>
        </Link>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8">
            <Sparkles size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">System Access Active</span>
          </div>
          <h2 className="text-6xl xl:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-8">
            Access <br /> the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Verse.</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium max-w-sm leading-relaxed border-l-2 border-indigo-500/30 pl-6">
            Reconnect with the global standard of technical storytelling.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
          <ShieldCheck size={16} /> Secure Authentication Layer
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 bg-slate-50/50">
        
        <div className="lg:hidden flex items-center gap-3 mb-12 stagger-field">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center">
              <img src="/logo.svg" alt="Logo" className="w-6 h-6 invert" />
            </div>
            <span className="font-black tracking-tighter uppercase text-slate-900 text-lg">BlogVerse</span>
          </Link>
        </div>

        <div className="form-card w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <header className="mb-10 stagger-field">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">Login</h1>
            <p className="text-slate-500 font-medium">Please enter your credentials.</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="stagger-field space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-medium"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="stagger-field space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Password</label>
                <Link 
                  to="/forgot-password" 
                  className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-medium"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              disabled={isLoggingIn}
              className="stagger-field w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-50"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <footer className="stagger-field mt-10 text-center border-t border-slate-50 pt-8">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
              Don't have an account? 
              <Link to="/signup" className="text-indigo-600 ml-2 hover:text-indigo-700 transition-colors underline underline-offset-4 decoration-2">Sign Up</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Login;