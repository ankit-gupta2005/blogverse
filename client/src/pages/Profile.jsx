import React, { useEffect, useState, useRef } from "react";
import { getProfile, updateProfile, getUserBlogs, toggleFollow } from "../services/api";
import { useNavigate, useParams, Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  CheckCircle2, 
  Settings, 
  Calendar, 
  Camera, 
  MoreHorizontal,
  Loader2,
  Image as ImageIcon,
  ChevronRight,
  UserPlus,
  UserCheck,
  Twitter,
  Github,
  Globe
} from "lucide-react";
import { toast } from "react-toastify";

gsap.registerPlugin(ScrollTrigger);

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const mainRef = useRef(null);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const profileId = id || loggedInUser?._id;
  const isOwner = !id || loggedInUser?._id === id;

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    try {
      const res = await getProfile(id);
      const userData = res.data;
      setUser(userData);
      setBio(userData.bio || "");
      setImagePreview(userData.profileImage || "");
      setBannerPreview(userData.profileBanner || "");
      
      if (loggedInUser && userData.followers) {
        const followingStatus = userData.followers.some(f => 
          (f._id || f) === loggedInUser._id
        );
        setIsFollowing(followingStatus);
      }
      fetchBlogs(userData._id);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBlogs = async (userId) => {
    try {
      const res = await getUserBlogs(userId);
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollowToggle = async () => {
    if (!loggedInUser) {
      toast.error("Please login to follow creators");
      return;
    }
    setFollowLoading(true);
    try {
      const res = await toggleFollow(profileId);
      setIsFollowing(res.data.isFollowing);
      setUser(prev => ({
        ...prev,
        followers: res.data.isFollowing 
          ? [...(prev.followers || []), loggedInUser._id]
          : prev.followers.filter(f => (f._id || f) !== loggedInUser._id)
      }));
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Follow action failed");
      console.log(err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("bio", bio);
      if (selectedFile) formData.append("profileImage", selectedFile);
      if (selectedBanner) formData.append("profileBanner", selectedBanner);
      const res = await updateProfile(formData);
      setUser(res.data);
      setEditing(false);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Profile Updated");
    } catch (err) {
      toast.error("Update failed");
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
    </div>
  );

  return (
    <div ref={mainRef} className="min-h-screen bg-white font-['Inter',sans-serif] text-slate-900 selection:bg-indigo-50 selection:text-indigo-700 mb-30 md:mb-5">
      
      <div className="hero-area relative h-[30vh] md:h-[40vh] w-full bg-[#F8F9FB] overflow-hidden">
        {bannerPreview ? (
          <img src={bannerPreview} className="w-full h-full object-cover opacity-90" alt="banner" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px]" />
        )}
        {editing && isOwner && (
          <label className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm cursor-pointer opacity-0 hover:opacity-100 transition-all duration-500">
            <ImageIcon className="text-slate-600 mb-2" size={24} />
            <span className="text-slate-600 text-[11px] font-semibold tracking-wide">Change Header</span>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if(file) {
                  setSelectedBanner(file);
                  setBannerPreview(URL.createObjectURL(file));
                }
            }} />
          </label>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 -mt-20 md:-mt-24">
        <div className="profile-card bg-white border border-slate-200/60 rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-10">
            <div className="flex items-center gap-6">
              <div className="relative">
                {imagePreview ? (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-sm overflow-hidden bg-slate-100">
                    <img src={imagePreview} className="w-full h-full object-cover aspect-square" alt="avatar" />
                  </div>
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-sm overflow-hidden bg-slate-200 flex items-center justify-center">
                    <span className="text-slate-400 font-bold text-2xl uppercase">{user.name?.charAt(0)}</span>
                  </div>
                )}
                {editing && isOwner && (
                  <label className="absolute inset-0 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-[2px] cursor-pointer opacity-0 hover:opacity-100 transition-all">
                    <Camera className="text-white" size={20} />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if(file) {
                        setSelectedFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }} />
                  </label>
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">{user.name}</h1>
                  <CheckCircle2 size={18} className="text-blue-500 fill-blue-500/10" />
                </div>
                <p className="text-slate-500 text-sm font-medium mb-3">{user.email}</p>
                
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900">{(user.followers?.length) || 0}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Followers</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900">{(user.following?.length) || 0}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Following</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wider rounded-md">Creator</span>
                  <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                    <Calendar size={12} /> Joined 2026
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {isOwner ? (
                editing ? (
                  <>
                    <button onClick={handleSave} disabled={saving} className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all disabled:opacity-50">
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button onClick={() => setEditing(false)} className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => navigate('/settings')} className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-medium hover:border-slate-900 transition-all flex items-center justify-center gap-2">
                    <Settings size={16} /> Edit Profile
                  </button>
                )
              ) : (
                <button 
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`flex-1 md:flex-none px-10 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 ${
                    isFollowing 
                    ? "bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600" 
                    : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {followLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isFollowing ? (
                    <><UserCheck size={16} /> Following</>
                  ) : (
                    <><UserPlus size={16} /> Follow</>
                  )}
                </button>
              )}
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-10 border-t border-slate-100">
            <div className="md:col-span-1 space-y-8 content-stagger">
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">About</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {user.bio || "This creator hasn't written a bio yet."}
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Network</h3>
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-slate-500 font-medium">Articles</span>
                  <span className="text-slate-900 font-semibold">{blogs.length}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {user.socialLinks?.twitter && (
                    <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-xl transition-all">
                      <Twitter size={18} />
                    </a>
                  )}
                  {user.socialLinks?.github && (
                    <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 border border-slate-100 rounded-xl transition-all">
                      <Github size={18} />
                    </a>
                  )}
                  {user.socialLinks?.website && (
                    <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-xl transition-all">
                      <Globe size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-4 content-stagger">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Posts</h2>
                <div className="h-px flex-1 bg-slate-100 mx-6" />
              </div>

              <div className="space-y-4">
                {blogs.map((b) => (
                  <div 
                    key={b._id} 
                    onClick={() => navigate(`/blog/${b._id}`)}
                    className="blog-card-sleek group bg-white border border-slate-100 hover:border-slate-300 p-4 rounded-2xl transition-all duration-500 cursor-pointer flex flex-col sm:flex-row gap-6"
                  >
                    {b.coverImage && (
                      <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50">
                        <img 
                          src={b.coverImage} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          alt="cover" 
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 py-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-snug">
                        {b.title}
                      </h4>
                      <p className="text-sm text-slate-500 line-clamp-2 font-medium mb-4">
                        {b.content}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity">
                        Read More <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
                
                {blogs.length === 0 && (
                  <div className="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">No entries found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;