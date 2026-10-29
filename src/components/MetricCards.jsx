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
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-semibold">SPOT SPREAD</span>
          <div className={`p-1.5 rounded-xl border ${
            isPositiveChange
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            {isPositiveChange ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-stone-900 tracking-tight">
            {activeStats?.latest || (rates?.[activeTarget] ? rates[activeTarget].toFixed(4) : '—')}
          </span>
          <span className="text-xs text-stone-500 font-mono font-medium">
            {base}/{activeTarget}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2 text-xs font-mono">
          <span className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded text-[11px] ${
            isPositiveChange
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-rose-100 text-rose-800 border border-rose-300'
          }`}>
            {isPositiveChange ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {activeStats?.change > 0 ? `+${activeStats.change}%` : `${activeStats?.change || 0}%`}
          </span>
          <span className="text-stone-500 text-[11px]">period delta</span>
        </div>
      </div>

      {/* 2. Volatility / Risk Index */}
      <div className="glass-card rounded-2xl p-4.5 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-semibold">VOLATILITY (σ)</span>
          <div className="p-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
            <Gauge className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-stone-900 tracking-tight">
            {activeStats?.volatility ? (activeStats.volatility * 100).toFixed(3) : '0.000'}
          </span>
          <span className="text-xs text-teal-700 font-mono font-semibold">σ pts</span>
        </div>
        <div className="mt-2.5 text-[11px] text-stone-500 font-mono flex items-center justify-between">
          <span>Range: {activeStats?.min || '0'} – {activeStats?.max || '0'}</span>
          <span className="text-stone-400 font-medium">{activeStats?.count || 0} ticks</span>
        </div>
      </div>

      {/* 3. UAE Dirham (AED) Anchor Rate */}
      <div className="glass-card rounded-2xl p-4.5 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-semibold">GCC PEG ANCHOR</span>
          <div className="p-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
            <Shield className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-stone-900 tracking-tight">
            {aedRate}
          </span>
          <span className="text-xs text-stone-500 font-mono font-medium">
            {base === 'AED' ? 'USD/AED' : `1 ${base} = AED`}
          </span>
        </div>
        <div className="mt-2.5 text-[11px] text-amber-800 font-mono flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>UAE Central Bank Peg (3.6725)</span>
        </div>
      </div>

      {/* 4. Active Base Currency */}
      <div className="glass-card rounded-2xl p-4.5 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-semibold">BASE CURRENCY</span>
          <div className="p-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700">
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-stone-900 tracking-tight flex items-center gap-1.5">
            <span>{baseCurrencyInfo.flag}</span>
            <span>{base}</span>
          </span>
          <span className="text-xs text-stone-500 truncate max-w-[110px] font-mono">
            {baseCurrencyInfo.symbol}
          </span>
        </div>
        <div className="mt-2.5 text-[11px] text-stone-500 font-mono flex items-center justify-between">
          <span>33+ Pairs Synchronized</span>
          <span className="text-emerald-700 font-semibold">Active</span>
        </div>
      </div>
    </div>
  );
}
