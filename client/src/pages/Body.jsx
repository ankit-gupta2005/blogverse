import React, {  useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlogCard from '../component/BlogCard';
import { SkeletonGrid } from '../components/Loaders';
import { EmptyState, ErrorState } from '../components/StateComponents';
import { getBlogs } from '../services/api';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Body() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page] = useState(1);

  const feedRef = useRef(null);

  const fetchBlogs = async (isReset = false) => {
    try {
      setIsLoading(true);
      setHasError(false);
      const res = await getBlogs(isReset ? 1 : page, searchQuery);
      setBlogs(res.data.blogs || []);
    } catch (err) {
      setHasError(true);
      setErrorMessage("Blog Interrupted");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(true);
  }, [searchQuery]);

  useEffect(() => {
    if (blogs.length > 0 && feedRef.current) {
      const cards = feedRef.current.querySelectorAll('.blog-card-wrapper');
      
      const ctx = gsap.context(() => {
        gsap.fromTo(
          cards,
          { 
            opacity: 0, 
            y: 60, 
            rotateX: 15,
            scale: 0.95 
          },
          { 
            opacity: 1, 
            y: 0, 
            rotateX: 0, 
            scale: 1,
            stagger: 0.1, 
            duration: 1.2, 
            ease: "expo.out",
            clearProps: "all"
          }
        );
      }, feedRef);

      return () => ctx.revert();
    }
  }, [blogs]);

  if (isLoading && blogs.length === 0) {
    return (
      <div className="flex-1 p-6 md:p-12 max-w-3xl mx-auto">
        <SkeletonGrid count={3} />
      </div>
    );
  }

  if (hasError && blogs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <ErrorState message={errorMessage} onRetry={() => fetchBlogs(true)} />
      </div>
    );
  }

  if (!isLoading && blogs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <EmptyState
          title={searchQuery ? "No matches found" : "Void detected"}
          description={searchQuery ? `No blogs found matching "${searchQuery}"` : "The  feed is currently empty. Initialize the first blog."}
          action={searchQuery ? null : {
            label: 'Create Entry',
            onClick: () => window.location.href = '/create',
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white scroll-smooth no-scrollbar perspective-1000">
      <main className="max-w-3xl mx-auto py-12 md:py-24 px-6 md:px-8 space-y-12 md:space-y-20">
        
        <header className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-indigo-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">
              {searchQuery ? `Search Results: ${searchQuery}` : 'Live Feed'}
            </span>
          </div>
        </header>

        <section ref={feedRef} className="flex flex-col gap-12 pb-24 md:pb-0">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-card-wrapper">
              <BlogCard data={blog} />
            </div>
          ))}
        </section>

        {isLoading && blogs.length > 0 && (
          <div className="py-20 flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Protocol...</span>
          </div>
        )}
      </main>
    </div>
  );
}

export default Body;