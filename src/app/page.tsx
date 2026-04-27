'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { 
  Merge, SplitSquareVertical, Minimize2, 
  Sparkles, Lock, FileText, FileImage, 
  Unlock, RotateCw, FileSpreadsheet, ScanLine, ArrowRight,
  Maximize, Eraser, ArrowDown, CheckCircle2, ShieldCheck,
  Star, Menu, X
} from 'lucide-react';

const toolsList = [
  { name: 'Merge PDF', desc: 'Combine multiple PDFs into one', icon: Merge, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'group-hover:border-indigo-500/50', glow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]' },
  { name: 'Split PDF', desc: 'Extract specific pages with ease', icon: SplitSquareVertical, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'group-hover:border-emerald-500/50', glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]' },
  { name: 'Compress PDF', desc: 'Shrink file size, keep quality', icon: Minimize2, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'group-hover:border-rose-500/50', glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]' },
  { name: 'PDF to Word', desc: 'Convert to editable DOCX instantly', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'group-hover:border-blue-500/50', glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]' },
  { name: 'PDF to JPG', desc: 'Export pages as images', icon: FileImage, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'group-hover:border-amber-500/50', glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]' },
  { name: 'Unlock PDF', desc: 'Remove password protection', icon: Unlock, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'group-hover:border-slate-500/50', glow: 'group-hover:shadow-[0_0_20px_rgba(148,163,184,0.2)]' },
  { name: 'Rotate PDF', desc: 'Fix orientation in seconds', icon: RotateCw, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'group-hover:border-pink-500/50', glow: 'group-hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]' },
  { name: 'Excel to PDF', desc: 'Spreadsheet to PDF, clean and fast', icon: FileSpreadsheet, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'group-hover:border-emerald-500/50', glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]' },
  { name: 'Scanner', desc: 'Turn physical docs into digital PDFs', icon: ScanLine, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'group-hover:border-orange-500/50', glow: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]' },
  { name: 'Compress Image', desc: 'Reduce image size, preserve quality', icon: Minimize2, color: 'text-lime-400', bg: 'bg-lime-500/10', border: 'group-hover:border-lime-500/50', glow: 'group-hover:shadow-[0_0_20px_rgba(132,204,22,0.2)]' },
  { name: 'Convert to WebP', desc: 'Next-gen format conversion', icon: FileImage, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'group-hover:border-sky-500/50', glow: 'group-hover:shadow-[0_0_20px_rgba(14,165,233,0.2)]' },
  { name: 'Resize Image', desc: 'Custom dimensions on demand', icon: Maximize, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'group-hover:border-teal-500/50', glow: 'group-hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]' },
  { name: 'Upscale Image', desc: 'AI-powered resolution enhancement', icon: Sparkles, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'group-hover:border-fuchsia-500/50', glow: 'group-hover:shadow-[0_0_20px_rgba(217,70,239,0.2)]' },
  { name: 'Remove Background', desc: 'On-device AI background removal', icon: Eraser, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'group-hover:border-cyan-500/50', glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]' },
];

