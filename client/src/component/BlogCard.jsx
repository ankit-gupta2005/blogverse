import React, { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Bookmark,
  Share2,
  Heart,
  MessageCircle,
  PenTool,
  UserPlus,
  UserCheck
} from "lucide-react";
import { toggleSave, toggleLike, toggleFollow } from "../services/api";
import { toast } from "react-toastify";

const BlogCard = memo(({ data }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(data?.likes?.length || 0);
  const [loading, setLoading] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(
    data?.author?.followers?.length || 0
  );

  useEffect(() => {
    if (!data) return;

    if (user.savedBlogs) {
      setIsSaved(user.savedBlogs.includes(data._id));
    }

    if (data.likes && user._id) {
      setIsLiked(data.likes.includes(user._id));
    }

    if (data.author?.followers && user._id) {
      setIsFollowing(data.author.followers.includes(user._id));
    }
  }, [data, user]);

  if (!data || !data._id) return null;

  const handleFollow = async (e) => {
    e.stopPropagation();
    if (!user._id) {
      toast.error("Please login to follow authors");
      return;
    }
    const prevFollow = isFollowing;
    const prevCount = followerCount;
    setIsFollowing(!isFollowing);
    setFollowerCount((c) => (prevFollow ? c - 1 : c + 1));
    try {
      const res = await toggleFollow(data.author?._id || data.author);
      setIsFollowing(res.data.isFollowing);
      setFollowerCount(res.data.followersCount);
    } catch (err) {
      setIsFollowing(prevFollow);
      setFollowerCount(prevCount);
      console.log(err);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user._id) {
      toast.error("Please login to like stories");
      return;
    }
    const prevLiked = isLiked;
    const prevCount = likeCount;
    setIsLiked(!isLiked);
    setLikeCount((c) => (prevLiked ? c - 1 : c + 1));
    try {
      const res = await toggleLike(data._id);
      setIsLiked(res.data.likes.includes(user._id));
      setLikeCount(res.data.likes.length);
    } catch (err) {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      console.log(err);
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user._id) {
      toast.error("Please login to save stories");
      return;
    }
    setLoading(true);
    try {
      const res = await toggleSave(data._id);
      setIsSaved(!isSaved);
      const updatedUser = { ...user, savedBlogs: res.data.savedBlogs };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffSeconds = Math.floor((now - past) / 1000);
    if (diffSeconds < 60) return "Just now";
    const minutes = Math.floor(diffSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const readingTime = data.content
    ? Math.max(1, Math.ceil(data.content.split(" ").length / 200))
    : 1;

  const openBlog = () => navigate(`/blog/${data._id}`);

  const openProfile = (e) => {
    e.stopPropagation();
    const authorId = data.author?._id || data.author;
    if (authorId) navigate(`/profile/${authorId}`);
  };

  return (
    <article
      onClick={openBlog}
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden mb-6"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={data.author?.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
            alt="author"
            onClick={openProfile}
            className="w-10 h-10 rounded-full aspect-square object-cover ring-1 ring-slate-100"
          />
          <div className="flex flex-col">
            <h4 onClick={openProfile} className="text-sm font-bold text-slate-900 hover:text-indigo-600 leading-tight">
              {data.author?.name}
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">
              {followerCount} Followers • {getRelativeTime(data.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user._id !== (data.author?._id || data.author) && (
            <button onClick={handleFollow} className={`transition ${isFollowing ? "text-indigo-600" : "text-slate-400 hover:text-indigo-600"}`}>
              {isFollowing ? <UserCheck size={18} /> : <UserPlus size={18} />}
            </button>
          )}
          {!data.isPublished && (
            <div className="flex items-center gap-1 text-[10px] bg-slate-900 text-white px-2 py-1 rounded font-bold uppercase tracking-wider">
              <PenTool size={10} /> Draft
            </div>
          )}
        </div>
      </div>

      {data.coverImage && (
        <div className="w-full h-[190px] md:h-[390px] overflow-hidden bg-slate-50">
          <img
            src={data.coverImage}
            alt={data.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg md:text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
          {data.title}
        </h2>
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 font-medium">
          {data.content}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition ${isLiked ? "text-rose-500" : "hover:text-rose-500"}`}
            >
              <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-sm font-bold">{likeCount}</span>
            </button>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={22} />
              <span className="text-sm font-bold">{data.commentCount || 0}</span>
            </div>
            <button onClick={(e) => e.stopPropagation()} className="hover:text-indigo-600 transition">
              <Share2 size={22} />
            </button>
          </div>
          <button onClick={handleSave} disabled={loading} className={`transition ${isSaved ? "text-indigo-600" : "hover:text-indigo-600"}`}>
            <Bookmark size={22} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
        
        <div className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          {readingTime} min read
        </div>
      </div>
    </article>
  );
});

BlogCard.displayName = "BlogCard";

export default BlogCard;