'use client';

import { useState, useRef, useEffect } from 'react';
import { FileUpload } from '@/components/ui/FileUpload';
import { ArrowLeft, PenTool, CheckCircle2, Download, Settings2, Trash2, Eraser } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PDFDocument } from 'pdf-lib';

export default function SignPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedFile, setCompletedFile] = useState<{ url: string, name: string } | null>(null);
  
  const [totalPages, setTotalPages] = useState<number>(0);
  const [targetPage, setTargetPage] = useState<number>(1);

  // Canvas ref for drawing the signature
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Support for both mouse and touch events
    let clientX = 0;
    let clientY = 0;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault(); // Prevent scrolling on touch
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let clientX = 0;
    let clientY = 0;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // Initialize canvas context settings
  useEffect(() => {
    if (file && !completedFile) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
        }
      }
    }
  }, [file, completedFile]);

  const handleFilesAccepted = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setCompletedFile(null);
      setHasSignature(false);
      
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        setTotalPages(doc.getPageCount());
      } catch (error) {
        console.error("Error loading PDF to count pages:", error);
      }
    }
  };

  const handleSign = async () => {
    if (!file || !hasSignature) {
      alert("Please upload a PDF and draw your signature.");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsProcessing(true);
    
    try {
      // 1. Get png from canvas
      const signatureDataUrl = canvas.toDataURL('image/png');
      const sigBytes = await fetch(signatureDataUrl).then(res => res.arrayBuffer());

      // 2. Load PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // 3. Embed the signature image
      const signatureImage = await pdfDoc.embedPng(sigBytes);
      
      // 4. Get target page (0-indexed)
      const pageIndex = Math.max(0, Math.min(targetPage - 1, pdfDoc.getPageCount() - 1));
      const page = pdfDoc.getPage(pageIndex);
      
      // Calculate placement: Let's place it at the bottom right corner by default
      const { width, height } = page.getSize();
      
      // Scale signature if it's too big, typical signature box size
      const maxSigWidth = 200;
      const scaleFactor = Math.min(1, maxSigWidth / signatureImage.width);
      
      const sigDisplayWidth = signatureImage.width * scaleFactor;
      const sigDisplayHeight = signatureImage.height * scaleFactor;
      
      // Bottom right coordinates with some padding
      const x = width - sigDisplayWidth - 40;
      const y = 50; 
      
      page.drawImage(signatureImage, {
        x,
        y,
        width: sigDisplayWidth,
        height: sigDisplayHeight,
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const baseName = file.name.replace('.pdf', '');
      setCompletedFile({
        url,
        name: `${baseName}_signed.pdf`
      });

    } catch (error) {
      console.error("Error signing PDF:", error);
      alert("An error occurred while signing the PDF.");
    } finally {
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
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 content-center shadow-inner">
          <PenTool className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Sign PDF
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
          Draw your signature and instantly append it to your PDF document securely.
        </p>
      </div>

      {!completedFile ? (
        <>
          {!file ? (
            <FileUpload 
              onFilesAccepted={handleFilesAccepted} 
              accept={{ 'application/pdf': ['.pdf'] }} 
              maxFiles={1} 
              multiple={false} 
            />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 mt-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8">
                {/* File Info */}
                <div className="flex-1 space-y-4">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center justify-between">
                    Selected File
                  </h3>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                        <span className="font-bold text-[10px] uppercase">PDF</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{totalPages} pages</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFile(null)}
                      className="w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Signature Form */}
                <div className="flex-[1.5] space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-4">
                    <Settings2 className="w-5 h-5 text-slate-400" />
                    Signature Options
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Target Page Selector */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Apply to Page</label>
                      <select 
                        value={targetPage}
                        onChange={(e) => setTargetPage(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm bg-white"
                      >
                        {Array.from({ length: totalPages }, (_, i) => (
                          <option key={i + 1} value={i + 1}>Page {i + 1}</option>
                        ))}
                      </select>
                    </div>

                    {/* Signature Canvas */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-700">Draw Signature</label>
                        {hasSignature && (
                          <button 
                            onClick={clearSignature}
                            className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                          >
                            <Eraser className="w-3 h-3" /> Clear
                          </button>
                        )}
                      </div>
                      <div className="border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-slate-50 relative cursor-crosshair">
                        <canvas
                          ref={canvasRef}
                          width={400}
                          height={150}
                          className="w-full h-[150px] touch-none"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                        />
                        {!hasSignature && (
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <span className="text-slate-300 font-medium text-xl select-none">Sign Here</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Your signature will be placed at the bottom right corner of the selected page.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center border-t border-slate-100 pt-8">
                <button 
                  onClick={handleSign}
                  disabled={isProcessing || !hasSignature}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-lg disabled:shadow-none flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <PenTool className="w-5 h-5" /> 
                      Apply Signature
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-indigo-200 p-6 md:p-10 mt-8 text-center shadow-sm">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Document Signed!</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Your signature has been successfully applied to the document.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={completedFile.url} 
              download={completedFile.name}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Download className="w-5 h-5" />
              Download Signed PDF
            </a>
            
            <button 
              onClick={() => {
                setCompletedFile(null);
                setFile(null);
                setHasSignature(false);
                setTargetPage(1);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition w-full sm:w-auto"
            >
              Sign another file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
