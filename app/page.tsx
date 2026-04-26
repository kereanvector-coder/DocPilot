import Link from 'next/link';
import { 
  FileText, Merge, SplitSquareVertical, Minimize2, 
  FileImage, Type, Sparkles, ScanLine, Lock, Unlock,
  RotateCw, FileOutput, FileSpreadsheet
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tools = [
  {
    title: 'Merge PDF',
    description: 'Combine multiple PDFs into one unified document.',
    icon: Merge,
    href: '/tools/merge',
    color: 'bg-indigo-100 text-indigo-600',
    hover: 'hover:border-indigo-200 hover:shadow-indigo-100'
  },
  {
    title: 'Split PDF',
    description: 'Separate one page or a whole set for easy conversion.',
    icon: SplitSquareVertical,
    href: '/tools/split',
    color: 'bg-emerald-100 text-emerald-600',
    hover: 'hover:border-emerald-200 hover:shadow-emerald-100'
  },
  {
    title: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality.',
    icon: Minimize2,
    href: '/tools/compress',
    color: 'bg-rose-100 text-rose-600',
    hover: 'hover:border-rose-200 hover:shadow-rose-100'
  },
  {
    title: 'PDF to Word',
    description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.',
    icon: FileOutput,
    href: '/tools/pdf-to-word',
    color: 'bg-blue-100 text-blue-600',
    hover: 'hover:border-blue-200 hover:shadow-blue-100'
  },
  {
    title: 'Scanner',
    description: 'Convert physical documents into digital PDFs instantly.',
    icon: ScanLine,
    href: '/tools/scanner',
    color: 'bg-amber-100 text-amber-600',
    hover: 'hover:border-amber-200 hover:shadow-amber-100'
  },
  {
    title: 'Unlock PDF',
    description: 'Remove PDF password security, giving you the freedom to use your PDFs.',
    icon: Unlock,
    href: '/tools/unlock',
    color: 'bg-slate-200 text-slate-700',
    hover: 'hover:border-slate-300 hover:shadow-slate-200'
  },
  {
    title: 'Rotate PDF',
    description: 'Rotate your PDFs the way you need them.',
    icon: RotateCw,
    href: '/tools/rotate',
    color: 'bg-pink-100 text-pink-600',
    hover: 'hover:border-pink-200 hover:shadow-pink-100'
  },
  {
    title: 'PDF to JPG',
    description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
    icon: FileImage,
    href: '/tools/pdf-to-jpg',
    color: 'bg-amber-100 text-amber-600',
    hover: 'hover:border-amber-200 hover:shadow-amber-100'
  },
  {
    title: 'Excel to PDF',
    description: 'Easily convert your Excel spreadsheets into PDF documents.',
    icon: FileSpreadsheet,
    href: '/tools/excel-to-pdf',
    color: 'bg-emerald-100 text-emerald-600',
    hover: 'hover:border-emerald-200 hover:shadow-emerald-100'
  },
  {
    title: 'Compress Image',
    description: 'Reduce image file size with optimal quality preservation.',
    icon: FileImage,
    href: '/tools/image-compress',
    color: 'bg-lime-100 text-lime-600',
    hover: 'hover:border-lime-200 hover:shadow-lime-100'
  },
  {
    title: 'Convert to WebP',
    description: 'Convert PNG and JPEG images to next-gen WebP format.',
    icon: FileImage,
    href: '/tools/image-to-webp',
    color: 'bg-sky-100 text-sky-600',
    hover: 'hover:border-sky-200 hover:shadow-sky-100'
  },
  {
    title: 'Resize Image',
    description: 'Change the dimensions of your images quickly while maintaining quality.',
    icon: FileImage,
    href: '/tools/image-resizer',
    color: 'bg-teal-100 text-teal-600',
    hover: 'hover:border-teal-200 hover:shadow-teal-100'
  },
  {
    title: 'Upscale Image',
    description: 'Enhance and increase the resolution of your images using AI.',
    icon: Sparkles,
    href: '/tools/image-upscaler',
    color: 'bg-fuchsia-100 text-fuchsia-600',
    hover: 'hover:border-fuchsia-200 hover:shadow-fuchsia-100'
  },
  {
    title: 'Remove Background',
    description: 'Remove backgrounds from your images using on-device AI. 100% private.',
    icon: FileImage,
    href: '/tools/image-bg-removal',
    color: 'bg-cyan-100 text-cyan-600',
    hover: 'hover:border-cyan-200 hover:shadow-cyan-100'
  }
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header section with gradient */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8 md:p-12 shadow-xl shadow-blue-900/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 transition shadow-inner font-semibold rounded-full text-xs mb-6 backdrop-blur-md border border-white/20">
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span className="text-white">AI-Powered PDF Assistant</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Every tool you need to work with PDFs in one place
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl">
            Merge, split, compress, convert, and chat with your PDFs seamlessly. No installation needed.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/ai" 
              prefetch={true}
              className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Chat with PDF
            </Link>
            <Link 
              href="/tools/merge" 
              prefetch={true}
              className="bg-blue-600/50 hover:bg-blue-600/70 border border-blue-400/30 backdrop-blur text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
            >
              <Merge className="w-5 h-5" />
              Merge PDF
            </Link>
          </div>
        </div>
        {/* Decorational shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-20 -mb-20 w-64 h-64 bg-blue-400/20 blur-2xl rounded-full" />
      </section>

      {/* Grid of tools */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Popular PDF Tools</h2>
          <Link href="/tools" prefetch={true} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {tools.map((tool) => (
            <Link key={tool.title} href={tool.href} prefetch={true} className="group block">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center cursor-pointer h-full transition-all hover:shadow-md hover:-translate-y-0.5">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-2", tool.color)}>
                  <tool.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">{tool.title}</h3>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {tool.description.split('.')[0]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Banner for privacy mode */}
      <section className="bg-slate-900 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center flex-shrink-0">
            <Lock className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Privacy-First Processing</h3>
            <p className="text-slate-400 max-w-md">
              Working with sensitive documents? Most operations are performed directly in your browser. When cloud is needed, files are encrypted and automatically deleted.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
