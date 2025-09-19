
import React from 'react';

interface HeaderProps {
    onToggleInstructions: () => void;
    showInstructions: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleInstructions, showInstructions }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">AI Furniture Suggester</h1>
        </div>
        <button
          onClick={onToggleInstructions}
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 border border-transparent rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
        >
          {showInstructions ? 'Back to App' : 'How to Embed'}
        </button>
      </div>
    </header>
  );
};
