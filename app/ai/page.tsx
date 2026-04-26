'use client';

import { useState, useRef, useEffect } from 'react';
import { FileUpload } from '@/components/ui/FileUpload';
import { extractTextFromPdf } from '@/lib/pdfTextExtractor';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Send, FileText, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiChatPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleFileAccepted = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setIsExtracting(true);
    
    try {
      const text = await extractTextFromPdf(selectedFile);
      setPdfText(text);
      setMessages([
        {
          role: 'assistant',
          content: `I've read "${selectedFile.name}". What would you like to know about it? I can summarize it, finding specific information, or translate parts of it.`
        }
      ]);
    } catch (error) {
      alert("Failed to extract text from PDF. Please try a different file.");
      setFile(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPdfText('');
    setMessages([]);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const prompt = `
        You are DocPilot AI Assistant. You are helping the user with a document they uploaded.
        Here is the document context:
        ---
        ${pdfText.substring(0, 50000)} // Limiting size to avoid exceeding context window unexpectedly
        ---
        Based on the document context above, answer the final user question: ${userMsg}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt
      });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.text || "I couldn't generate a response." 
      }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I encountered an error. Please make sure the Gemini API key is configured properly." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!file) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-4 shadow-sm border border-blue-200">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Chat with PDF</h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            Upload a document and let our AI read it for you. Ask questions, get summaries, and find information instantly.
          </p>
        </div>

        <FileUpload 
          onFilesAccepted={handleFileAccepted} 
          accept={{ 'application/pdf': ['.pdf'] }} 
          maxFiles={1} 
          multiple={false}
        />
        
        {isExtracting && (
          <div className="mt-8 flex flex-col items-center justify-center p-8 text-blue-600">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-medium animate-pulse">Reading document...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-slate-900 rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="p-6 bg-slate-800/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/tools" className="text-slate-400 hover:text-white md:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0 animate-pulse-slow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-white truncate text-sm leading-tight">Pilot AI</h2>
            <p className="text-[10px] text-blue-400 font-medium uppercase truncate">Analyzing: {file.name}</p>
          </div>
        </div>
        <button 
          onClick={handleReset}
          className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">New Document</span>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((message, i) => (
          <div 
            key={i} 
            className={cn(
              "flex flex-col",
              message.role === 'user' ? "items-end" : "items-start"
            )}
          >
            <div className={cn(
              "p-3 sm:px-5 sm:py-4 rounded-2xl text-[13px] sm:text-sm leading-relaxed max-w-[95%] sm:max-w-[85%]",
              message.role === 'user' 
                ? "bg-blue-600 text-white rounded-tr-sm" 
                : "bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-sm whitespace-pre-wrap shadow-sm"
            )}>
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col items-start">
             <div className="bg-slate-800 border border-slate-700/50 p-4 rounded-2xl rounded-tl-sm shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Drafting response...</span>
              </div>
              <div className="space-y-3 opacity-40 w-48 sm:w-64">
                <div className="h-2 bg-slate-600 rounded w-full"></div>
                <div className="h-2 bg-slate-600 rounded w-5/6"></div>
                <div className="h-2 bg-slate-600 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-slate-800 shrink-0 bg-slate-900">
        <form onSubmit={sendMessage} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your PDF..."
            className="w-full bg-slate-800 border border-slate-700/50 rounded-xl py-3 sm:py-4 pl-4 pr-14 text-[16px] sm:text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 rounded-lg text-white transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
