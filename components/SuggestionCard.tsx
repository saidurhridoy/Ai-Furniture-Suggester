import React from 'react';
import type { FurnitureSuggestion } from '../types';

interface SuggestionCardProps {
  suggestion: FurnitureSuggestion;
  onVisualize: (suggestion: FurnitureSuggestion) => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onVisualize }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
      <img
        src={suggestion.imageUrl}
        alt={suggestion.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // prevent looping
            target.src = `https://picsum.photos/seed/${suggestion.name.replace(/\s/g, '')}/400/300`;
            target.title = "Product image not available. Showing placeholder.";
        }}
      />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{suggestion.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{suggestion.description}</p>
        <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center gap-2 mb-3">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full truncate" title={`Material: ${suggestion.material}`}>
                    Material: {suggestion.material}
                </span>
            </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <button
                onClick={() => onVisualize(suggestion)}
                className="w-full sm:w-auto flex-grow justify-center inline-flex items-center px-3 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Visualize with AI
            </button>
            <a
              href={suggestion.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-grow justify-center inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              View Product
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
