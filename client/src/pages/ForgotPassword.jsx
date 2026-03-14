import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from "react-toastify";
import { ArrowRight, Loader2, KeyRound, Lock, RotateCcw } from "lucide-react";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    if (e) e.preventDefault();
    if (!email) return toast.warn("Enter your email");
    
    setIsSubmitting(true);
    try {
      await API.post('/auth/send-reset-otp', { email });
      setStep(2);
      toast.info("Reset code sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "User not found");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async (e) => {
    if (e) e.preventDefault();
    if (!otp || !newPassword) return toast.warn("Fill all fields");
    
    setIsSubmitting(true);
    try {
      await API.post('/auth/reset-password', { email, otp, newPassword });
      toast.success("Identity Verified. Password Updated.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 selection:bg-indigo-600 selection:text-white">
      
      <div className="flex items-center gap-3 mb-10 lg:hidden">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center">
            <img src="/logo.svg" alt="Logo" className="w-6 h-6 invert" />
          </div>
          <span className="font-black tracking-tighter uppercase text-slate-900 text-lg">BlogVerse</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <header className="text-center space-y-2 mb-8">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock size={32} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Forgot Password?</h1>
              <p className="text-slate-500 text-sm font-medium">No worries. We'll send you reset instructions.</p>
            </header>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="example@gmail.com"
                className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-medium" 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>

            <button disabled={isSubmitting} className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Request Code <ArrowRight size={16}/></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <header className="text-center space-y-2 mb-8">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <KeyRound size={32} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Reset Identity</h1>
              <p className="text-slate-500 text-sm font-medium">Verification code sent to <br/><span className="text-slate-900 font-bold">{email}</span></p>
            </header>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">6-Digit Code</label>
                <input 
                  type="text" 
                  maxLength="6"
                  placeholder="••••••"
                  className="w-full bg-slate-50 border-2 border-dashed border-slate-200 px-6 py-4 rounded-2xl text-center text-2xl font-black tracking-[0.5em] focus:border-indigo-600 focus:bg-white transition-all" 
                  onChange={(e) => setOtp(e.target.value)} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">New Password</label>
                <input 
                  type="password" 
                  className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all" 
                  onChange={(e) => setNewPassword(e.target.value)} 
                />
              </div>
            </div>

            <button disabled={isSubmitting} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 active:scale-95">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Reset"}
            </button>

            <div className="flex flex-col gap-3 pt-2">
              <button type="button" onClick={handleRequestOTP} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                <RotateCcw size={12} /> Resend Code
              </button>
              <button type="button" onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                ← Edit Email
              </button>
            </div>
          </form>
        )}

        <footer className="mt-8 text-center border-t border-slate-50 pt-8">
          <Link to="/login" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
            Back to System Login
          </Link>
        </footer>
      </div>
    </div>
  );
}

export default ForgotPassword;