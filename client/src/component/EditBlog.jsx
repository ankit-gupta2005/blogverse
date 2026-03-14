import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { singleBlog, updateBlog } from "../services/api";
import { gsap } from "gsap";
import { ImagePlus, Save, Sparkles, Globe, Eye, Trash2, ArrowLeft, Loader2 } from "lucide-react";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const titleRef = useRef(null);

  const [formData, setFormData] = useState({ title: "", content: "", isPublished: false });
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [localToast, setLocalToast] = useState({ visible: false, text: "", type: "success" });

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [formData.title]);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await singleBlog(id);
        const blog = res.data;
        
        setFormData({
          title: blog.title || "",
          content: blog.content || "",
          isPublished: !!blog.isPublished,
        });
        setCoverPreview(blog.coverImage || "");
      } catch (err) {
        // Updated error messaging for better debugging
        const message = err.response?.status === 403 ? "Access Denied" : "Story not found";
        setLocalToast({ visible: true, text: message, type: "error" });
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (!loading) {
      const tl = gsap.timeline();
      tl.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "expo.out" })
        .fromTo(canvasRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }, "-=0.6")
        .fromTo(footerRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.8");
    }
  }, [loading]);

  const handleCoverFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("content", formData.content);
     
      payload.append("isPublished", String(formData.isPublished)); 
      if (selectedCoverFile) payload.append("coverImage", selectedCoverFile);

      await updateBlog(id, payload);
      setLocalToast({ visible: true, text: "Broadcast Synchronized", type: "success" });
      setTimeout(() => navigate(formData.isPublished ? `/blog/${id}` : "/drafts"), 1500);
    } catch (err) {
      setLocalToast({ visible: true, text: "Sync error", type: "error" });
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 pb-40">
      {localToast.visible && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 ${localToast.type === 'error' ? 'bg-red-600' : 'bg-slate-900'} text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300`}>
          <Sparkles size={12} className="text-white" /> {localToast.text}
        </div>
      )}

      <header ref={headerRef} className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 md:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-700">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-800 uppercase tracking-tighter border border-slate-200">
            <Globe size={11} /> {formData.isPublished ? "Public" : "Draft"}
          </div>
        </div>
      </header>

      <main ref={canvasRef} className="max-w-3xl mx-auto mt-8 md:mt-16 px-4 md:px-6">
        <section className="mb-12 group">
          {coverPreview ? (
            <div className="relative aspect-video md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-slate-100">
              <img src={coverPreview} className="w-full h-full object-cover" alt="Cover" />
              <button 
                onClick={() => { setSelectedCoverFile(null); setCoverPreview(""); }} 
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur shadow-lg rounded-full text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center aspect-video md:aspect-[21/9] border-2 border-dashed border-slate-200 rounded-2xl md:rounded-3xl cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all">
              <ImagePlus size={24} className="text-slate-400 mb-2" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Update Artwork</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverFile} />
            </label>
          )}
        </section>

        <textarea
          ref={titleRef}
          rows="1"
          placeholder="Story Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full text-4xl md:text-7xl font-black text-slate-900 placeholder:text-slate-100 outline-none resize-none mb-10 md:mb-14 leading-[1.15] tracking-tighter overflow-hidden pt-2"
        />

        <div className="flex flex-wrap items-center gap-6 mb-12 py-6 border-y border-slate-100">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="publish"
              checked={formData.isPublished} 
              onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="publish" className="text-[11px] font-black uppercase tracking-widest text-slate-700 cursor-pointer">Live Broadcast</label>
          </div>
          <div className="hidden xs:block h-4 w-[1px] bg-slate-200" />
          <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600">
            <Eye size={14} /> Preview Mode
          </button>
        </div>

        <textarea
          placeholder="Continue writing..."
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          className="w-full min-h-[400px] text-lg md:text-2xl font-medium text-slate-800 placeholder:text-slate-100 outline-none resize-none leading-relaxed"
        />
      </main>

      <footer 
        ref={footerRef}
        className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 w-[94%] max-w-2xl bg-white border border-slate-200 rounded-[2rem] p-2 md:p-3 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] z-[200] flex items-center justify-between"
      >
        <div className="flex items-center gap-4 pl-4">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${formData.content.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
            <div className="flex flex-col">
               <span className="text-[9px] font-black uppercase tracking-tight text-slate-900">
                {formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0} Words
              </span>
              <span className="text-[7px] font-bold uppercase text-slate-400 tracking-tighter">Synced</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-3 bg-indigo-600 text-white pl-8 pr-6 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <> {formData.isPublished ? "Update" : "Save Draft"} <div className="p-1 bg-white/20 rounded-full"><Save size={12} /></div></>
          )}
        </button>
      </footer>
    </div>
  );
}

export default EditBlog;