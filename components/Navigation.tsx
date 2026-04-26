'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, Sparkles, Folder, User, Search, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', icon: Home, href: '/' },
    { label: 'Tools', icon: Wrench, href: '/tools' },
    { label: 'Scan', icon: ScanLine, href: '/tools/scanner', isSpecial: true },
    { label: 'Pilot AI', icon: Sparkles, href: '/ai' },
    { label: 'Profile', icon: User, href: '/profile' },
  ];

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
            DocPilot <span className="text-blue-600 font-medium text-sm">PRO</span>
          </h1>
        </Link>
        
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="w-64 pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
          <Link href="/profile" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm hover:ring-2 hover:ring-blue-500 transition-all">
              <span className="text-xs font-bold text-slate-600">JD</span>
            </div>
          </Link>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200 flex items-center justify-around px-4 sm:px-12 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && !item.isSpecial && pathname.startsWith(item.href));
          
          if (item.isSpecial) {
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className="flex flex-col items-center -mt-8 group"
              >
                <div className="w-14 h-14 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white group-hover:bg-blue-700 transition-colors">
                  <item.icon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-1">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                "flex flex-col items-center space-y-1 transition-colors",
                isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <item.icon className="w-6 h-6 stroke-[2]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
