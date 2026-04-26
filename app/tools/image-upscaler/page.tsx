'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/ui/FileUpload';
import { ArrowLeft, Settings2, Download, Trash2, CheckCircle2, Sparkles, FileImage } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import * as tf from '@tensorflow/tfjs';

export default function ImageUpscalerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [enhanceAmount, setEnhanceAmount] = useState<'2x' | '4x'>('2x');
  
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

  const handleUpscale = async () => {
    if (!file || !imageSrc) return;
    
    setIsProcessing(true);
    setProgressMsg('Loading AI model (upscaler engine)...');
    
    try {
      // Need to make sure tf is ready
      await tf.ready();
      
      // Load upscale dynamic
      const Upscaler = (await import('upscaler')).default;
      
      let scale = 2;
      setProgressMsg('Initializing upscale model...');
      
      const upscaler = new Upscaler();
      
      setProgressMsg('Upscaling image... (this is computationally heavy and may take some time)');
      
      const upscaledImageBase64 = await upscaler.upscale(imageSrc);
      
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      
      setCompletedFile({
        url: upscaledImageBase64,
        name: `${baseName}_upscaled.png`
      });
      
    } catch (error) {
      console.error("Error upscaling:", error);
      alert("An error occurred while upscaling the image. Note that large images may run out of memory in the browser.");
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
        <div className="w-16 h-16 bg-fuchsia-100 text-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-4 content-center shadow-inner">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          AI Image Upscaler
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
          Enhance and increase the resolution of your images using AI running locally in your browser.
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
                      <div className="w-10 h-10 rounded-lg bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center shrink-0">
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
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center relative min-h-[300px]">
                    {imageSrc && (
                      <img 
                        src={imageSrc} 
                        alt="Preview" 
                        className="max-w-full max-h-[400px] object-contain shadow-sm"
                      />
                    )}
                  </div>
                </div>

                {/* Settings Form */}
                <div className="flex-1 space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-4">
                    <Settings2 className="w-5 h-5 text-slate-400" />
                    Upscale Settings
                  </h3>
                  
                  <div className="space-y-6 p-6 border-2 border-slate-100 rounded-2xl bg-slate-50">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Scale Amount</label>
                      <div className="flex gap-3">
                        <label className={cn(
                          "flex-1 relative flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all",
                          enhanceAmount === '2x' 
                            ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700 font-bold ring-1 ring-fuchsia-600" 
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        )}>
                          <input 
                            type="radio" 
                            name="scale" 
                            value="2x" 
                            checked={enhanceAmount === '2x'}
                            onChange={(e) => setEnhanceAmount('2x')}
                            className="sr-only"
                          />
                          2x Upscale
                        </label>
                        <label className={cn(
                          "flex-1 relative flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all opacity-50",
                          // Only 2x is supported by default model easily without additional imports right now
                          enhanceAmount === '4x' 
                            ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700 font-bold ring-1 ring-fuchsia-600" 
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        )}>
                          <input 
                            type="radio" 
                            name="scale" 
                            value="4x" 
                            disabled 
                            onChange={(e) => setEnhanceAmount('4x')}
                            className="sr-only"
                          />
                          4x (Pro)
                        </label>
                      </div>
                    </div>

                    <div className="text-slate-600 text-sm mt-6 pt-6 border-t border-slate-200">
                      <p className="mb-4">
                        This tool runs an AI super-resolution model right in your browser (TensorFlow.js).
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-xs">
                        <li>Maximum recommended size: 500x500. Large images may cause browser to crash.</li>
                        <li>Models are downloaded on first use.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col items-center justify-center border-t border-slate-100 pt-8 gap-4">
                <button 
                  onClick={handleUpscale}
                  disabled={isProcessing}
                  className="bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-lg disabled:shadow-none flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Upscaling...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" /> 
                      Upscale Image
                    </>
                  )}
                </button>
                {progressMsg && (
                  <p className="text-sm font-medium text-fuchsia-600 animate-pulse">{progressMsg}</p>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-fuchsia-200 p-6 md:p-10 mt-8 text-center shadow-sm">
          <div className="w-24 h-24 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-fuchsia-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Image Enhanced!</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Your image has been successfully upscaled.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={completedFile.url} 
              download={completedFile.name}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Download className="w-5 h-5" />
              Download Result
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
              Enhance another image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
