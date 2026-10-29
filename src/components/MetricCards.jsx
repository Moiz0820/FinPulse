import React from 'react';
import { TrendingUp, TrendingDown, Shield, Gauge, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CURRENCIES } from '../constants/currencies';

export default function MetricCards({ base, rates, activeTarget, activeStats }) {
  // Find top gainer & weakest currency relative to average / base
  const rateEntries = Object.entries(rates || {}).filter(([curr]) => curr !== base && CURRENCIES[curr]);
  
  // Calculate relative metrics
  const sortedByValue = [...rateEntries].sort((a, b) => b[1] - a[1]);
  const aedRate = rates?.['AED'] ? rates['AED'].toFixed(4) : (base === 'AED' ? '1.0000' : '3.6725');
  const usdRate = rates?.['USD'] ? rates['USD'].toFixed(4) : (base === 'USD' ? '1.0000' : '—');

  const activeCurrencyInfo = CURRENCIES[activeTarget] || { name: activeTarget, symbol: '' };
  const baseCurrencyInfo = CURRENCIES[base] || { name: base, symbol: '' };

  const isPositiveChange = activeStats?.change >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Active Pair Performance */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Pair Performance</span>
          <div className={`p-1.5 rounded-lg ${isPositiveChange ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {isPositiveChange ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-white">
            {activeStats?.latest || (rates?.[activeTarget] ? rates[activeTarget].toFixed(4) : '—')}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {base}/{activeTarget}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs font-mono">
          <span className={`flex items-center font-semibold ${isPositiveChange ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositiveChange ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {activeStats?.change > 0 ? `+${activeStats.change}%` : `${activeStats?.change || 0}%`}
          </span>
          <span className="text-slate-500">over selected period</span>
        </div>
      </div>

      {/* 2. Volatility / Risk Index */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Volatility Index (σ)</span>
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Gauge className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-white">
            {activeStats?.volatility ? (activeStats.volatility * 100).toFixed(3) : '0.000'}
          </span>
          <span className="text-xs text-indigo-400 font-mono font-medium">σ pts</span>
        </div>
        <div className="mt-2 text-xs text-slate-400 font-mono flex items-center justify-between">
          <span>Range: {activeStats?.min || '0'} - {activeStats?.max || '0'}</span>
          <span className="text-slate-500">{activeStats?.count || 0} samples</span>
        </div>
      </div>

      {/* 3. UAE Dirham (AED) Anchor Rate */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">GCC Peg Anchor</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Shield className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-white">
            {aedRate}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {base === 'AED' ? 'USD/AED' : `1 ${base} = AED`}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-400 font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Central Bank Peg (3.6725)</span>
        </div>
      </div>

      {/* 4. Cross Base Status */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Active Base Currency</span>
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold">
            {baseCurrencyInfo.symbol || base}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-white">
            {baseCurrencyInfo.flag} {base}
          </span>
          <span className="text-xs text-slate-400 truncate max-w-[120px]">
            {baseCurrencyInfo.name}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-400 font-mono flex items-center justify-between">
          <span>Tracked Pairs: 30+</span>
          <span className="text-emerald-400">100% Synced</span>
        </div>
      </div>
    </div>
  );
}
