import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { FurnitureSuggestion } from '../types';

interface ARViewProps {
  suggestion: FurnitureSuggestion;
  onClose: () => void;
}

// Helper function to calculate distance between two touch points
const getTouchDistance = (touches: React.TouchList): number => {
    return Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
    );
};

// Reusable slider component for controls
const ControlSlider: React.FC<{label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, min?: string, max?: string, step?: string}> = ({label, value, onChange, min = "-180", max = "180", step = "1"}) => (
  <div className="flex items-center gap-3">
    <label htmlFor={label} className="w-16 text-sm font-medium text-gray-200">{label}</label>
    <input
        id={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-400"
    />
    <span className="text-sm font-mono w-12 text-center bg-black/30 rounded p-1">{value}°</span>
  </div>
);


export const ARView: React.FC<ARViewProps> = ({ suggestion, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
  });

  const interactionState = useRef({
    isInteracting: false,
    startDist: 0,
    startScale: 1,
    startX: 0,
    startY: 0,
    startItemX: 0,
    startItemY: 0,
  });

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera for AR:", err);
        alert("Could not access the camera for AR view. Please ensure permissions are granted.");
        onClose();
      }
    };
    startCamera();
    
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [onClose]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    interactionState.current.isInteracting = true;
    if (e.touches.length === 1) {
      interactionState.current.startX = e.touches[0].clientX;
      interactionState.current.startY = e.touches[0].clientY;
      interactionState.current.startItemX = transform.x;
      interactionState.current.startItemY = transform.y;
    } else if (e.touches.length === 2) {
      const dist = getTouchDistance(e.touches);
      interactionState.current.startDist = dist;
      interactionState.current.startScale = transform.scale;
    }
  }, [transform]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!interactionState.current.isInteracting) return;

    let newTransform = { ...transform };

    if (e.touches.length === 1) { // Dragging
      const dx = e.touches[0].clientX - interactionState.current.startX;
      const dy = e.touches[0].clientY - interactionState.current.startY;
      newTransform.x = interactionState.current.startItemX + dx;
      newTransform.y = interactionState.current.startItemY + dy;
    } else if (e.touches.length === 2) { // Pinching
      const dist = getTouchDistance(e.touches);
      const scale = (dist / interactionState.current.startDist) * interactionState.current.startScale;
      newTransform.scale = Math.min(Math.max(0.1, scale), 5); // Clamp scale
    }
    
    setTransform(newTransform);
  }, [transform]);
  
  const handleTouchEnd = useCallback(() => {
    interactionState.current.isInteracting = false;
  }, []);

  const imageUrl = suggestion.imageUrl;

  return (
    <div className="fixed inset-0 z-50 bg-black" aria-modal="true" role="dialog">
      <video ref={videoRef} autoPlay playsInline muted className="absolute top-0 left-0 w-full h-full object-cover"></video>
      
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
        <div
          ref={itemRef}
          className="absolute cursor-grab active:cursor-grabbing"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) rotateZ(${transform.rotateZ}deg) scale(${transform.scale})`,
            touchAction: 'none',
            transformStyle: 'preserve-3d',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img 
            src={imageUrl} 
            alt={suggestion.name}
            className="w-48 h-auto pointer-events-none shadow-2xl rounded-lg"
            draggable="false"
          />
        </div>
      </div>
      
      <header className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent flex justify-between items-center">
        <h2 className="text-white text-lg font-bold text-shadow">{suggestion.name}</h2>
        <button 
          onClick={onClose} 
          className="bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition"
          aria-label="Close AR view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <footer className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm">
        <div className="max-w-md mx-auto grid grid-cols-1 gap-2 text-white">
            <ControlSlider
                label="Rotate X"
                value={transform.rotateX}
                onChange={(e) => setTransform(t => ({ ...t, rotateX: Number(e.target.value) }))}
            />
            <ControlSlider
                label="Rotate Y"
                value={transform.rotateY}
                onChange={(e) => setTransform(t => ({ ...t, rotateY: Number(e.target.value) }))}
            />
            <ControlSlider
                label="Rotate Z"
                value={transform.rotateZ}
                onChange={(e) => setTransform(t => ({ ...t, rotateZ: Number(e.target.value) }))}
            />
        </div>
      </footer>
    </div>
  );
};
