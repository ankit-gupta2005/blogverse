import React from 'react';

export const BlogCardSkeleton = () => (
  <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden animate-pulse">
    <div className="w-full h-full bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 px-2">
    {Array.from({ length: count }).map((_, i) => (
      <BlogCardSkeleton key={`skeleton-${i}`} />
    ))}
  </div>
);

export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-4" role="status" aria-live="polite">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
      <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
    </div>
    <p className="text-gray-600 text-sm">{message}</p>
  </div>
);
