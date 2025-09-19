import React, { useCallback, useState } from 'react';
import { fileToDataURL } from '../utils/image';

interface ImageUploaderProps {
  onImageUpload: (file: File, dataUrl: string) => void;
  onUseCamera: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onUseCamera }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (file: File | null) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      try {
        const dataUrl = await fileToDataURL(file);
        onImageUpload(file, dataUrl);
      } catch (error) {
        console.error("Error converting file to data URL", error);
        alert("Could not process image file. Please try another.");
      }
    } else {
      alert("Please upload a valid image file (JPEG or PNG).");
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [handleFileChange]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">Find Your Perfect Furniture</h2>
      <p className="text-gray-500 mb-6">Upload a photo of your room, or use your camera to take a new one.</p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative flex-1 block w-full border-2 border-dashed rounded-lg p-12 text-center hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
        >
          <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/jpeg, image/png"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="mt-2 block text-sm font-medium text-gray-600">
            <span className="text-indigo-600">Click to upload</span> or drag and drop
          </span>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 10MB</p>
        </div>

        <div className="flex items-center sm:flex-col">
            <div className="w-full h-px sm:w-px sm:h-full bg-gray-200"></div>
            <span className="px-2 text-sm text-gray-500 bg-white">OR</span>
            <div className="w-full h-px sm:w-px sm:h-full bg-gray-200"></div>
        </div>

        <button
            onClick={onUseCamera}
            className="flex-1 flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
        >
            <svg xmlns="http://www.w.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
             <span className="mt-2 block text-sm font-medium text-gray-600">
                <span className="text-indigo-600">Use Camera</span>
            </span>
             <p className="mt-1 text-xs text-gray-500">Take a photo of your room</p>
        </button>

      </div>
    </div>
  );
};
