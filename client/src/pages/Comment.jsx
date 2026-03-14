import React, { useState, useEffect } from "react";
import { Send, Trash2, MessageCircle, Loader2, Sparkles, Quote, AlertCircle, X } from "lucide-react";
import { addComment, getComments, deleteComment as deleteCommentApi } from "../services/api";
import { toast } from "react-toastify";

function Comment({ blogId, blogAuthorId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, commentId: null });
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getComments(blogId);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await addComment({ content: newComment, blogId });
      setComments([res.data, ...comments]);
      setNewComment("");
      toast.success("Comment added", {
        icon: <Sparkles size={16} className="text-white" />,
        style: { background: "#0f0f0f", color: "#fff", borderRadius: "12px", fontSize: "14px" }
      });
    } catch (err) {
      toast.error("Couldn't add comment", {
        style: { background: "#0f0f0f", color: "#fff", borderRadius: "12px", fontSize: "14px" }
      });
        console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    const { commentId } = deleteModal;
    try {
      await deleteCommentApi(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted", {
        style: { background: "#0f0f0f", color: "#fff", borderRadius: "12px", fontSize: "14px" }
      });
      setDeleteModal({ isOpen: false, commentId: null });
    } catch (err) {
      toast.error("Error deleting comment", {
        style: { background: "#0f0f0f", color: "#fff", borderRadius: "12px", fontSize: "14px" }
      });
        console.error(err);
    }
  };

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-10 h-10 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
        <MessageCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={14} />
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Discussions</p>
    </div>
  );

  return (
    <div className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-slate-100 max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
      
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center px-0 sm:px-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setDeleteModal({ isOpen: false, commentId: null })}
          />
          <div className="relative bg-white rounded-t-[2rem] sm:rounded-[2.5rem] p-6 md:p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
            <button 
              onClick={() => setDeleteModal({ isOpen: false, commentId: null })}
              className="absolute top-6 right-6 text-slate-400 p-2 hover:text-slate-900 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5">
                <AlertCircle size={28} />
              </div>
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-2">Delete Comment?</h4>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed px-2">
                This action will permanently remove the comment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button 
                  onClick={() => setDeleteModal({ isOpen: false, commentId: null })}
                  className="w-full py-4 rounded-2xl bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="w-full py-4 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10 md:mb-16">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 md:p-3 bg-indigo-600 text-white rounded-xl md:rounded-2xl shadow-xl shadow-indigo-100">
            <MessageCircle size={18} className="md:w-[22px] md:h-[22px]" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-normal uppercase">
            Comments <span className="text-indigo-600 ml-0.5">({comments.length})</span>
          </h3>
        </div>
        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest ml-1">Community Insights</p>
      </div>

      {user._id ? (
        <form onSubmit={handleSubmit} className="mb-12 md:mb-20">
          <div className="bg-slate-50 border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] p-2 md:p-3 focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-indigo-100/30 focus-within:border-indigo-100 transition-all duration-500">
            <div className="flex gap-3 md:gap-4 p-2">
              <div className="p-0.5 md:p-1 shrink-0">
                <img 
                  src={user.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full aspect-square object-cover ring-2 md:ring-4 ring-white shadow-md block"
                  alt="me"
                />
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-transparent py-2.5 md:py-3 text-sm md:text-base font-medium text-slate-700 placeholder:text-slate-300 outline-none resize-none min-h-[50px] md:min-h-[60px]"
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
            </div>
            <div className="flex flex-row justify-between items-center px-2 pb-2">
              <div className="flex items-center gap-2 ml-1 md:ml-16">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                 <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter text-slate-400">Public Broadcast</span>
              </div>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="group flex items-center gap-2 md:gap-3 px-5 md:px-8 py-3 md:py-3.5 bg-slate-900 text-white rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-30"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <><span className="hidden xs:inline">Share Perspective</span> <Send size={14} /></>}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-8 md:p-12 bg-slate-50 rounded-[2rem] md:rounded-[3rem] text-center mb-12 md:mb-20 border border-slate-100 border-dashed">
          <Sparkles className="mx-auto text-indigo-400 mb-3" size={20} />
          <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            Join the inner circle to contribute
          </p>
        </div>
      )}

      <div className="space-y-8 md:space-y-12 relative pb-20">
        <div className="absolute left-5 md:left-6 top-0 bottom-0 w-px bg-slate-50" />
        
        {comments.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <Quote className="mx-auto text-slate-50 mb-4" size={40} />
            <p className="text-slate-300 text-xs md:text-sm font-medium italic">Silence is the canvas. Be the first to paint.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="relative group flex gap-3 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative shrink-0 pt-1">
                <img
                  src={comment.author?.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full aspect-square object-cover ring-2 md:ring-4 ring-white shadow-lg relative z-10"
                  alt="user"
                />
                {comment.author?._id === blogAuthorId && (
                  <div className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white p-1 rounded-full z-20 shadow-lg ring-1 ring-white">
                    <Sparkles size={8} />
                  </div>
                )}
              </div>

              <div className="flex-1 bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-50 transition-all duration-500">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[12px] md:text-sm font-black text-slate-900 tracking-tight">{comment.author?.name}</span>
                    {comment.author?._id === blogAuthorId && (
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[7px] md:text-[8px] font-black rounded-full uppercase tracking-widest border border-indigo-100">
                        Creator
                      </span>
                    )}
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                      {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {user._id === comment.author?._id && (
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, commentId: comment._id })}
                      className="p-2 text-slate-300 hover:text-red-500 active:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <p className="text-slate-600 text-[13px] md:text-base leading-relaxed font-medium">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Comment;