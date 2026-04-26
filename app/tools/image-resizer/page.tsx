'use client';

import { useState, useRef, useEffect } from 'react';
import { FileUpload } from '@/components/ui/FileUpload';
import { ArrowLeft, Image as ImageIcon, Settings2, Download, Trash2, CheckCircle2, Maximize } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainRatio, setMaintainRatio] = useState(true);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedFile, setCompletedFile] = useState<{ url: string, name: string } | null>(null);
  
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFilesAccepted = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setCompletedFile(null);
      
      const objectUrl = URL.createObjectURL(selectedFile);
      setImageSrc(objectUrl);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setOriginalDimensions({ width: naturalWidth, height: naturalHeight });
    setWidth(naturalWidth);
    setHeight(naturalHeight);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    setWidth(newWidth);
    if (maintainRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    setHeight(newHeight);
    if (maintainRatio && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const handleResize = () => {
    if (!file || !imageSrc || width === 0 || height === 0) return;
    
    setIsProcessing(true);
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        
        // Preserve original extension or default to png
        const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg';
        const isWebp = file.type === 'image/webp';
        
        let mimeType = 'image/png';
        let extension = '.png';
        
        if (isJpeg) {
          mimeType = 'image/jpeg';
          extension = '.jpg';
        } else if (isWebp) {
          mimeType = 'image/webp';
          extension = '.webp';
        }
        
        const dataUrl = canvas.toDataURL(mimeType, 0.9);
        
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        
        setCompletedFile({
          url: dataUrl,
          name: `${baseName}_resized_${width}x${height}${extension}`
        });
        
        setIsProcessing(false);
      };
      
      img.onerror = () => {
        alert('Failed to load image for resizing.');
        setIsProcessing(false);
      };
      
      img.src = imageSrc;

    } catch (error) {
      console.error("Error resizing image:", error);
      alert("An error occurred while resizing the image.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex justify-start mb-6">
        <Link href="/tools" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tools
        </Link>
      </div>

      <div className="mb-8 text-center pb-8 border-b border-slate-200">
        <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 content-center shadow-inner">
          <Maximize className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Resize Image
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
          Change the dimensions of your images quickly while maintaining quality.
        </p>
      </div>

      {!completedFile ? (
        <>
          {!file ? (
            <FileUpload 
              onFilesAccepted={handleFilesAccepted} 
              accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }} 
              maxFiles={1} 
              multiple={false} 
            />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 mt-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8">
                {/* File Info */}
                <div className="flex-1 space-y-4">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center justify-between">
                    Selected Image
                  </h3>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 mb-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setFile(null);
                        setImageSrc('');
                        setWidth(0);
                        setHeight(0);
                      }}
                      className="w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Image Preview */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center relative min-h-[200px]">
                    {imageSrc && (
                      <img 
                        ref={imgRef}
                        src={imageSrc} 
                        alt="Preview" 
                        onLoad={handleImageLoad}
                        className="max-w-full max-h-[300px] object-contain"
                      />
                    )}
                  </div>
                  <div className="text-center text-sm text-slate-500 mt-2">
                    Original: {originalDimensions.width} &times; {originalDimensions.height} px
                  </div>
                </div>

                {/* Resize Form */}
                <div className="flex-[1.5] space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-4">
                    <Settings2 className="w-5 h-5 text-slate-400" />
                    Resize Settings
                  </h3>
                  
                  <div className="space-y-6 p-6 border-2 border-slate-100 rounded-2xl bg-white">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Width (px)</label>
                        <input 
                          type="number"
                          value={width || ''}
                          onChange={handleWidthChange}
                          min="1"
                          className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm font-mono"
                        />
                      </div>
                      <div className="flex items-center justify-center pt-6">
                        <span className="text-slate-400 font-bold">&times;</span>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Height (px)</label>
                        <input 
                          type="number"
                          value={height || ''}
                          onChange={handleHeightChange}
                          min="1"
                          className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <input 
                        type="checkbox"
                        id="maintainRatio"
                        checked={maintainRatio}
                        onChange={(e) => setMaintainRatio(e.target.checked)}
                        className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                      />
                      <label htmlFor="maintainRatio" className="text-sm font-medium text-slate-700 cursor-pointer">
                        Maintain aspect ratio
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center border-t border-slate-100 pt-8">
                <button 
                  onClick={handleResize}
                  disabled={isProcessing || width <= 0 || height <= 0}
                  className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-lg disabled:shadow-none flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>Resizing...</>
                  ) : (
                    <>
                      <Maximize className="w-5 h-5" /> 
                      Resize Image
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-teal-200 p-6 md:p-10 mt-8 text-center shadow-sm">
          <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Image Resized!</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Your image has been successfully resized to {width} &times; {height} pixels.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={completedFile.url} 
              download={completedFile.name}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Download className="w-5 h-5" />
              Download Image
            </a>
            
            <button 
              onClick={() => {
                setCompletedFile(null);
                setFile(null);
                setImageSrc('');
                setWidth(0);
                setHeight(0);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition w-full sm:w-auto"
            >
              Resize another image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
