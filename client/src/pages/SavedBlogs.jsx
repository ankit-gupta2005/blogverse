import React, { useEffect, useState } from 'react';
import { fetchSavedBlogs } from '../services/api';
import BlogCard from '../component/BlogCard';
import { Loader2, Bookmark } from 'lucide-react';

function SavedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedBlogs()
      .then(res => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
        <Bookmark className="text-indigo-600" /> My Saved
      </h1>
      
      {blogs.length === 0 ? (
        <p className="text-slate-400">No stories saved yet.</p>
      ) : (
        <div className="grid gap-8">
          {blogs.map(blog => (
            <BlogCard key={blog._id} data={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedBlogs;