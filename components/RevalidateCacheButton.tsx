'use client';

import { useState } from 'react';

export default function RevalidateCacheButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRevalidate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/automate/trigger?path=/blog/generativeai", {
        method: "POST"
      });

      const data = await res.json();
      alert(data.message || 'Cache revalidation triggered!');
    } catch (error) {
      alert('Error triggering cache revalidation');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      id="revalidateBtn"
      onClick={handleRevalidate}
      disabled={isLoading}
      className={`
        px-4 py-2 rounded-lg font-medium text-white
        transition-all duration-200 
        ${isLoading 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-purple-600 hover:bg-purple-700 active:scale-95'
        }
        shadow-md hover:shadow-lg
        flex items-center gap-2
      `}
    >
      {isLoading ? (
        <>
          <svg 
            className="animate-spin h-4 w-4 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Revalidating...</span>
        </>
      ) : (
        <>
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          <span>Revalidate Cache</span>
        </>
      )}
    </button>
  );
}