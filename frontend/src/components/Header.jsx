import React from 'react';
import { ArrowLeftRight, ShieldCheck, Zap, Lock } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-6 sm:pt-8 pb-4 sm:pb-6 text-center">
      {/* Brand Header */}
      <div className="inline-flex items-center justify-center space-x-2 mb-3 group cursor-default">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
          <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">
          Quick<span className="text-indigo-600">Drop</span>
        </span>
      </div>

      {/* Main Tagline */}
      <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 px-2">
        Transfer files between your devices
      </h1>

      {/* Feature pill description */}
      <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm font-medium text-slate-600 bg-slate-100/90 px-3 py-1.5 rounded-full border border-slate-200/80 max-w-full">
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Fast
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-indigo-500" /> Temporary
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> No account required
        </span>
      </div>
    </header>
  );
};

export default Header;
