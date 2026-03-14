import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, BookOpen, Bookmark, PenTool, Settings, ArrowUp } from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "home", label: "Feed", path: "/home", icon: LayoutGrid },
    { id: "myblog", label: "My Stories", path: "/profile", icon: BookOpen },
    { id: "bookmarks", label: "Saved", path: "/bookmarks", icon: Bookmark },
    { id: "drafts", label: "Drafts", path: "/drafts", icon: PenTool },
    { id: "settings", label: "Settings", path: "/settings", icon: Settings },
  ];

  const activeIndex = menuItems.findIndex(item => item.path === location.pathname);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <aside className="hidden md:flex w-64 bg-white h-[calc(100vh-5rem)] border-r border-slate-100 sticky top-20 flex-col py-10 px-4 overflow-hidden shadow-lg">
        <div className="px-4 mb-8">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">Navigation</p>
        </div>
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 3 : 2.5} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-100">
        <nav className="relative bg-white/90 backdrop-blur-2xl rounded-[2.2rem] px-2 py-2 flex justify-between items-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-slate-100">
          
          {activeIndex !== -1 && activeIndex < 4 && (
            <div 
              className="absolute top-2 bottom-2 transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] bg-indigo-50 rounded-[1.8rem] z-0"
              style={{
                width: `calc((100% - 1rem) / 5)`,
                left: `calc(0.5rem + (${activeIndex} * (100% - 1rem) / 5))`,
              }}
            />
          )}

          {menuItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`relative z-10 flex-1 flex flex-col items-center justify-center py-2 transition-all duration-500 ${
                  isActive ? "text-indigo-600 scale-110" : "text-slate-300"
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 3 : 2.2} />
                <span className={`text-[8px] font-black uppercase mt-0.5 transition-all duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={scrollToTop}
            className="relative z-10 flex-1 flex flex-col items-center justify-center py-2 text-slate-300 active:text-indigo-600 active:scale-90 transition-all"
          >
            <ArrowUp size={20} strokeWidth={2.2} />
            <span className="text-[8px] font-black uppercase mt-0.5">Top</span>
          </button>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;