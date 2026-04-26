'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUpload } from '@/components/ui/FileUpload';
import { ArrowLeft, GripVertical, Trash2, Merge, Download, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);

  const handleFilesAccepted = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setMergedBlobUrl(null);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setMergedBlobUrl(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index - 1];
    newFiles[index - 1] = newFiles[index];
    newFiles[index] = temp;
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsMerging(true);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedBlobUrl(url);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("An error occurred while merging the PDFs. Ensure they are valid, unencrypted PDF files.");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <Link href="/tools" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tools
      </Link>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Merge PDF</h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
          Combine PDFs in the order you want with the easiest PDF merger available.
        </p>
      </div>

      {!mergedBlobUrl ? (
        <>
          <FileUpload 
            onFilesAccepted={handleFilesAccepted} 
            accept={{ 'application/pdf': ['.pdf'] }} 
            multiple={true} 
          />
          
          {files.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 mt-8 shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                <span>Selected Files ({files.length})</span>
              </h3>
              
              <ul className="space-y-3 mb-8">
                {files.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200 hover:shadow-sm transition group">
                    <button onClick={() => moveUp(index)} disabled={index === 0} className="text-slate-300 hover:text-slate-600 disabled:opacity-30">
                      <GripVertical className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <span className="font-bold text-xs uppercase">PDF</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                      onClick={() => removeFile(index)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex justify-center">
                <button
                  onClick={handleMerge}
                  disabled={files.length < 2 || isMerging}
                  className="bg-black hover:bg-slate-800 disabled:bg-slate-300 text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-lg disabled:shadow-none flex items-center gap-2"
                >
                  {isMerging ? (
                    <>Merging...</>
                  ) : (
                    <>
                      <Merge className="w-5 h-5" /> 
                      Merge PDFs
                    </>
                  )}
                </button>
              </div>
              {files.length < 2 && (
                <p className="text-center text-sm text-slate-500 mt-3">Select at least 2 files to merge.</p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 md:p-12 mt-8 text-center shadow-lg shadow-emerald-100/50">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">PDFs merged successfully!</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Your files have been combined into a single PDF document.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={mergedBlobUrl} 
              download="merged_document.pdf"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Download className="w-5 h-5" />
              Download merged PDF
            </a>
            <button 
              onClick={() => {
                setFiles([]);
                setMergedBlobUrl(null);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition w-full sm:w-auto"
            >
              Merge more files
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