const faqs = [
  { q: "Is DocPilot really free?", a: "Yes, completely. All 14 tools are free to use with no account required. We may introduce a Pro tier in the future for power users who need larger file sizes or batch processing — but the core toolkit stays free." },
  { q: "Do I need to create an account?", a: "No. You can use every tool on DocPilot without signing up, logging in, or giving us your email. Just open the app and get to work." },
  { q: "Is my file safe when I upload it?", a: "Absolutely. Most of our tools — including Background Removal and Image Upscaling — run entirely in your browser. Your file never leaves your device. For tools that require cloud processing, your file is encrypted in transit and permanently deleted from our servers immediately after your session ends." },
  { q: "What is Pilot AI and how does it work?", a: "Pilot AI is DocPilot's built-in document intelligence feature. You upload any PDF and ask it questions in plain English — it reads the document and gives you answers, summaries, or key extracts instantly. It's like having a smart assistant that can read a 200-page report in seconds." },
  { q: "What types of files can DocPilot handle?", a: "DocPilot handles PDFs (merge, split, compress, convert, unlock, rotate), images (JPEG, PNG, WebP — resize, compress, upscale, remove background), Excel spreadsheets (convert to PDF), and physical documents via the Scanner tool." },
  { q: "Does DocPilot work on mobile?", a: "Yes. DocPilot is fully responsive and works on any modern mobile browser — no app download needed. Just visit the site on your phone and start working." },
  { q: "What happens to my files after I'm done?", a: "For browser-processed files — nothing, because they never left your device. For cloud-processed files — they are permanently and automatically deleted from our servers at the end of your session. We do not store, analyze, or retain your documents." },
  { q: "Can I use DocPilot for sensitive or confidential documents?", a: "Yes — and we built it with exactly that use case in mind. Our privacy-first architecture means most tools never send your file anywhere. For cloud operations, deletion is automatic. That said, always use your own judgment with highly classified materials." }
];

