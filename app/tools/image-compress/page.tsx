'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/ui/FileUpload';
import { ArrowLeft, Image as ImageIcon, Settings2, Download, Trash2, CheckCircle2, FileImage } from 'lucide-react';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';

export default function ImageCompressPage() {
  const [file, setFile] = useState<File | null>(null);
  
  const [maxSizeMB, setMaxSizeMB] = useState<number>(1);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState<number>(1920);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedFile, setCompletedFile] = useState<{ url: string, name: string, size: number } | null>(null);

  const handleFilesAccepted = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setCompletedFile(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: maxWidthOrHeight,
        useWebWorker: true,
      };
      
      const compressedBlob = await imageCompression(file, options);
      
      const url = URL.createObjectURL(compressedBlob);
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const extension = file.name.substring(file.name.lastIndexOf('.'));
      
      setCompletedFile({
        url,
        name: `${baseName}_compressed${extension}`,
        size: compressedBlob.size
      });

    } catch (error) {
      console.error("Error compressing image:", error);
      alert("An error occurred while compressing the image.");
    } finally {
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
        <div className="w-16 h-16 bg-lime-100 text-lime-600 rounded-2xl flex items-center justify-center mx-auto mb-4 content-center shadow-inner">
          <FileImage className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Compress Image
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
          Reduce the file size of your images significantly without losing visual quality.
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
                  <div className="flex flex-col gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50 mb-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center mx-auto shrink-0 shadow-sm">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 truncate max-w-full px-4">{file.name}</p>
                      <p className="text-sm font-medium text-slate-500 mt-1">
                        Original Size: <span className="text-slate-800">{(file.size / 1024 / 1024).toFixed(3)} MB</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setFile(null);
                      }}
                      className="mt-2 text-sm font-semibold text-red-500 hover:text-red-700 transition"
                    >
                      Remove File
                    </button>
                  </div>
                </div>

                {/* Compress Form */}
                <div className="flex-[1.5] space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-4">
                    <Settings2 className="w-5 h-5 text-slate-400" />
                    Compression Settings
                  </h3>
                  
                  <div className="space-y-6 p-6 border-2 border-slate-100 rounded-2xl bg-white">
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-700">Target Max File Size (MB)</label>
                        <span className="text-sm font-bold text-lime-600 bg-lime-50 px-2 py-1 rounded-md">{maxSizeMB} MB</span>
                      </div>
                      <input 
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={maxSizeMB}
                        onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-lime-600"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                        <span>0.1 MB (Very Small)</span>
                        <span>5.0 MB (High Quality)</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Max Resolution (Width/Height)</label>
                      <select 
                        value={maxWidthOrHeight}
                        onChange={(e) => setMaxWidthOrHeight(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 outline-none transition-all shadow-sm font-medium"
                      >
                        <option value={720}>720px (HD)</option>
                        <option value={1080}>1080px (Full HD)</option>
                        <option value={1920}>1920px (Web Standard)</option>
                        <option value={3840}>3840px (4K)</option>
                      </select>
                      <p className="text-xs text-slate-500 mt-2">The image will be scaled down if it exceeds this dimension.</p>
                    </div>

                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center border-t border-slate-100 pt-8">
                <button 
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-lg disabled:shadow-none flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>Compressing...</>
                  ) : (
                    <>
                      Compress Image
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-lime-200 p-6 md:p-10 mt-8 text-center shadow-sm">
          <div className="w-24 h-24 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-lime-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Compression Complete!</h2>
          
          <div className="flex items-center justify-center gap-6 mb-8 text-sm bg-slate-50 p-4 rounded-xl max-w-sm mx-auto border border-slate-100">
            <div className="text-center">
              <p className="text-slate-500 mb-1">Original Size</p>
              <p className="font-bold text-slate-700 line-through">{(file!.size / 1024 / 1024).toFixed(3)} MB</p>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            <div className="text-center">
              <p className="text-slate-500 mb-1">Compressed</p>
              <p className="font-bold text-green-600">{(completedFile.size / 1024 / 1024).toFixed(3)} MB</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={completedFile.url} 
              download={completedFile.name}
              className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Download className="w-5 h-5" />
              Download Image
            </a>
            
            <button 
              onClick={() => {
                setCompletedFile(null);
                setFile(null);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition w-full sm:w-auto"
            >
              Compress another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
