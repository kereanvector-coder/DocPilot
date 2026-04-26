'use client';

import { User, CreditCard, Settings, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="col-span-1 border border-slate-200 rounded-3xl p-6 bg-white shadow-sm h-fit">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-50">
            <User className="w-10 h-10" />
          </div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Demo User</h2>
            <p className="text-slate-500 text-sm">user@docpilot.app</p>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <button className="w-full flex items-center justify-between text-left px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors group">
              <span className="flex items-center text-slate-700 font-medium">
                <Settings className="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-500 transition-colors" /> Settings
              </span>
            </button>
            <button className="w-full flex items-center justify-between text-left px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors group">
              <span className="flex items-center text-slate-700 font-medium">
                <Shield className="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-500 transition-colors" /> Privacy
              </span>
            </button>
            <button className="w-full flex items-center justify-between text-left px-4 py-2 hover:bg-red-50 rounded-lg transition-colors group">
              <span className="flex items-center text-red-600 font-medium">
                <LogOut className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-600 transition-colors" /> Sign out
              </span>
            </button>
          </div>
        </div>

        {/* Premium Upgrade */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                Current Plan: Free
              </div>
              <h2 className="text-3xl font-extrabold mb-4">Upgrade to DocPilot Pro</h2>
              <p className="text-blue-200 mb-8 max-w-sm">
                Unlock full AI capabilities, unlimited file sizes, batch processing, and remove ads forever.
              </p>
              
              <div className="space-y-3 mb-8">
                {['Unlimited PDF Merges & Splits', 'Advanced AI Document Chat', 'High Quality Compression', 'No Advertisements'].map((feature, i) => (
                  <div key={i} className="flex items-center text-blue-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button className="bg-white text-slate-900 hover:bg-blue-50 px-8 py-3 rounded-xl font-bold transition shadow-lg w-full sm:w-auto">
                  Get Pro for $4.99/mo
                </button>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-600/20 to-transparent skew-x-12 translate-x-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
