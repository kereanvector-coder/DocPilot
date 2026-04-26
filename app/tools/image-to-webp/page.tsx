'use client';

import { useState, useRef } from 'react';
import { FileUpload } from '@/components/ui/FileUpload';
import { ArrowLeft, Image as ImageIcon, Settings2, Download, Trash2, CheckCircle2, FileImage } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ImageToWebPPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  
  const [quality, setQuality] = useState<number>(80);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedFile, setCompletedFile] = useState<{ url: string, name: string, size: number } | null>(null);
  
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

  const handleConvert = () => {
    if (!file || !imageSrc || !imgRef.current) return;
    
    setIsProcessing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const img = imgRef.current;
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      ctx.drawImage(img, 0, 0);
      
      const qualityFactor = quality / 100;
      
      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Failed to convert image');
          setIsProcessing(false);
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        
        setCompletedFile({
          url,
          name: `${baseName}.webp`,
          size: blob.size
        });
        
        setIsProcessing(false);
      }, 'image/webp', qualityFactor);

    } catch (error) {
      console.error("Error converting image:", error);
      alert("An error occurred while converting the image.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex justify-start mb-6">
        <Link href="/tools" prefetch={true} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tools
        </Link>
      </div>

      <div className="mb-8 text-center pb-8 border-b border-slate-200">
        <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4 content-center shadow-inner">
          <FileImage className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Convert to WebP
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
          Convert any JPG or PNG to WebP format for faster web page loading and smaller file sizes.
        </p>
      </div>

      {!completedFile ? (
        <>
          {!file ? (
            <FileUpload 
              onFilesAccepted={handleFilesAccepted} 
              accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }} 
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
                      <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
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
                        className="max-w-full max-h-[300px] object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* Convert Form */}
                <div className="flex-[1.5] space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-4">
                    <Settings2 className="w-5 h-5 text-slate-400" />
                    Conversion Settings
                  </h3>
                  
                  <div className="space-y-6 p-6 border-2 border-slate-100 rounded-2xl bg-white">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-700">WebP Quality</label>
                        <span className="text-sm font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-md">{quality}%</span>
                      </div>
                      <input 
                        type="range"
                        min="1"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                        <span>Smaller File</span>
                        <span>Balanced (80%)</span>
                        <span>High Quality</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center border-t border-slate-100 pt-8">
                <button 
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-lg disabled:shadow-none flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>Converting...</>
                  ) : (
                    <>
                      Convert to WebP
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-sky-200 p-6 md:p-10 mt-8 text-center shadow-sm">
          <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-sky-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Conversion Complete!</h2>
          
          <div className="flex items-center justify-center gap-6 mb-8 text-sm bg-slate-50 p-4 rounded-xl max-w-sm mx-auto border border-slate-100">
            <div className="text-center">
              <p className="text-slate-500 mb-1">Original Size</p>
              <p className="font-bold text-slate-700 line-through">{(file!.size / 1024).toFixed(1)} KB</p>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            <div className="text-center">
              <p className="text-slate-500 mb-1">WebP Size</p>
              <p className="font-bold text-green-600">{(completedFile.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={completedFile.url} 
              download={completedFile.name}
              className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Download className="w-5 h-5" />
              Download WebP
            </a>
            
            <button 
              onClick={() => {
                setCompletedFile(null);
                setFile(null);
                setImageSrc('');
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition w-full sm:w-auto"
            >
              Convert another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
