import Link from 'next/link';
import { 
  Merge, SplitSquareVertical, Minimize2, FileText, FileImage, 
  Type, Shield, ShieldAlert, Sparkles, Edit3, Image, FileOutput, RotateCw, PenTool, FileSpreadsheet
} from 'lucide-react';
import { cn } from '@/lib/utils';

const allTools = [
  {
    category: 'Organize PDF',
    items: [
      { id: 'merge', title: 'Merge PDF', icon: Merge, color: 'text-indigo-600 bg-indigo-100', href: '/tools/merge' },
      { id: 'split', title: 'Split PDF', icon: SplitSquareVertical, color: 'text-emerald-600 bg-emerald-100', href: '/tools/split' },
      { id: 'rotate', title: 'Rotate PDF', icon: RotateCw, color: 'text-pink-600 bg-pink-100', href: '/tools/rotate' },
    ]
  },
  {
    category: 'Optimize PDF',
    items: [
      { id: 'compress', title: 'Compress PDF', icon: Minimize2, color: 'text-rose-600 bg-rose-100', href: '/tools/compress' },
    ]
  },
  {
    category: 'Convert to PDF',
    items: [
      { id: 'word-to-pdf', title: 'Word to PDF', icon: FileText, color: 'text-blue-600 bg-blue-100', href: '/tools/word-to-pdf' },
      { id: 'excel-to-pdf', title: 'Excel to PDF', icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-100', href: '/tools/excel-to-pdf' },
      { id: 'image-to-pdf', title: 'JPG to PDF', icon: Image, color: 'text-amber-600 bg-amber-100', href: '/tools/image-to-pdf' },
    ]
  },
  {
    category: 'Convert from PDF',
    items: [
      { id: 'pdf-to-word', title: 'PDF to Word', icon: FileOutput, color: 'text-blue-600 bg-blue-100', href: '/tools/pdf-to-word' },
      { id: 'pdf-to-jpg', title: 'PDF to JPG', icon: FileImage, color: 'text-amber-600 bg-amber-100', href: '/tools/pdf-to-jpg' },
      { id: 'extract-text', title: 'Extract Text', icon: Type, color: 'text-purple-600 bg-purple-100', href: '/tools/extract-text' },
    ]
  },
  {
    category: 'Edit PDF',
    items: [
      { id: 'add-text', title: 'Add Text', icon: Edit3, color: 'text-orange-600 bg-orange-100', href: '/tools/edit' },
      { id: 'sign', title: 'Sign PDF', icon: PenTool, color: 'text-indigo-600 bg-indigo-100', href: '/tools/sign' },
      { id: 'ai-chat', title: 'AI Assistant', icon: Sparkles, color: 'text-cyan-600 bg-cyan-100', href: '/ai' },
    ]
  },
  {
    category: 'Security',
    items: [
      { id: 'protect', title: 'Protect PDF', icon: Shield, color: 'text-slate-600 bg-slate-200', href: '/tools/protect' },
      { id: 'unlock', title: 'Unlock PDF', icon: ShieldAlert, color: 'text-slate-600 bg-slate-200', href: '/tools/unlock' },
    ]
  },
  {
    category: 'Image Tools',
    items: [
      { id: 'image-resizer', title: 'Resize Image', icon: Image, color: 'text-teal-600 bg-teal-100', href: '/tools/image-resizer' },
      { id: 'image-compress', title: 'Compress Image', icon: FileImage, color: 'text-lime-600 bg-lime-100', href: '/tools/image-compress' },
      { id: 'image-to-webp', title: 'Convert to WebP', icon: FileImage, color: 'text-sky-600 bg-sky-100', href: '/tools/image-to-webp' },
      { id: 'image-upscaler', title: 'Upscale Image', icon: Sparkles, color: 'text-fuchsia-600 bg-fuchsia-100', href: '/tools/image-upscaler' },
      { id: 'image-bg-removal', title: 'Remove BG', icon: FileImage, color: 'text-cyan-600 bg-cyan-100', href: '/tools/image-bg-removal' },
    ]
  }
];

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">All PDF Tools</h1>
        <p className="text-slate-500 text-lg">Every tool you need to edit, convert, and manage your PDFs.</p>
      </div>

      <div className="space-y-10">
        {allTools.map((category) => (
          <div key={category.category}>
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-6">
              {category.category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {category.items.map((tool) => (
                <Link 
                  key={tool.id} 
                  href={tool.href}
                  prefetch={true}
                  className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center cursor-pointer h-full transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-2", tool.color)}>
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{tool.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
