'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUpload } from '@/components/ui/FileUpload';
import { ArrowLeft, SplitSquareVertical, CheckCircle2, Download, Settings2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import JSZip from 'jszip';

type SplitMethod = 'extract' | 'burst';

export default function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedBundle, setCompletedBundle] = useState<{ url: string, name: string, isZip: boolean } | null>(null);
  
  const [method, setMethod] = useState<SplitMethod>('extract');
  const [customRange, setCustomRange] = useState(''); // e.g. "1-5, 8, 11-13"

  const handleFilesAccepted = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setCompletedBundle(null);
      setIsProcessing(true);
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        setPdfDoc(doc);
        setTotalPages(doc.getPageCount());
      } catch (error) {
        console.error("Error loading PDF:", error);
        alert("Could not load the PDF file. Please try another.");
        setFile(null);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const parseRange = (rangeText: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeText.split(',').map(p => p.trim());
    
    for (const part of parts) {
      if (!part) continue;
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= maxPages) pages.add(i);
          }
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num) && num >= 1 && num <= maxPages) {
          pages.add(num);
        }
      }
    }
    
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!pdfDoc || !file) return;
    setIsProcessing(true);
    
    try {
      if (method === 'extract') {
        // Build one new PDF with requested pages
        let pagesToKeep: number[] = [];
        if (!customRange.trim()) {
           // If empty, extract all
           pagesToKeep = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
           pagesToKeep = parseRange(customRange, totalPages);
        }

        if (pagesToKeep.length === 0) {
          alert('No valid pages selected.');
          setIsProcessing(false);
          return;
        }

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, pagesToKeep.map(p => p - 1));
        copiedPages.forEach((page) => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const baseName = file.name.replace('.pdf', '');
        setCompletedBundle({
          url,
          name: `${baseName}_extracted.pdf`,
          isZip: false
        });

      } else {
        // Burst: extract each page into a separate PDF, zip them
        const zip = new JSZip();
        const baseName = file.name.replace('.pdf', '');

        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
          newPdf.addPage(copiedPage);
          const pdfBytes = await newPdf.save();
          zip.file(`${baseName}_page_${i + 1}.pdf`, pdfBytes);
        }

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        
        setCompletedBundle({
          url,
          name: `${baseName}_split.zip`,
          isZip: true
        });
      }

    } catch (error) {
      console.error("Error splitting PDF:", error);
      alert("An error occurred while splitting the PDF.");
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
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 content-center shadow-inner">
          <SplitSquareVertical className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Split PDF
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
          Extract specific pages into a new PDF or split each page into separate files instantly.
        </p>
      </div>

      {!completedBundle ? (
        <>
          {!file || totalPages === 0 ? (
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
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <span className="font-bold text-[10px] uppercase">PDF</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{totalPages} pages</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setFile(null);
                        setPdfDoc(null);
                        setTotalPages(0);
                      }}
                      className="w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Split Options */}
                <div className="flex-[1.5] space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-4">
                    <Settings2 className="w-5 h-5 text-slate-400" />
                    Splitting Method
                  </h3>
                  
                  <div className="space-y-3">
                    <label 
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        method === 'extract' ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:border-slate-300 bg-white"
                      )}
                    >
                      <input 
                        type="radio" 
                        name="method"
                        checked={method === 'extract'}
                        onChange={() => setMethod('extract')}
                        className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">Extract Pages</div>
                        <div className="text-sm text-slate-500">Pick which pages you want to keep in a new PDF document.</div>
                        
                        {method === 'extract' && (
                          <div className="mt-3">
                            <input 
                              type="text"
                              value={customRange}
                              onChange={(e) => setCustomRange(e.target.value)}
                              placeholder={`e.g. 1-5, 8, 11-${totalPages}`}
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                            <p className="text-xs text-slate-400 mt-1">Leave empty to extract all pages into a new file.</p>
                          </div>
                        )}
                      </div>
                    </label>

                    <label 
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        method === 'burst' ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:border-slate-300 bg-white"
                      )}
                    >
                      <input 
                        type="radio" 
                        name="method"
                        checked={method === 'burst'}
                        onChange={() => setMethod('burst')}
                        className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">Extract All Pages (Burst)</div>
                        <div className="text-sm text-slate-500">Convert each page into a separate PDF file. Downloaded as a ZIP archive.</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <button 
                  onClick={handleSplit}
                  disabled={isProcessing}
                  className="bg-black hover:bg-slate-800 disabled:bg-slate-300 text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-lg disabled:shadow-none flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <SplitSquareVertical className="w-5 h-5" /> 
                      Split PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-emerald-200 p-6 md:p-10 mt-8 text-center shadow-lg shadow-emerald-100/50">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">PDF split successfully!</h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a 
              href={completedBundle.url} 
              download={completedBundle.name}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Download className="w-5 h-5" />
              Download {completedBundle.isZip ? 'ZIP Archive' : 'PDF Document'}
            </a>
            
            <button 
              onClick={() => {
                setCompletedBundle(null);
                setFile(null);
                setPdfDoc(null);
                setTotalPages(0);
                setCustomRange('');
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition w-full sm:w-auto"
            >
              Split another file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
