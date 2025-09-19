import React, { useState, useRef, useEffect, useCallback } from 'react';
import { dataURLtoFile } from '../utils/image';

interface ImageEditorProps {
  imageDataUrl: string;
  onConfirm: (file: File, base64: string) => void;
  onCancel: () => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ imageDataUrl, onConfirm, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const applyFilters = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (canvas && image && image.complete && image.naturalWidth > 0) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        ctx.drawImage(image, 0, 0);
      }
    }
  }, [brightness, contrast, saturation]);
  
  useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageDataUrl;
    image.onload = () => {
      imageRef.current = image;
      applyFilters();
    };
  }, [imageDataUrl, applyFilters]);

  useEffect(() => {
    if (imageRef.current) {
        applyFilters();
    }
  }, [brightness, contrast, saturation, applyFilters]);
  
  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const editedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const newFile = dataURLtoFile(editedDataUrl, `edited-image-${Date.now()}.jpg`);
      const newBase64 = editedDataUrl.split(',')[1];
      onConfirm(newFile, newBase64);
    }
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  const ControlSlider: React.FC<{label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, min?: number, max?: number, step?: number}> = ({label, value, onChange, min = 0, max = 200, step = 1}) => (
    <div>
      <label htmlFor={label} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <div className="flex items-center gap-4">
        <input
            id={label}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <span className="text-sm font-mono w-12 text-center bg-gray-100 rounded p-1">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Enhance Your Image</h2>
      <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
        <canvas ref={canvasRef} className="max-w-full max-h-full" style={{objectFit: 'contain'}} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <ControlSlider label="Brightness" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
          <ControlSlider label="Contrast" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} />
          <ControlSlider label="Saturation" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button onClick={onCancel} className="flex-1 justify-center inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition">
          Change Image
        </button>
        <button onClick={resetFilters} className="flex-1 justify-center inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition">
          Reset
        </button>
        <button onClick={handleConfirm} className="flex-1 justify-center inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition">
          Confirm and Continue
        </button>
      </div>
    </div>
  );
};
