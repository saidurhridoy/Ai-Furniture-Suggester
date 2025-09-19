import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { SuggestionCard } from './components/SuggestionCard';
import { BloggerInstructions } from './components/BloggerInstructions';
import { Spinner } from './components/Spinner';
import { getFurnitureSuggestions, blendFurnitureIntoRoom } from './services/geminiService';
import type { SuggestionCategory, FurnitureSuggestion } from './types';
import { CameraCapture } from './components/CameraCapture';
import { ImageEditor } from './components/ImageEditor';
import { AIBlendedView } from './components/AIBlendedView';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [stylePreference, setStylePreference] = useState<string>('Modern Minimalist');
  const [suggestions, setSuggestions] = useState<SuggestionCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [blendedImageResult, setBlendedImageResult] = useState<string | null>(null);
  const [originalImageForComparison, setOriginalImageForComparison] = useState<string | null>(null);


  const handleImageSelected = (file: File, dataUrl: string) => {
    setImageToEdit(dataUrl);
    setShowCamera(false);
    setSuggestions([]);
    setError(null);
  };
  
  const handleEditConfirm = (editedFile: File, editedBase64: string) => {
    setImageFile(editedFile);
    setImageBase64(editedBase64);
    setImageToEdit(null);
  };
  
  const handleEditCancel = () => {
    setImageToEdit(null);
  };

  const handleGetSuggestions = useCallback(async () => {
    if (!imageBase64 || !stylePreference) {
      setError('Please upload an image and specify a style.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const result = await getFurnitureSuggestions(imageBase64, stylePreference);
      setSuggestions(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, [imageBase64, stylePreference]);
  
  const resetApp = () => {
    setImageFile(null);
    setImageBase64(null);
    setSuggestions([]);
    setError(null);
    setIsLoading(false);
    setShowCamera(false);
    setImageToEdit(null);
    setBlendedImageResult(null);
    setOriginalImageForComparison(null);
  };
  
  const handleVisualize = async (suggestion: FurnitureSuggestion) => {
    if (!imageBase64) {
      setError("Original image is not available for visualization.");
      return;
    }
    setIsVisualizing(true);
    setError(null);
    try {
      const resultImage = await blendFurnitureIntoRoom(imageBase64, suggestion);
      setOriginalImageForComparison(URL.createObjectURL(imageFile!));
      setBlendedImageResult(resultImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during visualization.');
    } finally {
      setIsVisualizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header onToggleInstructions={() => setShowInstructions(!showInstructions)} showInstructions={showInstructions} />
      
      <main className="container mx-auto p-4 md:p-8">
        {showInstructions ? (
          <BloggerInstructions />
        ) : (
          <div className="max-w-4xl mx-auto">
            {imageToEdit ? (
               <ImageEditor 
                imageDataUrl={imageToEdit}
                onConfirm={handleEditConfirm}
                onCancel={handleEditCancel}
              />
            ) : !imageFile && showCamera ? (
               <CameraCapture onCapture={handleImageSelected} onBack={() => setShowCamera(false)} />
            ) : !imageFile ? (
              <ImageUploader onImageUpload={handleImageSelected} onUseCamera={() => setShowCamera(true)} />
            ) : (
              <div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-full md:w-1/2 flex-shrink-0">
                      <img src={URL.createObjectURL(imageFile)} alt="Room" className="rounded-xl object-cover w-full h-auto max-h-96" />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col space-y-4">
                      <h2 className="text-2xl font-bold text-gray-700">Customize Your Style</h2>
                      <div>
                        <label htmlFor="style" className="block text-sm font-medium text-gray-600 mb-1">
                          Furniture Style
                        </label>
                        <input
                          id="style"
                          type="text"
                          value={stylePreference}
                          onChange={(e) => setStylePreference(e.target.value)}
                          placeholder="e.g., Scandinavian, Industrial, Boho"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                         <button
                          onClick={handleGetSuggestions}
                          disabled={isLoading}
                          className="flex-1 w-full justify-center inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition"
                        >
                          {isLoading ? <Spinner /> : 'Get Suggestions'}
                        </button>
                        <button
                          onClick={resetApp}
                          className="flex-1 w-full justify-center inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        >
                          Use New Image
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            
            {suggestions.length > 0 && !imageToEdit && (
              <div className="mt-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Your Furniture Suggestions</h2>
                {suggestions.map((category, catIndex) => (
                  <div key={catIndex} className="mb-10">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-indigo-200">{category.category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.suggestions.map((suggestion, index) => (
                        <SuggestionCard key={index} suggestion={suggestion} onVisualize={handleVisualize} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      
      {isVisualizing && (
         <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center" aria-modal="true" role="dialog">
            <Spinner />
            <p className="text-white mt-4 text-lg">AI is re-imagining your room...</p>
         </div>
      )}

      {blendedImageResult && originalImageForComparison && (
        <AIBlendedView 
          originalImage={originalImageForComparison}
          blendedImage={blendedImageResult}
          onClose={() => setBlendedImageResult(null)}
        />
      )}
    </div>
  );
};

export default App;
