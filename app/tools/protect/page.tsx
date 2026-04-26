'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/ui/FileUpload';
import { ArrowLeft, Lock, CheckCircle2, Download, Settings2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt';
import { PDFDocument } from 'pdf-lib';

export default function ProtectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedFile, setCompletedFile] = useState<{ url: string, name: string } | null>(null);
  
  const [password, setPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');

  const handleFilesAccepted = async (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setCompletedFile(null);
    }
  };

  const handleProtect = async () => {
    if (!file || !password.trim()) {
      alert('Please provide a file and a user password.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      
      const options: any = {};
      if (ownerPassword.trim()) {
        options.ownerPassword = ownerPassword.trim();
      }

      // Encrypt PDF using @pdfsmaller/pdf-encrypt
      const encryptedBytes = await encryptPDF(pdfBytes, password.trim(), options);
      
      const blob = new Blob([encryptedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const baseName = file.name.replace('.pdf', '');
      setCompletedFile({
        url,
        name: `${baseName}_protected.pdf`
      });

    } catch (error) {
      console.error("Error protecting PDF:", error);
      alert("An error occurred while protecting the PDF. Make sure it isn't already encrypted.");
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
        <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 content-center shadow-inner">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Protect PDF
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
          Secure your PDF document with a strong password utilizing AES-256 encryption.
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
                      <div className="w-10 h-10 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                        <span className="font-bold text-[10px] uppercase">PDF</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setFile(null);
                        setPassword('');
                        setOwnerPassword('');
                      }}
                      className="w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Encryption Form */}
                <div className="flex-[1.5] space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-4">
                    <Settings2 className="w-5 h-5 text-slate-400" />
                    Security Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Document Password <span className="text-red-500">*</span></label>
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Required to open the PDF"
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Permissions Password <span className="text-xs text-slate-400 font-normal">(Optional)</span></label>
                      <input 
                        type="password"
                        value={ownerPassword}
                        onChange={(e) => setOwnerPassword(e.target.value)}
                        placeholder="Required to restrict editing/printing"
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all shadow-sm"
                      />
                      <p className="text-xs text-slate-500 mt-2">Setting an owner password prevents users from modifying or printing the document without authorization.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center border-t border-slate-100 pt-8">
                <button 
                  onClick={handleProtect}
                  disabled={isProcessing || !password.trim()}
                  className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-lg disabled:shadow-none flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>Encrypting...</>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" /> 
                      Protect PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 mt-8 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-slate-900" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">PDF Protected!</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Your document has been encrypted and secured with your password.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={completedFile.url} 
              download={completedFile.name}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Download className="w-5 h-5" />
              Download Protected PDF
            </a>
            
            <button 
              onClick={() => {
                setCompletedFile(null);
                setFile(null);
                setPassword('');
                setOwnerPassword('');
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition w-full sm:w-auto"
            >
              Protect another file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
