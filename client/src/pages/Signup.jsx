import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from "react-toastify";
import { Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight, Loader2, KeyRound, RotateCcw } from "lucide-react";
import { gsap } from "gsap";

function Signup() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".brand-panel", { xPercent: -100, duration: 1.4 })
        .from(".form-card", { scale: 0.9, opacity: 0, duration: 1.2 }, "-=1.0")
        .from(".stagger-field", { opacity: 0, y: 20, stagger: 0.1, duration: 0.8 }, "-=0.6");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  async function handleSendOTP(e) {
    if (e) e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return toast.warn("Please fill all fields");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setIsSubmitting(true);
    try {
      await API.post('/auth/send-otp', { email });
      
      gsap.to(".step-container", { 
        opacity: 0, 
        y: -10,
        duration: 0.3, 
        onComplete: () => {
          setStep(2);
          gsap.fromTo(".step-container", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
        } 
      });
      toast.info("Verification code sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyAndSignup(e) {
    e.preventDefault();
    if (!otp || otp.length < 6) return toast.warn("Please enter the full 6-digit code");

    setIsSubmitting(true);
    try {
      await API.post('/auth/signup', { name, email, password, otp });
      toast.success("Identity Verified. Welcome!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f8fafc] flex overflow-hidden selection:bg-indigo-600 selection:text-white">
      <div className="brand-panel hidden lg:flex lg:w-1/2 bg-[#020617] relative overflow-hidden flex-col justify-between p-16 xl:p-24">
        <div className="absolute inset-0 z-0">
          <div className="glow-blob absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="glow-blob absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" />
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
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">Live</span>
          </div>
          <h2 className="text-6xl xl:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-8">
            {step === 1 ? "Design" : "Verify"} <br /> your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">identity.</span>
          </h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50/50 overflow-y-auto no-scrollbar">
        <div className="lg:hidden flex items-center gap-3 mb-10 stagger-field">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center shadow-lg">
              <img src="/logo.svg" alt="Logo" className="w-6 h-6 invert" />
            </div>
            <span className="font-black tracking-tighter uppercase text-slate-900 text-lg">BlogVerse</span>
          </Link>
        </div>

        <div className="form-card w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="step-container">
            {step === 1 ? (
              <>
                <header className="mb-8 stagger-field">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Sign Up</h1>
                  <p className="text-slate-500 font-medium">Create your unique identity.</p>
                </header>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="stagger-field space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Full Name</label>
                    <input type="text" placeholder="Name" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-medium" onChange={(e) => setName(e.target.value)} />
                  </div>

                  <div className="stagger-field space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Email Address</label>
                    <input type="email" placeholder="example@gmail.com" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-medium" onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="stagger-field space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-medium" onChange={(e) => setPassword(e.target.value)} />
                      <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="stagger-field space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Confirm Password</label>
                    <input type="password" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-medium" onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>

                  <button disabled={isSubmitting} className="stagger-field w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 mt-4 active:scale-95 shadow-lg">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Request OTP <ArrowRight size={16} /></>}
                  </button>
                </form>
              </>
            ) : (
              <>
                <header className="mb-10 text-center">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <KeyRound size={32} />
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-3">Verify Email</h1>
                  <p className="text-slate-500 font-medium text-sm">Enter the code sent to <br/><span className="text-slate-900 font-bold">{email}</span></p>
                </header>

                <form onSubmit={handleVerifyAndSignup} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center block w-full">6-Digit Code</label>
                    <input 
                      type="text" 
                      maxLength="6"
                      autoFocus
                      placeholder="••••••" 
                      className="w-full bg-slate-50 border-2 border-dashed border-slate-200 px-6 py-5 rounded-2xl outline-none text-center text-3xl font-black tracking-[0.4em] focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-200"
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>

                  <button disabled={isSubmitting} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Complete"}
                  </button>

                  <div className="flex flex-col gap-4">
                    <button type="button" onClick={handleSendOTP} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800">
                      <RotateCcw size={12} /> Resend Code
                    </button>
                    <button type="button" onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
                      ← Edit Details
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          <footer className="mt-8 text-center border-t border-slate-50 pt-8 stagger-field">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
              Already verified? 
              <Link to="/login" className="text-indigo-600 ml-2 hover:text-indigo-700 transition-colors underline underline-offset-4 decoration-2">Sign In</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Signup;