function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { rootMargin: '50px 0px', threshold: 0.05 }
    );
    
    const el = domRef.current;
    if (el) observer.observe(el);
    
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <div 
      ref={domRef} 
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`} 
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13h8" />
                <path d="M8 17h8" />
                <path d="M10 9h4" />
              </svg>
            </div>
            <Link href="/" className="hover:opacity-90 transition-opacity">DocPilot</Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-300 text-sm">
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <Link href="/ai" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" /> Pilot AI
            </Link>
            <Link href="/tools/scanner" className="hover:text-white transition-colors">Scanner</Link>
          </div>

          {/* Mobile Nav Toggle */}
          <button 
            className="md:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#172033] border-b border-slate-800 animate-in slide-in-from-top-4 duration-200">
            <div className="px-6 py-6 flex flex-col gap-6 text-slate-300 font-medium text-lg">
              <Link href="/tools" className="hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Tools</Link>
              <Link href="/ai" className="hover:text-white flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <Sparkles className="w-5 h-5 text-blue-400" /> Pilot AI
              </Link>
              <Link href="/tools/scanner" className="hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Scanner</Link>
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold rounded-full text-sm mb-6 shadow-sm">
              <Sparkles className="w-4 h-4" />
              100% Browser-Based Processing
            </div>
            
            <h1 className="font-extrabold tracking-tight mb-6 leading-[1.1]" 
                style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
              Your PDFs Finally<br />
              Have a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Co-Pilot.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-lg">
              Merge, split, compress, convert, and chat with your PDFs — all in one place, right in your browser. No installs. No account. Just results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Link 
                href="/tools" 
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Try DocPilot Free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link 
                href="/ai" 
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white px-8 py-4 rounded-xl font-bold transition-all"
              >
                <Sparkles className="w-5 h-5 text-blue-400" />
                Chat with a PDF
              </Link>
            </div>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free to use · No account needed
            </p>
          </div>

          {/* Right Hero Visual - Fake Browser Mockup */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none perspective-1000">
            {/* Soft backdrop glow behind mockup */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl transform rotate-3 rounded-[3rem]" />
            
            <div className="relative bg-[#1E293B] border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden transform lg:rotate-[-2deg] lg:hover:rotate-0 transition-transform duration-500">
              
              {/* Browser Chrome / Header */}
              <div className="bg-[#0F172A] border-b border-slate-700/50 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="mx-auto bg-[#1E293B] text-slate-400 text-xs px-3 py-1 rounded-md flex items-center justify-center gap-2 border border-slate-700/50 w-2/3 truncate">
                  <Lock className="w-3 h-3 text-emerald-400" /> https://docpilot.app
                </div>
              </div>

              {/* Browser Content - Mini Grid */}
              <div className="p-6 bg-slate-900/50">
                <div className="mb-4">
                  <div className="h-6 w-3/4 bg-slate-800 rounded-md mb-2" />
                  <div className="h-4 w-1/2 bg-slate-800 rounded-md" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Fake Grid Items */}
                  <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Merge className="w-5 h-5" />
                    </div>
                    <div className="h-2 w-3/4 bg-slate-700 rounded" />
                    <div className="h-2 w-1/2 bg-slate-800 rounded" />
                  </div>
                  
                  <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <SplitSquareVertical className="w-5 h-5" />
                    </div>
                    <div className="h-2 w-2/3 bg-slate-700 rounded" />
                    <div className="h-2 w-full bg-slate-800 rounded" />
                  </div>

                  <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Minimize2 className="w-5 h-5" />
                    </div>
                    <div className="h-2 w-full bg-slate-700 rounded" />
                    <div className="h-2 w-2/3 bg-slate-800 rounded" />
                  </div>

                  <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 py-0.5 px-2 bg-blue-500 text-[10px] font-bold rounded-bl-lg">AI</div>
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="h-2 w-4/5 bg-slate-700 rounded" />
                    <div className="h-2 w-3/4 bg-slate-800 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TRUST BAR */}
        <div className="mt-20 md:mt-28">
          <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 md:gap-8 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <span className="text-blue-400 text-lg leading-none">✦</span> No Installation Required
            </div>
            <div className="hidden md:block w-px h-6 bg-slate-700" />
            
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <span className="text-blue-400 text-lg leading-none">✦</span> Works in Any Browser
            </div>
            <div className="hidden md:block w-px h-6 bg-slate-700" />
            
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <span className="text-blue-400 text-lg leading-none">✦</span> Privacy-First Processing
            </div>
            <div className="hidden lg:block w-px h-6 bg-slate-700" />
            
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <span className="text-blue-400 text-lg leading-none">✦</span> 14 Tools. Zero Subscriptions.
            </div>
          </div>
        </div>

        {/* PAIN SECTION */}
        <section className="mt-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-rose-400 font-bold tracking-wide uppercase text-sm mb-3">Sound Familiar?</h3>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">PDF tools are a mess. <br className="hidden md:block"/> You deserve better.</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Card 1 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500/50 to-transparent opacity-50 transition-opacity group-hover:opacity-100" />
              <div className="text-4xl mb-6">😤</div>
              <h4 className="text-xl font-bold mb-3">Tool-Hopping Madness</h4>
              <p className="text-slate-400 leading-relaxed">
                You use one site to merge, another to compress, another to convert. Every task means a new tab, a new upload, a new wait.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500/50 to-transparent opacity-50 transition-opacity group-hover:opacity-100" />
              <div className="text-4xl mb-6">🔒</div>
              <h4 className="text-xl font-bold mb-3">Your Files Uploaded... Somewhere</h4>
              <p className="text-slate-400 leading-relaxed">
                Most online tools send your documents to unknown servers. You don&apos;t know where your sensitive files end up — or who sees them.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500/50 to-transparent opacity-50 transition-opacity group-hover:opacity-100" />
              <div className="text-4xl mb-6">💸</div>
              <h4 className="text-xl font-bold mb-3">Paywalls at Every Turn</h4>
              <p className="text-slate-400 leading-relaxed">
                You need to edit one PDF and suddenly you&apos;re staring at a $12/month subscription screen. Just to rotate a page.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-12 mb-20 text-slate-600">
            <ArrowDown className="w-8 h-8 animate-bounce opacity-50" />
          </div>
        </section>

        {/* TOOLS SHOWCASE */}
        <section className="mt-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-blue-400 font-bold tracking-wide uppercase text-sm mb-3">The Full Toolkit</h3>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">14 tools. One tab. Everything handled.</h2>
            <p className="text-slate-300 text-lg">
              From simple PDF edits to AI-powered document conversations — DocPilot has the tool for the job.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {toolsList.map((tool, idx) => (
              <Link 
                key={idx} 
                href="/tools" 
                className={`group flex flex-col p-6 bg-slate-900/50 border border-slate-800 rounded-2xl transition-all duration-300 hover:bg-slate-800/80 hover:-translate-y-1 relative overflow-hidden ${tool.border} ${tool.glow}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${tool.bg} ${tool.color}`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-100 mb-2 truncate group-hover:text-white transition-colors">{tool.name}</h4>
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {tool.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* PILOT AI SPOTLIGHT */}
      <section className="relative w-full bg-gradient-to-br from-[#0F172A] via-blue-900/20 to-blue-800/30 border-y border-blue-900/50 py-24 my-16 lg:my-24 z-10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Column (Copy) */}
          <div>
            <h3 className="text-blue-400 font-bold tracking-wide uppercase text-sm mb-3">Pilot AI</h3>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">Stop Reading. <br />Start Asking.</h2>
            <p className="text-slate-300 text-lg mb-10 leading-relaxed max-w-lg">
              Upload any PDF and have a real conversation with it. Ask questions, request summaries, extract key facts — in plain English. No ctrl+F needed.
            </p>
            
            <ul className="space-y-5 mb-10 text-slate-300">
              <li className="flex items-start gap-4 text-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" /> 
                <span>Upload a 100-page report — ask for the 3 key takeaways</span>
              </li>
              <li className="flex items-start gap-4 text-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" /> 
                <span>Reading a contract? Ask &quot;What are my obligations?&quot;</span>
              </li>
              <li className="flex items-start gap-4 text-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" /> 
                <span>Studying? Ask it to quiz you on the content</span>
              </li>
              <li className="flex items-start gap-4 text-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" /> 
                <span>Research papers, invoices, legal docs — it reads so you don&apos;t have to</span>
              </li>
            </ul>

            <div className="flex flex-col gap-3">
              <Link 
                href="/ai" 
                className="inline-flex max-w-max items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Try Pilot AI Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Upload any PDF · Get answers instantly
              </p>
            </div>
          </div>

          {/* Right Column (Visual) */}
          <div className="relative max-w-lg mx-auto lg:mx-0 lg:ml-auto w-full perspective-1000">
            {/* Soft backdrop glow behind mockup */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-purple-500/20 blur-3xl transform -rotate-3 rounded-[3rem]" />
            
            <div className="relative bg-[#172033] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Fake PDF Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700/60 bg-[#1E293B]/80 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">Q3_Financial_Report.pdf</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    AI Ready
                  </div>
                </div>
              </div>

              {/* Chat Body */}
              <div className="p-6 md:p-8 space-y-6 bg-slate-900/40">
                {/* User Bubble */}
                <div className="flex flex-col items-end">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 max-w-[85%] text-[15px] shadow-sm transform transition-transform hover:-translate-y-0.5">
                    Summarize the key financial highlights
                  </div>
                </div>
                
                {/* AI Bubble */}
                <div className="flex flex-col items-start mt-2">
                  <div className="flex items-start gap-3 max-w-[90%] md:max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 text-[15px] leading-relaxed shadow-sm">
                      The report shows a <strong className="text-white">34% revenue increase</strong> in Q3, driven by a surge in enterprise software sales. Operating margins improved to 22.4%.
                      <span className="inline-block w-1.5 h-4 bg-blue-400 ml-1.5 translate-y-0.5 animate-pulse rounded-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PRIVACY BLOCK */}
      <section className="max-w-7xl mx-auto px-6 pb-24 lg:pb-32 z-10 relative">
        <div className="bg-[#0B1221] border border-emerald-900/30 rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative overflow-hidden text-center shadow-2xl">
          {/* Green glow inside the privacy block */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-emerald-500/5 blur-[100px] pointer-events-none" />
          
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5 leading-tight text-white">
            Your Files Are None of <br className="hidden md:block" />Our Business.
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
            Most PDF tools upload your documents to their servers. We don&apos;t. Here&apos;s our promise:
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left relative z-10">
            {/* Pillar 1 */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 hover:bg-slate-900/60 transition-colors">
              <div className="text-4xl mb-5">🖥️</div>
              <h4 className="text-xl font-bold mb-3 text-slate-100">On-Device Processing</h4>
              <p className="text-slate-400 leading-relaxed">
                Tools like Background Removal and Image Upscaling run entirely in your browser. Your file never leaves your device.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 hover:bg-slate-900/60 transition-colors">
              <div className="text-4xl mb-5">🔐</div>
              <h4 className="text-xl font-bold mb-3 text-slate-100">Encrypted in Transit</h4>
              <p className="text-slate-400 leading-relaxed">
                When cloud processing is needed, your file is encrypted end-to-end and permanently deleted after your session.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 hover:bg-slate-900/60 transition-colors">
              <div className="text-4xl mb-5">🚫</div>
              <h4 className="text-xl font-bold mb-3 text-slate-100">No Account Required</h4>
              <p className="text-slate-400 leading-relaxed">
                We don&apos;t ask for your email. We don&apos;t track your documents. No login, no profile, no data harvesting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <FadeInSection className="max-w-7xl mx-auto px-6 py-24 z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h3 className="text-emerald-400 font-bold tracking-wide uppercase text-sm mb-3">Simple by Design</h3>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">Three steps. That&apos;s all.</h2>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start relative mt-16 max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-0.5 bg-slate-800" />
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center w-full md:w-1/3 px-4 mb-12 md:mb-0 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-3xl mb-6 shadow-lg shadow-indigo-500/10">
              🎯
            </div>
            <h4 className="text-xl font-bold mb-3 text-white">Pick Your Tool</h4>
            <p className="text-slate-400 leading-relaxed">
              Browse 14 tools and select exactly what you need. No confusing menus.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center w-full md:w-1/3 px-4 mb-12 md:mb-0 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center text-3xl mb-6 shadow-lg shadow-blue-500/10">
              📂
            </div>
            <h4 className="text-xl font-bold mb-3 text-white">Upload Your File</h4>
            <p className="text-slate-400 leading-relaxed">
              Drag and drop or select your PDF or image. Processing starts immediately.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center w-full md:w-1/3 px-4 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl mb-6 shadow-lg shadow-emerald-500/10">
              ⬇️
            </div>
            <h4 className="text-xl font-bold mb-3 text-white">Download Your Result</h4>
            <p className="text-slate-400 leading-relaxed">
              Your processed file is ready in seconds. Download it instantly.
            </p>
          </div>
        </div>
      </FadeInSection>

      {/* TESTIMONIALS */}
      <FadeInSection className="bg-slate-900/40 border-y border-slate-800/50 py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">What People Are Saying</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#172033] border border-slate-700/50 rounded-2xl p-8 flex flex-col hover:border-slate-600 transition-colors">
              <div className="flex items-center gap-1 mb-6 text-blue-500">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-slate-300 leading-relaxed mb-8 flex-grow">
                &quot;I used to juggle 4 different websites to handle PDFs. DocPilot replaced all of them. The AI chat feature alone is worth it.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                  CO
                </div>
                <div>
                  <h5 className="font-bold text-slate-100">Chidi O.</h5>
                  <p className="text-sm text-slate-400">Legal Assistant, Lagos</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#172033] border border-slate-700/50 rounded-2xl p-8 flex flex-col hover:border-slate-600 transition-colors">
              <div className="flex items-center gap-1 mb-6 text-blue-500">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-slate-300 leading-relaxed mb-8 flex-grow">
                &quot;Finally a PDF tool that doesn&apos;t make me create an account just to compress a file. Fast, clean, and private.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center font-bold text-lg">
                  AK
                </div>
                <div>
                  <h5 className="font-bold text-slate-100">Amara K.</h5>
                  <p className="text-sm text-slate-400">Freelance Designer</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#172033] border border-slate-700/50 rounded-2xl p-8 flex flex-col hover:border-slate-600 transition-colors">
              <div className="flex items-center gap-1 mb-6 text-blue-500">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-slate-300 leading-relaxed mb-8 flex-grow">
                &quot;The background removal tool runs in my browser and it&apos;s actually good? Didn&apos;t expect that from a PDF tool.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                  TB
                </div>
                <div>
                  <h5 className="font-bold text-slate-100">Tunde B.</h5>
                  <p className="text-sm text-slate-400">Content Creator, Abuja</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* PRICING SECTION */}
      <FadeInSection className="py-24 relative z-10 bg-slate-900/20 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-emerald-400 font-bold tracking-wide uppercase text-sm mb-3">Simple Pricing</h3>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">Powerful tools. Zero cost to start.</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              DocPilot is free for everyday use. No hidden fees, no surprise paywalls mid-task.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {/* CARD 1 — Free */}
            <div className="bg-[#172033] border border-slate-700/50 rounded-2xl p-8 flex flex-col hover:border-slate-600 transition-colors">
              <div className="flex justify-center mb-6">
                <div className="inline-block px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-full">Always Free</div>
              </div>
              <div className="text-center mb-6">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-slate-400 text-lg"> / forever</span>
              </div>
              <p className="text-slate-400 text-center mb-8 h-16 md:h-20 lg:h-12 border-b border-slate-800 pb-8">
                Everything you need to handle documents like a pro — no card required.
              </p>
              
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">All 14 PDF & image tools</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Pilot AI document chat</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Scanner (physical to PDF)</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Browser-based processing</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">No account required</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Unlimited file access</span></li>
              </ul>
              
              <Link href="https://doc-pilot.netlify.app/tools" className="w-full mt-auto inline-flex justify-center items-center gap-2 border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 px-6 py-4 rounded-xl font-bold transition-all">
                Start Using DocPilot <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* CARD 2 — Pro */}
            <div className="bg-[#172033] border-2 border-blue-500 rounded-2xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(59,130,246,0.15)] z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg whitespace-nowrap">Most Popular</div>
              <div className="text-center mb-6 mt-4 md:mt-2">
                <span className="text-4xl font-extrabold">$4.99</span>
                <span className="text-slate-400 text-lg"> / month</span>
              </div>
              <p className="text-slate-400 text-center mb-8 h-16 md:h-20 lg:h-12 border-b border-slate-800 pb-8">
                For power users who live in documents. More speed, more file size, priority processing.
              </p>
              
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Everything in Free</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Larger file size limits</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Priority cloud processing</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Pilot AI with extended memory</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Batch file processing</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Early access to new tools</span></li>
              </ul>
              
              <div className="mt-auto flex flex-col items-center gap-3">
                <Link href="#" className="w-full inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25">
                  Get Pro Access <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-slate-500">Cancel anytime. No contracts.</span>
              </div>
            </div>

            {/* CARD 3 — Team */}
            <div className="bg-[#172033] border border-slate-700/50 rounded-2xl p-8 flex flex-col hover:border-slate-600 transition-colors">
              <div className="flex justify-center mb-6">
                <div className="inline-block px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-full">Team</div>
              </div>
              <div className="text-center mb-6">
                <span className="text-4xl font-extrabold">$12</span>
                <span className="text-slate-400 text-lg"> / month</span>
              </div>
              <p className="text-slate-400 text-center mb-8 h-16 md:h-20 lg:h-12 border-b border-slate-800 pb-8">
                For small teams and agencies who collaborate on documents daily.
              </p>
              
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Everything in Pro</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Up to 5 team members</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Shared workspace</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Team usage dashboard</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <span className="text-slate-300 leading-tight">Priority support</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> <span className="text-slate-400 leading-tight italic">Custom branding (coming soon)</span></li>
              </ul>
              
              <Link href="mailto:hello@docpilot.app" className="w-full mt-auto inline-flex justify-center items-center gap-2 border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-6 py-4 rounded-xl font-bold transition-all">
                Contact Us
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-12 max-w-4xl mx-auto px-4">
            <p className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-full text-sm font-medium w-full sm:w-auto justify-center">
              <ShieldCheck className="w-5 h-5" />
              All plans include privacy-first processing. We never sell your data. Ever.
            </p>
          </div>
        </div>
      </FadeInSection>

      {/* FAQ SECTION */}
      <FadeInSection className="max-w-4xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-emerald-400 font-bold tracking-wide uppercase text-sm mb-3">Got Questions?</h3>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">Everything you need to know.</h2>
          <p className="text-xl text-slate-300">
            If it&apos;s not here, just try the app — you&apos;ll figure it out in 30 seconds.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isActive = activeFaq === index;
            return (
              <div 
                key={index} 
                className={`bg-[#172033] border rounded-xl overflow-hidden transition-all duration-300 ${isActive ? 'border-l-4 border-slate-700/50 border-l-blue-500 bg-[#1A263D]' : 'border-slate-700/50 hover:border-slate-600'}`}
              >
                <button 
                  onClick={() => setActiveFaq(isActive ? null : index)}
                  className="flex items-center justify-between w-full px-6 py-5 text-left"
                  aria-expanded={isActive}
                >
                  <span className="text-lg font-bold text-slate-100 pr-4">{faq.q}</span>
                  <div className={`transform transition-transform duration-300 shrink-0 ${isActive ? 'rotate-180' : ''}`}>
                    <ArrowDown className="w-5 h-5 text-slate-400" />
                  </div>
                </button>
                <div 
                  className="grid transition-all duration-300 ease-in-out" 
                  style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="mailto:hello@docpilot.app" className="text-slate-400 hover:text-blue-400 transition-colors inline-block font-medium">
            Still have questions? → hello@docpilot.app
          </Link>
        </div>
      </FadeInSection>

      {/* FINAL CTA BANNER */}
      <FadeInSection className="px-6 py-24 relative z-10">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 rounded-[2.5rem] p-10 md:p-16 lg:p-20 text-center shadow-2xl relative overflow-hidden">
          {/* Decorational shapes */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-white/10 blur-3xl transform rotate-12" />
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white relative z-10 leading-tight">
            Your PDFs are waiting for a <br className="hidden md:block"/> co-pilot.
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 relative z-10">
            Join thousands of users who&apos;ve ditched the tab-juggling and document chaos.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Link 
              href="https://doc-pilot.netlify.app/" 
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-slate-50 px-8 py-5 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg relative z-10"
            >
              Open DocPilot Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-blue-200 flex items-center justify-center gap-2 relative z-10 font-medium">
              <ShieldCheck className="w-4 h-4" /> No credit card. No catch.
            </p>
          </div>
        </div>
      </FadeInSection>

      {/* FOOTER */}
      <footer className="bg-[#0B1221] pt-16 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 items-center justify-between mb-12">
            {/* Left */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="text-2xl font-black tracking-tight flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M8 13h8" />
                    <path d="M8 17h8" />
                    <path d="M10 9h4" />
                  </svg>
                </div>
                DocPilot
              </div>
              <p className="text-slate-400 text-sm">Smart PDF Toolkit</p>
            </div>
            
            {/* Center */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-medium text-slate-300">
              <Link href="/tools" className="hover:text-blue-400 transition-colors">Tools</Link>
              <Link href="/ai" className="hover:text-blue-400 transition-colors">Pilot AI</Link>
              <Link href="/tools/scanner" className="hover:text-blue-400 transition-colors">Scanner</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">Privacy</Link>
            </div>
            
            {/* Right */}
            <div className="text-center md:text-right text-slate-400 text-sm flex flex-col items-center md:items-end">
              <p className="flex items-center gap-1.5">
                Built with <span className="text-rose-500">❤️</span> for document
              </p>
              <p>workers everywhere</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800/80 text-center text-slate-500 text-sm">
            © 2025 DocPilot. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
