'use client';

import { useState, useRef } from 'react';
import { FileUpload } from '@/components/ui/FileUpload';
import { ArrowLeft, Settings2, Download, Trash2, CheckCircle2, Eraser, FileImage } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ImageBgRemovalPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  
  const [completedFile, setCompletedFile] = useState<{ url: string, name: string } | null>(null);

  const handleFilesAccepted = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setCompletedFile(null);
      setProgressMsg('');
      
      const objectUrl = URL.createObjectURL(selectedFile);
      setImageSrc(objectUrl);
    }
  };

  const handleRemoveBg = async () => {
    if (!file || !imageSrc) return;
    
    setIsProcessing(true);
    setProgressMsg('Loading AI model (this may take a moment on first run)...');
    
    try {
      const imglyRemoveBackground = (await import('@imgly/background-removal')).default;
      
      const blob = await imglyRemoveBackground(imageSrc, {
        progress: (key, current, total) => {
          if (key === 'compute:inference') {
            setProgressMsg('Removing background...');
          } else {
            setProgressMsg(`Loading assets... ${Math.round((current / total) * 100)}%`);
          }
        }
      });
      
      const url = URL.createObjectURL(blob);
      
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      
      setCompletedFile({
        url: url,
        name: `${baseName}_nobg.png`
      });
      
    } catch (error) {
      console.error("Error removing background:", error);
      alert("An error occurred while removing the image background.");
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
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
        <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 content-center shadow-inner">
          <Eraser className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Remove Background
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
          Remove backgrounds from your images using on-device AI. 100% private and fast.
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
                      <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                        <FileImage className="w-5 h-5" />
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
                        setProgressMsg('');
                      }}
                      className="w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Image Preview */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-[url('https://cdn.pixabay.com/photo/2017/02/07/02/16/pattern-2044941_1280.png')] bg-repeat flex items-center justify-center relative min-h-[300px]">
                    {imageSrc && (
                      <img 
                        src={imageSrc} 
                        alt="Preview" 
                        className="max-w-full max-h-[400px] object-contain shadow-lg"
                      />
                    )}
                  </div>
                </div>

                {/* Settings Form */}
                <div className="flex-1 space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-4">
                    <Settings2 className="w-5 h-5 text-slate-400" />
                    Process Settings
                  </h3>
                  
                  <div className="space-y-6 p-6 border-2 border-slate-100 rounded-2xl bg-slate-50">
                    <div className="text-slate-600 text-sm">
                      <p className="mb-4">
                        This tool uses AI running entirely in your browser to remove the background from your image.
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Files never leave your device.</li>
                        <li>High quality cutout processing.</li>
                        <li>Initial AI model download required (~40MB).</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col items-center justify-center border-t border-slate-100 pt-8 gap-4">
                <button 
                  onClick={handleRemoveBg}
                  disabled={isProcessing}
                  className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-lg disabled:shadow-none flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Eraser className="w-5 h-5" /> 
                      Remove Background
                    </>
                  )}
                </button>
                {progressMsg && (
                  <p className="text-sm font-medium text-cyan-600 animate-pulse">{progressMsg}</p>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-cyan-200 p-6 md:p-10 mt-8 text-center shadow-sm">
          <div className="w-24 h-24 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-cyan-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Background Removed!</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Your image is ready. The background has been made transparent.</p>
          
          <div className="flex items-center justify-center mb-8">
             <div className="border border-slate-200 rounded-xl overflow-hidden bg-[url('https://cdn.pixabay.com/photo/2017/02/07/02/16/pattern-2044941_1280.png')] bg-repeat flex items-center justify-center p-4 max-w-md">
                <img 
                  src={completedFile.url} 
                  alt="Result" 
                  className="max-w-full max-h-[300px] object-contain shadow-2xl"
                />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={completedFile.url} 
              download={completedFile.name}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Download className="w-5 h-5" />
              Download PNG
            </a>
            
            <button 
              onClick={() => {
                setCompletedFile(null);
                setFile(null);
                setImageSrc('');
                setProgressMsg('');
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition w-full sm:w-auto"
            >
              Process another image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
