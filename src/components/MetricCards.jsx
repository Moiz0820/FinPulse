import React from 'react';
import { CURRENCIES } from '../constants/currencies';

export default function MetricCards({ base, rates, activeTarget, activeStats }) {
  const aedRate = rates?.['AED'] ? rates['AED'].toFixed(4) : (base === 'AED' ? '1.0000' : '3.6725');
  const baseCurrencyInfo = CURRENCIES[base] || { name: base, symbol: '' };

  const isPositiveChange = (activeStats?.change || 0) >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Active Pair Performance */}
      <div className="glass-card rounded-2xl p-4.5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-semibold">SPOT RATE</span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            isPositiveChange
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}>
            {isPositiveChange ? 'GAIN' : 'DROP'}
          </span>
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
            {activeStats?.change > 0 ? `+${activeStats.change}%` : `${activeStats?.change || 0}%`}
          </span>
          <span className="text-stone-500 text-[11px]">period delta</span>
        </div>
      </div>

      {/* 2. Volatility / Risk Index */}
      <div className="glass-card rounded-2xl p-4.5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-semibold">VOLATILITY (σ)</span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700">
            DISPERSION
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-stone-900 tracking-tight">
            {activeStats?.volatility ? (activeStats.volatility * 100).toFixed(3) : '0.000'}
          </span>
          <span className="text-xs text-stone-600 font-mono font-semibold">pts</span>
        </div>
        <div className="mt-2.5 text-[11px] text-stone-500 font-mono flex items-center justify-between">
          <span>Range: {activeStats?.min || '0'} – {activeStats?.max || '0'}</span>
          <span className="text-stone-400 font-medium">{activeStats?.count || 0} ticks</span>
        </div>
      </div>

      {/* 3. UAE Dirham (AED) Anchor Rate */}
      <div className="glass-card rounded-2xl p-4.5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-semibold">GCC PEG ANCHOR</span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800">
            FIXED
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-stone-900 tracking-tight">
            {aedRate}
          </span>
          <span className="text-xs text-stone-500 font-mono font-medium">
            {base === 'AED' ? 'USD/AED' : `1 ${base} = AED`}
          </span>
        </div>
        <div className="mt-2.5 text-[11px] text-amber-900 font-mono font-medium">
          Central Bank Peg: 3.6725
        </div>
      </div>

      {/* 4. Active Base Currency */}
      <div className="glass-card rounded-2xl p-4.5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-semibold">BASE CURRENCY</span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700">
            ACTIVE
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-stone-900 tracking-tight">
            {base}
          </span>
          <span className="text-xs text-stone-500 truncate max-w-[140px] font-mono">
            {baseCurrencyInfo.name}
          </span>
        </div>
        <div className="mt-2.5 text-[11px] text-stone-500 font-mono flex items-center justify-between">
          <span>33+ Pairs Synchronized</span>
          <span className="text-emerald-800 font-semibold">100% Synced</span>
        </div>
      </div>
    </div>
  );
}
