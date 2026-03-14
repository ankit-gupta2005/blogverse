import React, { useEffect, useRef } from 'react'
import Navbar from '../component/Navbar'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PenTool, Share2, Compass, Bookmark, MessageSquare, Settings } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger);

function Coverpage() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero-content > *", { y: 40, opacity: 0, stagger: 0.15, duration: 1.2 })
        .from(".device-stack", { scale: 0.9, opacity: 0, duration: 1.5 }, "-=0.8");

      gsap.from(".capability-card", {
        scrollTrigger: {
          trigger: ".capabilities-section",
          start: "top 80%",
        },
        x: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        clearProps: "all"
      });

      gsap.to(".floating-laptop", { y: -10, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".floating-mobile", { y: 10, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full bg-[#020617] text-white selection:bg-indigo-500 overflow-x-hidden" ref={containerRef}>
      <Navbar />

      <section className="hero-section relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-24 lg:pt-0">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full grid lg:grid-cols-2 gap-10 lg:gap-0 items-center">
          <div className="hero-content space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] mx-auto lg:mx-0">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              Live Network
            </div>
            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
              Blog<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Verse</span>
            </h1>
            <p className="text-sm md:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              A high-performance sanctuary for creators. Share your journey, connect with thinkers, and define your digital identity.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-5">
              <Link to='/login' className="px-10 py-4 md:py-5 bg-white text-slate-950 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-xl">
                Enter Network
              </Link>
            </div>
          </div>

          <div className="device-stack relative flex items-center justify-center lg:justify-end parallax-scroll pt-12 lg:pt-0">
            <div className="relative w-full max-w-[340px] sm:max-w-[450px] md:max-w-[550px]">
              <div className="device-laptop floating-laptop relative z-20 w-full aspect-[16/9] bg-slate-900 rounded-2xl md:rounded-3xl border border-white/10 p-2 md:p-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                <div className="w-full h-full bg-[#020617] rounded-xl md:rounded-2xl overflow-hidden border border-white/5">
                  <img src="/laptop.png" alt="Desktop" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="device-mobile floating-mobile absolute -right-4 -bottom-8 md:-right-8 md:-bottom-12 z-30 w-[32%] aspect-[9/19] bg-slate-950 rounded-[1.8rem] md:rounded-[2.8rem] border-[5px] md:border-[8px] border-slate-800 p-1 md:p-2 shadow-2xl ring-1 ring-white/10">
                <div className="w-full h-full bg-[#020617] rounded-[1.3rem] md:rounded-[2.2rem] overflow-hidden">
                  <img src="/mobile.png" alt="Mobile" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="capabilities-section py-24 md:py-32">
        <div className="px-6 md:px-12 lg:px-24 mb-12">
          <div className="text-center lg:text-left space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">The Experience</h2>
            <h3 className="text-3xl md:text-6xl font-black tracking-tighter uppercase">What can you do</h3>
          </div>
        </div>

        {/* Mobile Horizontal Scroll / Desktop Grid */}
        <div className="capabilities-grid flex overflow-x-auto lg:grid lg:grid-cols-3 gap-6 px-6 md:px-12 lg:px-24 pb-10 no-scrollbar snap-x snap-mandatory">
          <CapabilityCard icon={<PenTool size={22}/>} title="Craft Stories" desc="Write and publish technical articles with a clean interface." />
          <CapabilityCard icon={<Share2 size={22}/>} title="Build Network" desc="Follow your favorite creators and get instant updates." />
          <CapabilityCard icon={<Compass size={22}/>} title="Explore Trends" desc="Discover trending engineering topics through our engine." />
          <CapabilityCard icon={<Bookmark size={22}/>} title="Save for Later" desc="Curate your own personal library by saving blogs." />
          <CapabilityCard icon={<Settings size={22}/>} title="Design Identity" desc="Customize your profile with unique banners and avatars." />
          <CapabilityCard icon={<MessageSquare size={22}/>} title="Engage Discourse" desc="Interact with the community through meaningful feedback." />
        </div>
        
        {/* Mobile Swipe Indicator */}
        <div className="flex lg:hidden justify-center gap-2">
           <div className="w-8 h-1 bg-indigo-600 rounded-full" />
           <div className="w-2 h-1 bg-white/20 rounded-full" />
           <div className="w-2 h-1 bg-white/20 rounded-full" />
        </div>
      </section>

      <section className="py-24 bg-indigo-600 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-10 relative z-10">
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">Ready to transmit <br/> your knowledge?</h2>
          <p className="text-indigo-100 text-sm md:text-lg font-medium max-w-xl mx-auto"> Join the community today and start your journey into the next era of technical blogging. </p>
          <Link to='/signup' className="inline-block px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl"> Initialize Account </Link>
        </div>
      </section>

      <footer className="py-12 text-center border-t border-white/5">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em]"> © 2026 BlogVerse Systems. All Rights Reserved. </p>
      </footer>
    </div>
  )
}

function CapabilityCard({ icon, title, desc }) {
  return (
    <div className="capability-card group min-w-[85vw] sm:min-w-[300px] lg:min-w-full snap-center p-8 bg-slate-900/60 border border-white/5 rounded-[2.5rem] hover:bg-slate-900 transition-all duration-300">
      <div className="w-12 h-12 bg-white/5 text-indigo-400 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500"> {icon} </div>
      <h4 className="text-xl font-bold mb-3 tracking-tight">{title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

export default Coverpage;