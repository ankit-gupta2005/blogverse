import React, { useState, useEffect, useRef } from "react";
import { createBlog } from "../services/api";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ImagePlus, Send, Sparkles, Globe, Eye, Trash2, ArrowLeft, Loader2 } from "lucide-react";

function CreateBlog() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);

  const [isShipping, setIsShipping] = useState(false);
  const [localToast, setLocalToast] = useState({ visible: false, text: "", type: "success" });
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPublished: false,
  });

  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(headerRef.current, 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 1, ease: "expo.out" }
    )
    .fromTo(canvasRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
      "-=0.6"
    )
    .fromTo(footerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "back.out(1.7)" },
      "-=0.8"
    );
  }, []);

  const handleCoverFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setLocalToast({ visible: true, text: "Title and Content are required", type: "error" });
      return;
    }
    setIsShipping(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("content", formData.content);
      payload.append("isPublished", formData.isPublished); 
      if (selectedCoverFile) payload.append("coverImage", selectedCoverFile);

      await createBlog(payload);
      setLocalToast({ visible: true, text: formData.isPublished ? "Broadcast successful" : "Saved to drafts", type: "success" });
      setTimeout(() => navigate(formData.isPublished ? "/home" : "/drafts"), 1500);
    } catch (err) {
      setIsShipping(false);
      console.log(err)
      setLocalToast({ visible: true, text: "Sync Error", type: "error" });
      setTimeout(() => setLocalToast({ visible: false, text: "", type: "error" }), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 pb-48">
      {localToast.visible && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3">
          <Sparkles size={12} className="text-indigo-400" /> {localToast.text}
        </div>
      )}

      <header ref={headerRef} className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-700">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-[9px] font-black text-slate-800 uppercase tracking-tighter border border-slate-200">
            <Globe size={12} /> {formData.isPublished ? "Public" : "Draft"}
          </div>
        </div>
      </header>

      <main ref={canvasRef} className="max-w-3xl mx-auto mt-16 px-6">
        <section className="mb-12 group">
          {coverPreview ? (
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img src={coverPreview} className="w-full h-full object-cover" alt="Cover" />
              <button 
                onClick={() => { setSelectedCoverFile(null); setCoverPreview(""); }} 
                className="absolute top-4 right-4 p-3 bg-white shadow-xl rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 border border-slate-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center aspect-[21/9] border-2 border-dashed border-slate-300 rounded-3xl cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all group/label">
              <div className="p-4 bg-white shadow-lg rounded-2xl mb-4 border border-slate-200">
                <ImagePlus size={24} className="text-slate-600" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Add Artwork</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverFile} />
            </label>
          )}
        </section>

        <textarea
          rows="1"
          placeholder="New Story Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full text-5xl md:text-6xl font-black text-slate-900 placeholder:text-slate-200 outline-none resize-none mb-8 leading-[1.1] tracking-tighter"
        />

        <div className="flex items-center gap-6 mb-12 py-4 border-y border-slate-200">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="publish"
              checked={formData.isPublished} 
              onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
              className="w-4 h-4 rounded border-slate-400 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="publish" className="text-[11px] font-black uppercase tracking-widest text-slate-800 cursor-pointer">Live Broadcast</label>
          </div>
          <div className="h-4 w-[1px] bg-slate-300" />
          <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600">
            <Eye size={14} /> Preview
          </button>
        </div>

        <textarea
          placeholder="Start writing..."
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          className="w-full min-h-[500px] text-xl md:text-2xl font-medium text-slate-800 placeholder:text-slate-200 outline-none resize-none leading-relaxed"
        />
      </main>

      <footer 
        ref={footerRef}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-white border border-slate-200 rounded-[2.5rem] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] z-[200] flex items-center justify-between"
      >
        <div className="flex items-center gap-6 pl-6">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${formData.content.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-tight text-slate-900">
                {formData.content.split(/\s+/).filter(x => x).length} Words
              </span>
              <span className="text-[8px] font-bold uppercase text-slate-400 tracking-tighter">Autosaved</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isShipping}
          className="flex items-center gap-3 bg-indigo-600 text-white pl-8 pr-6 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50"
        >
          {isShipping ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <> {formData.isPublished ? "Ship Story" : "Save Draft"} <div className="p-1.5 bg-white/20 rounded-full"><Send size={14} /></div></>
          )}
        </button>
      </footer>
    </div>
  );
}

export default CreateBlog;