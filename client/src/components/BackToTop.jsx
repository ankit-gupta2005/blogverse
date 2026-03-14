import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed z-50 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-xl 
        text-slate-900 transition-all duration-500 hover:border-slate-900 
        hover:scale-110 active:scale-95 bottom-10 right-10
        
        /* Hide on mobile (below 768px), Show on Desktop */
        hidden md:flex items-center justify-center
        
        /* Visibility Logic */
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}
    >
      <ArrowUp size={20} strokeWidth={2.5} />
    </button>
  );
}