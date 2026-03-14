import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { singleBlog, deleteBlog, toggleSave, toggleLike } from "../services/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  Heart, 
  Share2, 
  Clock, 
  Bookmark, 
  MessageCircle, 
  Loader2, 
  AlertTriangle 
} from "lucide-react";
import { toast } from "react-toastify";
import Comment from "../pages/Comment"; 

gsap.registerPlugin(ScrollTrigger);

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  
  const mainRef = useRef(null);
  const headerRef = useRef(null);
  const imageRef = useRef(null);
  const commentSectionRef = useRef(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await singleBlog(id);
        setBlog(res.data);
        setLikeCount(res.data.likes?.length || 0);
        
        if (currentUser._id && res.data.likes) {
          setIsLiked(res.data.likes.includes(currentUser._id));
        }

        const latestUser = JSON.parse(localStorage.getItem("user")) || {};
        if (latestUser.savedBlogs) {
          setIsSaved(latestUser.savedBlogs.includes(id));
        }
      } catch (err) { console.log(err); }
    }
    fetchBlog();
  }, [id]);

  const handleToggleLike = async () => {
    if (!currentUser._id) {
      toast.error("Please login to appreciate stories");
      return;
    }

    const originalLiked = isLiked;
    const originalCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      const res = await toggleLike(id);
      setIsLiked(res.data.likes.includes(currentUser._id));
      setLikeCount(res.data.likes.length);
    } catch (err) {
      setIsLiked(originalLiked);
      setLikeCount(originalCount);
      toast.error("Failed to sync appreciation");
      console.log(err);
    }
  };

  const handleToggleSave = async () => {
    if (!currentUser._id) {
      toast.error("Please login to save stories");
      return;
    }
    setSaveLoading(true);
    try {
      const res = await toggleSave(id);
      const updatedSavedStatus = res.data.savedBlogs.includes(id);
      setIsSaved(updatedSavedStatus);
      const updatedUser = { ...currentUser, savedBlogs: res.data.savedBlogs };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      toast.error("Failed to update vault");
      console.log(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBlog(blog._id);
      toast.success("Entry removed");
      navigate('/home');
    } catch (err) {
      toast.error("Deletion failed");
      console.log(err);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const scrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((window.scrollY / total) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (blog && mainRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(headerRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 })
        .fromTo(imageRef.current, { scale: 0.98, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 1.4 }, "-=0.8");
        
        gsap.utils.toArray(".reveal-item").forEach((item) => {
          gsap.fromTo(item, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 1,
            scrollTrigger: { trigger: item, start: "top 92%", toggleActions: "play none none reverse" }
          });
        });
      }, mainRef);
      return () => ctx.revert();
    }
  }, [blog]);

  if (!blog) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div ref={mainRef} className="bg-white min-h-screen selection:bg-indigo-600 selection:text-white">
      <div className="fixed top-0 left-0 w-full h-1 z-[150] bg-slate-50">
        <div className="h-full bg-indigo-600 transition-all duration-75" style={{ width: `${progress}%` }} />
      </div>

      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-[140] border-b border-slate-100 md:hidden">
        <div className="flex items-center justify-between px-4 h-16">
          <button onClick={() => navigate(-1)} className="p-2 text-slate-900"><ArrowLeft size={20} /></button>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate max-w-[200px]">{blog.title}</span>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col md:flex-row gap-0 md:gap-12 pt-24 md:pt-40 px-0 md:px-8">
        <aside className="hidden md:block w-20 sticky top-40 h-fit">
          <div className="flex flex-col items-center gap-8 text-slate-300">
            <div className="flex flex-col items-center gap-1 group">
              <button 
                onClick={handleToggleLike}
                className={`transition-all duration-300 ${isLiked ? "text-rose-500 scale-110" : "hover:text-rose-500"}`}
              >
                <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <span className={`text-[10px] font-black ${isLiked ? "text-rose-500" : "text-slate-400"}`}>{likeCount}</span>
            </div>
            
            <button onClick={scrollToComments} className="hover:text-indigo-600 transition-colors"><MessageCircle size={22} /></button>
            
            <button onClick={handleToggleSave} disabled={saveLoading} className={`transition-all duration-300 ${isSaved ? "text-indigo-600 scale-110" : "hover:text-slate-900"}`}>
              <Bookmark size={22} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <div className="w-px h-12 bg-slate-100" />
            <button className="hover:text-indigo-600 transition-colors"><Share2 size={22} /></button>
          </div>
        </aside>

        <div className="flex-1 max-w-2xl lg:max-w-3xl mx-auto">
          <div className="px-6 md:px-0 mb-12" ref={headerRef}>
            <div className="flex items-center gap-3 mb-8">
              {blog.author?.profileImage && (
                <img src={blog.author.profileImage} className="w-10 h-10 md:w-11 md:h-11 rounded-full aspect-square object-cover border border-slate-100" alt="author" />
              )}
              <div>
                <Link to={`/profile/${blog.author?._id}`} className="text-sm font-bold text-slate-900 block hover:text-indigo-600 transition-colors tracking-tight">{blog.author?.name}</Link>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Clock size={10} /> {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-8 uppercase">{blog.title}</h1>
          </div>

          {blog.coverImage && (
            <div ref={imageRef} className="px-0 md:px-0 mb-16">
              <div className="w-full aspect-16/10 md:aspect-video md:rounded-3xl overflow-hidden border border-slate-50 shadow-2xl">
                <img src={blog.coverImage} className="w-full h-full object-cover" alt="cover" />
              </div>
            </div>
          )}

          <article className="px-6 md:px-0 content-body">
            <div className="prose prose-slate max-w-none">
              {blog.content.split('\n').map((para, i) => para.trim() && (
                <p key={i} className="reveal-item text-base md:text-lg lg:text-xl text-slate-700 leading-relaxed md:leading-loose font-medium mb-8">{para}</p>
              ))}
            </div>

            {currentUser?._id === blog.author?._id && (
              <div className="reveal-item mt-16 flex items-center gap-4 py-8 border-t border-slate-100">
                <button onClick={() => navigate(`/edit/${blog._id}`)} className="px-8 py-4 bg-slate-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg"><Edit3 size={14} /> Edit Entry</button>
                <button onClick={() => setShowDeleteModal(true)} className="p-4 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-90"><Trash2 size={18} /></button>
              </div>
            )}

            <footer className="reveal-item mt-24 p-8 md:p-12 bg-slate-50 rounded-[2.5rem] border border-slate-100 mb-20">
              <div className="flex flex-col items-center text-center">
                {blog.author?.profileImage && (
                  <img src={blog.author.profileImage} className="w-20 h-20 rounded-full aspect-square object-cover shadow-xl mb-6 ring-4 ring-white" alt="author" />
                )}
                <h3 className="text-xl font-black text-slate-900 mb-2">{blog.author?.name}</h3>
                <p className="text-slate-500 text-sm font-medium max-w-sm mb-10 leading-relaxed">{blog.author?.bio || "Digital architect and technical storyteller pushing the boundaries of the BlogVerse network."}</p>
                <div className="flex gap-4">
                  <Link to={`/profile/${blog.author?._id}`} className="px-8 py-3.5 bg-white border border-slate-200 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">Author Profile</Link>
                  <button onClick={handleToggleSave} disabled={saveLoading} className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">{isSaved ? "Saved" : "Save Story"}</button>
                </div>
              </div>
            </footer>
            <div ref={commentSectionRef}><Comment blogId={id} blogAuthorId={blog.author?._id} /></div>
          </article>
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl border border-slate-100">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2 uppercase">Delete Entry?</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              This action is permanent. All data associated with this entry will be wiped from the network.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-rose-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : "Confirm"}
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 bg-slate-50 text-slate-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogDetails;