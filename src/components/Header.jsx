import React, { useState, useEffect } from 'react';
import { Activity, Globe, ExternalLink } from 'lucide-react';

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

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
    <header className="border-b border-white/[0.08] bg-[#030712]/75 backdrop-blur-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Terminal Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-[1.5px] shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-lg font-mono">
                  FinPulse<span className="text-emerald-400 font-mono">.fx</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  INSTITUTIONAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight">
                European Central Bank Direct Stream • Quantitative Macro Terminal
              </p>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2 bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/[0.08]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">ECB LIVE</span>
          </div>
        </div>

        {/* Live Feeds & Clock Info */}
        <div className="hidden lg:flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 bg-white/[0.03] px-3.5 py-1.5 rounded-xl border border-white/[0.08] backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-slate-400 text-[11px]">FEED:</span>
            <span className="text-slate-200 font-semibold">ECB Live Ref</span>
          </div>

          <div className="flex items-center gap-2 bg-white/[0.03] px-3.5 py-1.5 rounded-xl border border-white/[0.08] backdrop-blur-md">
            <span className="text-slate-400 text-[11px]">DUBAI (GST):</span>
            <span className="text-emerald-400 font-bold tracking-wider">{formatDubaiTime(time)}</span>
          </div>

          <div className="flex items-center gap-2 bg-white/[0.03] px-3.5 py-1.5 rounded-xl border border-white/[0.08] backdrop-blur-md">
            <span className="text-slate-400 text-[11px]">UTC:</span>
            <span className="text-slate-200 font-semibold tracking-wider">{formatUtcTime(time)}</span>
          </div>
        </div>

        {/* Quick Links & Author Attribution */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <a
            href="https://github.com/Moiz0820"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-xl border border-white/[0.09] transition-all hover:border-emerald-500/40 shadow-sm"
          >
            <GithubIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono font-medium">Moiz0820</span>
          </a>

          <a
            href="https://github.com/public-apis/public-apis"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 bg-emerald-950/40 hover:bg-emerald-900/50 px-3 py-1.5 rounded-xl border border-emerald-500/30 transition-all shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono">Public APIs</span>
            <ExternalLink className="w-3 h-3 text-emerald-400/80" />
          </a>
        </div>
      </div>
    </header>
  );
}
