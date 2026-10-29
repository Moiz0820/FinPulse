import React from 'react';
import { TrendingUp, TrendingDown, Shield, Gauge, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { CURRENCIES } from '../constants/currencies';

export default function MetricCards({ base, rates, activeTarget, activeStats }) {
  const aedRate = rates?.['AED'] ? rates['AED'].toFixed(4) : (base === 'AED' ? '1.0000' : '3.6725');
  const activeCurrencyInfo = CURRENCIES[activeTarget] || { name: activeTarget, symbol: '' };
  const baseCurrencyInfo = CURRENCIES[base] || { name: base, symbol: '' };

  const isPositiveChange = (activeStats?.change || 0) >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Active Pair Performance */}
      <div className="glass-card rounded-2xl p-4.5 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500" />
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">ACTIVE SPOT SPREAD</span>
          <div className={`p-1.5 rounded-xl border ${
            isPositiveChange
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {isPositiveChange ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight">
            {activeStats?.latest || (rates?.[activeTarget] ? rates[activeTarget].toFixed(4) : '—')}
          </span>
          <span className="text-xs text-slate-400 font-mono font-medium">
            {base}/{activeTarget}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2 text-xs font-mono">
          <span className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded text-[11px] ${
            isPositiveChange
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          }`}>
            {isPositiveChange ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {activeStats?.change > 0 ? `+${activeStats.change}%` : `${activeStats?.change || 0}%`}
          </span>
          <span className="text-slate-400 text-[11px]">period delta</span>
        </div>
      </div>

      {/* 2. Volatility / Risk Index */}
      <div className="glass-card rounded-2xl p-4.5 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500" />
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">VOLATILITY DISPERSION</span>
          <div className="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Gauge className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight">
            {activeStats?.volatility ? (activeStats.volatility * 100).toFixed(3) : '0.000'}
          </span>
          <span className="text-xs text-cyan-400 font-mono font-medium">σ index</span>
        </div>
        <div className="mt-2.5 text-[11px] text-slate-400 font-mono flex items-center justify-between">
          <span>Range: {activeStats?.min || '0'} – {activeStats?.max || '0'}</span>
          <span className="text-slate-400">{activeStats?.count || 0} ticks</span>
        </div>
      </div>

      {/* 3. UAE Dirham (AED) Anchor Rate */}
      <div className="glass-card rounded-2xl p-4.5 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500" />
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">GCC PEG ANCHOR</span>
          <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Shield className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight">
            {aedRate}
          </span>
          <span className="text-xs text-slate-400 font-mono font-medium">
            {base === 'AED' ? 'USD/AED' : `1 ${base} = AED`}
          </span>
        </div>
        <div className="mt-2.5 text-[11px] text-amber-300/80 font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
          <span>UAE Central Bank Peg (3.6725)</span>
        </div>
      </div>

      {/* 4. Active Base Currency */}
      <div className="glass-card rounded-2xl p-4.5 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500" />
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">BASE DENOMINATION</span>
          <div className="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight flex items-center gap-1.5">
            <span>{baseCurrencyInfo.flag}</span>
            <span>{base}</span>
          </span>
          <span className="text-xs text-slate-400 truncate max-w-[110px] font-mono">
            {baseCurrencyInfo.symbol}
          </span>
        </div>
        <div className="mt-2.5 text-[11px] text-slate-400 font-mono flex items-center justify-between">
          <span>33+ Pairs Synchronized</span>
          <span className="text-emerald-400 font-medium">Active</span>
        </div>
      </div>
    </div>
  );
}
