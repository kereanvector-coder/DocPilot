'use client';

import { useState, useMemo } from 'react';
import { 
  Folder, MoreVertical, FileText, Search, Clock, 
  Image as ImageIcon, Cloud, Tag as TagIcon, HardDrive, 
  Settings, X, Plus, AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type FileRecord = {
  id: number;
  name: string;
  date: string;
  size: string;
  type: string;
  action: string;
  tags: string[];
  source: 'local' | 'gdrive' | 'dropbox';
};

const MOCK_FILES: FileRecord[] = [
  { id: 1, name: 'Business_Proposal_2026.pdf', date: '2 mins ago', size: '2.4 MB', type: 'pdf', action: 'Merged', tags: ['Work', 'Important'], source: 'local' },
  { id: 2, name: 'Invoice_Template_final.pdf', date: '1 hour ago', size: '1.1 MB', type: 'pdf', action: 'Compressed', tags: ['Finance'], source: 'local' },
  { id: 3, name: 'Scan_04252026.pdf', date: 'Yesterday', size: '4.5 MB', type: 'pdf', action: 'Scanned', tags: ['Scans'], source: 'local' },
  { id: 4, name: 'Q1_Financial_Report.pdf', date: 'Yesterday', size: '3.2 MB', type: 'pdf', action: 'Synced', tags: ['Finance', 'Work'], source: 'gdrive' },
  { id: 5, name: 'Project_Alpha_Assets.zip', date: '2 days ago', size: '15 MB', type: 'doc', action: 'Synced', tags: ['Assets'], source: 'dropbox' },
  { id: 6, name: 'Meeting_Notes.docx', date: 'Yesterday', size: '124 KB', type: 'doc', action: 'Converted', tags: ['Notes'], source: 'local' },
];

const ALL_TAGS = ['Work', 'Important', 'Finance', 'Scans', 'Assets', 'Notes'];

export default function FilesPage() {
  const [search, setSearch] = useState('');
  const [activeSource, setActiveSource] = useState<'all' | 'local' | 'gdrive' | 'dropbox'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCloudConnect = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfigModal(true);
  };
  
  const clearFilters = () => {
    setSearch('');
    setSelectedTags([]);
    setActiveSource('all');
  };

  const filteredFiles = useMemo(() => {
    return MOCK_FILES.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase());
      const matchesSource = activeSource === 'all' || file.source === activeSource;
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => file.tags.includes(tag));
      return matchesSearch && matchesSource && matchesTags;
    });
  }, [search, activeSource, selectedTags]);

  const sourceTabs = [
    { id: 'all', label: 'All Files', icon: Folder },
    { id: 'local', label: 'My Device', icon: HardDrive },
    { id: 'gdrive', label: 'Google Drive', icon: Cloud },
    { id: 'dropbox', label: 'Dropbox', icon: Cloud },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 relative pb-32">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">File Manager</h1>
          <p className="text-slate-500 mt-1">Organize, filter, and connect your documents.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCloudConnect}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-medium text-slate-700 flex items-center shadow-sm transition-all"
          >
            <Settings className="w-4 h-4 mr-2 text-slate-400" />
            Connect Storage
          </button>
        </div>
      </div>

      {/* Cloud Integration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Cloud className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Cloud Integration</h3>
            <p className="text-slate-500 mb-6 leading-relaxed text-sm">
              To browse Google Drive or Dropbox files natively, please set up OAuth configurations in your environment variables. 
              Real integrations require API keys from your provider dashboard.
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700 font-mono">
                  <p className="font-semibold text-slate-900 font-sans mb-1">Required env variables:</p>
                  GOOGLE_CLIENT_ID=...<br />
                  GOOGLE_CLIENT_SECRET=...<br />
                  DROPBOX_APP_KEY=...
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowConfigModal(false)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-200"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar / Left Column */}
        <div className="lg:w-64 shrink-0 space-y-8">
          
          {/* Storage Locations */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3 px-3">Storage Sources</h3>
            <div className="space-y-1">
              {sourceTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSource(tab.id as 'all' | 'local' | 'gdrive' | 'dropbox')}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                    activeSource === tab.id 
                      ? "bg-slate-900 text-white font-medium shadow-md shadow-slate-900/10" 
                      : "text-slate-600 hover:bg-slate-100 font-medium"
                  )}
                >
                  <tab.icon className={cn("w-5 h-5", activeSource === tab.id ? "text-blue-400" : "text-slate-400")} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filtering UI */}
          <div>
            <div className="flex items-center justify-between px-3 mb-3">
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">Tags</h3>
              <TagIcon className="w-4 h-4 text-slate-300" />
            </div>
            <div className="flex flex-wrap gap-2 px-3">
              {ALL_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200",
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <div className="px-3 mt-4">
                <button 
                  onClick={() => setSelectedTags([])}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear tags
                </button>
              </div>
            )}
          </div>
        </div>

        {/* File Browser / Right Column */}
        <div className="flex-1 space-y-6">
          
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Search in ${sourceTabs.find(t => t.id === activeSource)?.label}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none shadow-sm"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-800">
                {search ? 'Search Results' : 'Documents'}
              </h2>
              <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200">
                {filteredFiles.length} file{filteredFiles.length !== 1 && 's'}
              </span>
            </div>
            
            {filteredFiles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white text-slate-400 font-medium border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-xs py-3">Name</th>
                      <th className="px-6 py-4 font-semibold text-xs py-3">Tags</th>
                      <th className="px-6 py-4 font-semibold text-xs py-3">Source</th>
                      <th className="px-6 py-4 font-semibold text-xs py-3">Processed</th>
                      <th className="px-6 py-4 font-semibold text-xs py-3 text-right">Size</th>
                      <th className="px-6 py-4 font-semibold text-xs py-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-slate-50 cursor-pointer group transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {file.type === 'pdf' && <FileText className="w-5 h-5 text-red-500 mr-3 shrink-0" />}
                            {file.type === 'image' && <ImageIcon className="w-5 h-5 text-amber-500 mr-3 shrink-0" />}
                            {file.type === 'doc' && <FileText className="w-5 h-5 text-blue-500 mr-3 shrink-0" />}
                            <div>
                              <p className="font-semibold text-slate-800 text-sm leading-tight">{file.name}</p>
                              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">{file.action}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 min-w-[120px]">
                          <div className="flex gap-1.5 flex-wrap">
                            {file.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-600 border border-slate-200">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-xs text-slate-500 font-medium whitespace-nowrap">
                            {file.source === 'local' && <HardDrive className="w-3.5 h-3.5 mr-1.5 text-slate-400" />}
                            {file.source === 'gdrive' && <Cloud className="w-3.5 h-3.5 mr-1.5 text-blue-500" />}
                            {file.source === 'dropbox' && <Cloud className="w-3.5 h-3.5 mr-1.5 text-blue-500" />}
                            {file.source === 'local' ? 'Local' : file.source === 'gdrive' ? 'Drive' : 'Dropbox'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs font-medium whitespace-nowrap">{file.date}</td>
                        <td className="px-6 py-4 text-right text-slate-500 text-xs font-medium whitespace-nowrap">{file.size}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-slate-900 transition p-1.5 rounded-md hover:bg-slate-200 opacity-0 group-hover:opacity-100 md:opacity-100 float-right">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 text-center px-4">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No files found</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  We could not find any files matching your search, selected source, and tags. Try adjusting your filters.
                </p>
                <div className="mt-6 flex justify-center">
                  <button 
                    onClick={clearFilters}
                    className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg text-sm hover:bg-blue-100 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
