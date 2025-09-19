import React, { useState } from 'react';

interface AIBlendedViewProps {
  originalImage: string;
  blendedImage: string;
  onClose: () => void;
}

export const AIBlendedView: React.FC<AIBlendedViewProps> = ({ originalImage, blendedImage, onClose }) => {
    const [sliderPosition, setSliderPosition] = useState(50);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSliderPosition(Number(e.target.value));
    };

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
            aria-modal="true" 
            role="dialog"
        >
            <div className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden shadow-2xl">
                {/* Original Image (Bottom Layer) */}
                <img src={originalImage} alt="Original Room" className="absolute top-0 left-0 w-full h-full object-contain" />

                {/* Blended Image (Top Layer, clipped) */}
                <div 
                    className="absolute top-0 left-0 w-full h-full object-contain overflow-hidden" 
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img src={blendedImage} alt="Room with AI Furniture" className="w-full h-full object-contain" style={{minWidth: '100%', minHeight: '100%'}}/>
                </div>
                
                {/* Slider Control */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                        className="absolute h-full w-1 bg-white/50 cursor-ew-resize"
                        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                    >
                         <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                         </div>
                    </div>
                     <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPosition}
                        onChange={handleSliderChange}
                        className="absolute w-full h-full cursor-ew-resize opacity-0"
                        aria-label="Before and after slider"
                    />
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 bg-black/50 text-white text-sm font-bold px-3 py-1 rounded">BEFORE</div>
                <div className="absolute top-4 right-4 bg-black/50 text-white text-sm font-bold px-3 py-1 rounded">AFTER</div>
            </div>

             <button 
                onClick={onClose} 
                className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition"
                aria-label="Close visualization"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};
