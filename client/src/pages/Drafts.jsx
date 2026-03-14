import React, { useEffect, useState } from 'react';
import { getMyDrafts } from '../services/api';
import BlogCard from '../component/BlogCard';
import { Loader2, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Drafts() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyDrafts()
      .then(res => {
        setBlogs(res.data.blogs);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="py-8 md:py-12 max-w-4xl mx-auto px-4 md:px-0 ">
      <header className="mb-10 md:mb-12 px-2 md:px-0">
        <div className="flex items-center gap-3 p-3 mb-2">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <PenTool size={20} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase">Private Drafts</h1>
        </div>
        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ml-1 p-3">Your unpublished work...</p>
      </header>
      
      {blogs.length === 0 ? (
        <div className="py-24 text-center bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200 mx-2 md:mx-0">
           <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">The draft is empty</p>
        </div>
      ) : (
        <div className="flex flex-col p-3">
          {blogs.map(blog => (
            <div 
              key={blog._id} 
              onClickCapture={(e) => {
                e.stopPropagation();
                navigate(`/edit/${blog._id}`);
              }}
            >
              <BlogCard data={blog} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Drafts;