import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

export default async function ToolPlaceholderPage({ params }: { params: Promise<{ toolId: string }> }) {
  const { toolId } = await params;
  
  // Exclude actual tools from this route matching
  const implementedTools = ['merge', 'compress', 'split', 'protect', 'sign', 'excel-to-pdf', 'unlock', 'image-resizer', 'image-upscaler', 'image-bg-removal', 'image-compress', 'image-to-webp'];
  if (implementedTools.includes(toolId)) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 text-center">
      <div className="flex justify-start mb-8">
        <Link href="/tools" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tools
        </Link>
      </div>
      
      <div className="py-20">
        <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-12 h-12" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight capitalize">
          {toolId.replace(/-/g, ' ')}
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          This feature is currently under active development and will be available in the next release.
        </p>
        <Link 
          href="/tools"
          className="bg-black hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg inline-block"
        >
          Explore Available Tools
        </Link>
      </div>
    </div>
  );
}
