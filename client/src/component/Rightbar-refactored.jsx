import React, { memo } from 'react';


const RightbarItem = memo(({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 group"
    title={label}
  >
    <Icon className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
    <span className="text-sm font-medium text-left">{label}</span>
  </button>
));

RightbarItem.displayName = 'RightbarItem';

function Rightbar() {
  const menuItems = [
    {
      id: 'trending',
      label: 'Trending',
      icon: (props) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      onClick: () => {},
    },
    {
      id: 'following',
      label: 'Following',
      icon: (props) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3a6 6 0 016-6h6a6 6 0 016 6v3m0 0h3m-3 0v-3" />
        </svg>
      ),
      onClick: () => {},
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: (props) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      onClick: () => {},
    },
  ];

  return (
    <aside
      className="w-64 bg-white shadow-lg md:h-screen h-full p-5 sticky top-0 border-l border-gray-200"
      role="complementary"
      aria-label="Right sidebar"
    >
      <h2 className="text-sm font-semibold text-gray-900 mb-4 px-2">Explore</h2>
      <nav className="flex flex-col gap-1">
        {menuItems.map(({ id, label, icon: Icon, onClick }) => (
          <RightbarItem
            key={id}
            label={label}
            icon={Icon}
            onClick={onClick}
          />
        ))}
      </nav>

      {/* Featured section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 px-2">Featured Blogs</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={`featured-${i}`}
              className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <p className="text-xs font-medium text-gray-700 truncate">Featured Blog Title {i}</p>
              <p className="text-[10px] text-gray-500">By Author</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Rightbar;
