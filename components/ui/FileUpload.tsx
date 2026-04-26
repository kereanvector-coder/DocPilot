'use client';

import React, { useCallback } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { UploadCloud, File, X, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesAccepted: (files: File[]) => void;
  accept?: DropzoneOptions['accept'];
  maxFiles?: number;
  multiple?: boolean;
}

export function FileUpload({ onFilesAccepted, accept, maxFiles, multiple = true }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesAccepted(acceptedFiles);
    }
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    multiple
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "cursor-pointer w-full p-12 mt-4 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-200 bg-white shadow-sm",
        isDragActive 
          ? "border-blue-500 bg-blue-50/50 scale-[1.02]" 
          : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
      )}
    >
      <input {...getInputProps()} />
      <div className={cn(
        "w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors",
        isDragActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
      )}>
        <FileUp className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">
        {isDragActive ? 'Drop them here!' : 'Select PDF files'}
      </h3>
      <p className="text-slate-500 text-center max-w-md">
        or drag and drop them here.
      </p>
      <button 
        type="button" 
        className="mt-6 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition"
      >
        Select PDF files
      </button>
    </div>
  );
}
