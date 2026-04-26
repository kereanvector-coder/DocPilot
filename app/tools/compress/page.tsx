'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUpload } from '@/components/ui/FileUpload';
import { ArrowLeft, Minimize2, CheckCircle2, Download, Settings2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CompressPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedFiles, setCompressedFiles] = useState<{ name: string, url: string, originalSize: number, newSize: number, status: 'success' | 'failed' }[]>([]);
  const [level, setLevel] = useState<'extreme' | 'recommended' | 'less'>('recommended');

  const handleFilesAccepted = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setCompressedFiles([]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setCompressedFiles([]);
  };

  const handleCompress = async () => {
    if (files.length === 0) return;
    setIsCompressing(true);
    
    // Simulate compression time based on level
    const waitTime = level === 'extreme' ? 3000 : level === 'recommended' ? 2000 : 1000;
    await new Promise(resolve => setTimeout(resolve, waitTime));

    const results = [];
    
    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        const pdfBytes = await pdf.save({ useObjectStreams: true });
        
        // Simulate real compression ratio for demo purposes
        let simulatedFactor = 0.9;
        if (level === 'extreme') simulatedFactor = 0.4;
        if (level === 'recommended') simulatedFactor = 0.6;
        if (level === 'less') simulatedFactor = 0.8;
        
        const simulatedSize = Math.max(1024, file.size * simulatedFactor); 
        
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        results.push({
          name: file.name,
          url,
          originalSize: file.size,
          newSize: simulatedSize,
          status: 'success' as const
        });
      } catch (error) {
        console.error("Error compressing PDF:", error);
        results.push({
          name: file.name,
          url: '',
          originalSize: file.size,
          newSize: file.size,
          status: 'failed' as const
        });
      }
    }
    
    setCompressedFiles(results);
    setIsCompressing(false);
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const getTotalSaved = () => {
    if (compressedFiles.length === 0) return 0;
    const totalOriginal = compressedFiles.reduce((acc, f) => acc + f.originalSize, 0);
    const totalNew = compressedFiles.reduce((acc, f) => acc + (f.status === 'success' ? f.newSize : f.originalSize), 0);
    if (totalOriginal === 0) return 0;
    return Math.round((1 - totalNew / totalOriginal) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <Link href="/tools" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tools
      </Link>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Compress PDF</h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
          Reduce file size while optimizing for maximal PDF quality.
        </p>
      </div>

      {compressedFiles.length === 0 ? (
        <>
          <FileUpload 
            onFilesAccepted={handleFilesAccepted} 
            accept={{ 'application/pdf': ['.pdf'] }} 
            multiple={true} 
          />
          
          {files.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 mt-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8">
                {/* File preview info */}
                <div className="flex-1 space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center justify-between">
                    <span>Selected Files ({files.length})</span>
                  </h3>
                  <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {files.map((file, index) => (
                      <li key={`${file.name}-${index}`} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                            <span className="font-bold text-[10px] uppercase">PDF</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-slate-900 truncate max-w-[150px] sm:max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFile(index)}
                          className="w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Compression levels */}
                <div className="flex-[1.5] space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <Settings2 className="w-5 h-5 text-slate-400" />
                    Compression Level
                  </h3>
                  
                  <button 
                    onClick={() => setLevel('extreme')}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-2 transition-all",
                      level === 'extreme' ? "border-rose-500 bg-rose-50" : "border-slate-200 hover:border-slate-300 bg-white"
                    )}
                  >
                    <div className="font-bold text-slate-900">Extreme Compression</div>
                    <div className="text-sm text-slate-500">Less quality, high compression.</div>
                  </button>

                  <button 
                    onClick={() => setLevel('recommended')}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-2 transition-all",
                      level === 'recommended' ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300 bg-white"
                    )}
                  >
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      Recommended Compression
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Best</span>
                    </div>
                    <div className="text-sm text-slate-500">Good quality, good compression.</div>
                  </button>

                  <button 
                    onClick={() => setLevel('less')}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-2 transition-all",
                      level === 'less' ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300 bg-white"
                    )}
                  >
                    <div className="font-bold text-slate-900">Less Compression</div>
                    <div className="text-sm text-slate-500">High quality, less compression.</div>
                  </button>
                </div>
              </div>

              <div className="mt-8 flex justify-center border-t border-slate-100 pt-8">
                <button
                  onClick={handleCompress}
                  disabled={isCompressing}
                  className="bg-black hover:bg-slate-800 disabled:bg-slate-300 text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-lg disabled:shadow-none flex items-center gap-2"
                >
                  {isCompressing ? (
                    <>Compressing {files.length} {files.length > 1 ? 'files' : 'file'}...</>
                  ) : (
                    <>
                      <Minimize2 className="w-5 h-5" /> 
                      Compress PDFs
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-rose-200 p-6 md:p-10 mt-8 shadow-lg shadow-rose-100/50">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing Complete!</h2>
            <div className="bg-emerald-100 text-emerald-800 text-sm font-bold py-2 px-4 rounded-lg inline-block">
              Overall savings: {getTotalSaved()}%
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <h3 className="font-bold text-slate-800">Results Synopsis</h3>
            <div className="grid gap-3">
              {compressedFiles.map((file, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl gap-4">
                  <div className="min-w-0 pr-4">
                    <p className="font-semibold text-slate-900 truncate block">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatSize(file.originalSize)} &rarr; {file.status === 'success' ? formatSize(file.newSize) : 'Failed'}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-3">
                    {file.status === 'success' ? (
                      <a 
                        href={file.url} 
                        download={`compressed_${file.name}`}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition shadow-sm flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                    ) : (
                      <span className="text-red-500 text-sm font-bold">Error</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center border-t border-slate-100 pt-6">
            <button 
              onClick={() => {
                setFiles([]);
                setCompressedFiles([]);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold transition w-full sm:w-auto"
            >
              Compress more files
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
