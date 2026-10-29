import React, { useState, useEffect } from 'react';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDubaiTime = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dubai',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  };

  const formatUtcTime = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  };

  return (
    <header className="border-b border-[#e4dcce] bg-[#f7f4ee]/90 backdrop-blur-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Identity - Pure Typography */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-stone-900 text-lg font-mono">
                FINPULSE<span className="text-emerald-700 font-mono">.FX</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                LIVE TERMINAL
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-mono">
              European Central Bank Reference Stream • Quantitative FX Intelligence
            </p>
          </div>

          <div className="flex md:hidden items-center bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
            <span className="text-[10px] text-emerald-800 font-mono font-semibold">ECB LIVE</span>
          </div>
        </div>

        {/* Live Feeds & Clock Info */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-xs">
          <div className="bg-[#efeae0]/80 px-3 py-1.5 rounded-xl border border-[#ded5c6]">
            <span className="text-stone-500 text-[11px] mr-1.5">FEED:</span>
            <span className="text-stone-800 font-semibold">ECB Reference</span>
          </div>

          <div className="bg-[#efeae0]/80 px-3 py-1.5 rounded-xl border border-[#ded5c6]">
            <span className="text-stone-500 text-[11px] mr-1.5">DUBAI (GST):</span>
            <span className="text-emerald-800 font-bold tracking-wider">{formatDubaiTime(time)}</span>
          </div>

          <div className="bg-[#efeae0]/80 px-3 py-1.5 rounded-xl border border-[#ded5c6]">
            <span className="text-stone-500 text-[11px] mr-1.5">UTC:</span>
            <span className="text-stone-700 font-semibold tracking-wider">{formatUtcTime(time)}</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <a
            href="https://github.com/Moiz0820"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-700 hover:text-stone-900 bg-white/90 hover:bg-white px-3.5 py-1.5 rounded-xl border border-[#ded5c6] transition-all hover:border-emerald-600/40 shadow-xs font-mono font-medium"
          >
            GitHub / Moiz0820
          </a>

          <a
            href="https://github.com/public-apis/public-apis"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100/80 px-3.5 py-1.5 rounded-xl border border-emerald-300 transition-all shadow-xs font-mono font-medium"
          >
            Public APIs
          </a>
        </div>
      </div>
    </header>
  );
}
