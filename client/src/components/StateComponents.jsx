import React from 'react';


export const EmptyState = ({ 
  title = 'No content yet', 
  description = 'Start creating your first post',
  action = null 
}) => (
  <div className="flex flex-col items-center justify-center py-20 px-4">
    <div className="text-center max-w-md">
      <div className="mb-4">
        <svg
          className="w-20 h-20 mx-auto text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  </div>
);

export const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry = null 
}) => (
  <div className="flex flex-col items-center justify-center py-20 px-4">
    <div className="text-center max-w-md">
      <div className="mb-4">
        <svg
          className="w-16 h-16 mx-auto text-red-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
      <p className="text-gray-600 text-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);
