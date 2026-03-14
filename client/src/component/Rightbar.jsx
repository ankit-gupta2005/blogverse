import React, { useState, useEffect } from "react";
import { TrendingUp, X, Hash, ArrowUpRight, Users, UserPlus, UserCheck, Loader2 } from "lucide-react";
import { getTrending, getSuggested, toggleFollow } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TrendingTopic = ({ topic, count, onClick }) => (
  <button 
    onClick={onClick}
    className="group w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 transition-all duration-300"
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
        <Hash size={15} className="text-slate-400 group-hover:text-indigo-600" />
      </div>
      <div className="flex flex-col items-start text-left">
        <span className="text-sm font-semibold text-slate-900 tracking-tight capitalize">{topic}</span>
        <span className="text-[11px] font-medium text-slate-400 tracking-normal">{count} mentions</span>
      </div>
    </div>
    <ArrowUpRight size={14} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
  </button>
);

const SuggestedUser = ({ user, onFollow, isFollowing, isLoading, onClick }) => (
  <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all group">
    <div className="flex items-center gap-3 cursor-pointer" onClick={onClick}>
      <img 
        src={user.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
        className="w-10 h-10 rounded-full object-cover aspect-square" 
        alt={user.name} 
      />
      <div className="flex flex-col text-left">
        <span className="text-sm font-bold text-slate-900 line-clamp-1">{user.name}</span>
        <span className="text-[10px] text-slate-400 font-medium">creator</span>
      </div>
    </div>
    <button 
      onClick={() => onFollow(user._id)} 
      disabled={isLoading}
      className={`p-2 rounded-lg transition-all ${isFollowing ? 'text-emerald-600 bg-emerald-50' : 'text-indigo-600 hover:bg-indigo-50'}`}
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
    </button>
  </div>
);

const Content = ({ trending, suggested, navigate, onAction, followStatus, onFollowClick }) => {
  const handleTrendingClick = (topic) => {
    navigate(`/home?search=${topic}`);
    if (onAction) onAction();
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    if (onAction) onAction();
  };

  return (
    <div className="flex flex-col gap-10 font-sans">
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-indigo-600" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">Trending Topics</h2>
          </div>
          <div className="h-px flex-1 bg-slate-100 ml-4" />
        </div>
        <div className="space-y-1">
          {trending.map((item, idx) => (
            <TrendingTopic 
              key={idx} 
              topic={item.topic} 
              count={item.count} 
              onClick={() => handleTrendingClick(item.topic)}
            />
          ))}
          {trending.length === 0 && <p className="text-[11px] text-slate-400 px-4 italic text-left">Scanning for trends...</p>}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-indigo-600" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">Suggested Creators</h2>
          </div>
          <div className="h-px flex-1 bg-slate-100 ml-4" />
        </div>
        <div className="space-y-2">
          {suggested.map((user) => (
            <SuggestedUser 
              key={user._id} 
              user={user} 
              isFollowing={followStatus[user._id]?.isFollowing}
              isLoading={followStatus[user._id]?.isLoading}
              onFollow={onFollowClick}
              onClick={() => handleUserClick(user._id)} 
            />
          ))}
          {suggested.length === 0 && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-medium text-slate-500 leading-relaxed text-center">
                Network expanded! No new suggestions right now.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

function Rightbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [trending, setTrending] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadSidebarData = async () => {
      try {
        const [trendRes, suggestRes] = await Promise.all([
          getTrending(),
          getSuggested()
        ]);
        setTrending(trendRes.data);
        setSuggested(suggestRes.data);
        
        const initialStatus = {};
        suggestRes.data.forEach(user => {
          initialStatus[user._id] = { isFollowing: false, isLoading: false };
        });
        setFollowStatus(initialStatus);
      } catch (err) {
        console.log("Error loading sidebar data:", err);
      }
    };
    loadSidebarData();
  }, []);

  const handleFollow = async (userId) => {
    setFollowStatus(prev => ({ ...prev, [userId]: { ...prev[userId], isLoading: true } }));
    try {
      const res = await toggleFollow(userId);
      setFollowStatus(prev => ({ 
        ...prev, 
        [userId]: { isFollowing: res.data.isFollowing, isLoading: false } 
      }));
      toast.success(res.data.isFollowing ? "Following user" : "Unfollowed user");
    } catch (err) {
      toast.error("Action failed");
      console.log(err)
      setFollowStatus(prev => ({ ...prev, [userId]: { ...prev[userId], isLoading: false } }));
    }
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <aside className="hidden lg:flex w-80 h-[calc(100vh-5rem)] flex-col py-10 px-8 sticky top-20 bg-white border-l border-slate-100 overflow-y-auto no-scrollbar">
        <Content 
          trending={trending} 
          suggested={suggested} 
          navigate={navigate} 
          followStatus={followStatus}
          onFollowClick={handleFollow}
        />
      </aside>

      <button 
        onClick={() => setIsDrawerOpen(true)}
        className="lg:hidden fixed bottom-30 right-6 w-14 h-14 bg-slate-900 text-white  rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-95 transition-all hover:bg-indigo-600"
      >
        <TrendingUp size={24} />
      </button>

      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeDrawer} />
          <div className="relative bg-white rounded-t-[2.5rem] p-8 pb-12 max-h-[85vh] overflow-y-auto shadow-2xl border-t border-slate-100">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Discovery</h2>
              <button onClick={closeDrawer} className="p-2.5 bg-slate-50 text-slate-500 rounded-full">
                <X size={20} />
              </button>
            </div>
            <Content 
              trending={trending} 
              suggested={suggested} 
              navigate={navigate} 
              onAction={closeDrawer} 
              followStatus={followStatus}
              onFollowClick={handleFollow}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Rightbar;