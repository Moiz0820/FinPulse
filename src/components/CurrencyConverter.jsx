import React, { useState } from 'react';
import { ArrowLeftRight, Calculator, Sparkles, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { CURRENCIES } from '../constants/currencies';

export default function CurrencyConverter({
  rates,
  base,
  activeTarget,
  activeStats,
}) {
  const [amount, setAmount] = useState('10000');
  const [fromCurr, setFromCurr] = useState(base);
  const [toCurr, setToCurr] = useState(activeTarget);

  const numAmount = parseFloat(amount) || 0;

  // Rate calculation
  const getRate = (from, to) => {
    if (from === to) return 1;
    const fromRate = rates?.[from] || 1;
    const toRate = rates?.[to] || 1;

    if (from === base) return toRate;
    if (to === base) return 1 / fromRate;
    return toRate / fromRate;
  };

  const currentRate = getRate(fromCurr, toCurr);
  const convertedTotal = (numAmount * currentRate).toFixed(2);

  const fromInfo = CURRENCIES[fromCurr] || { flag: '', symbol: fromCurr };
  const toInfo = CURRENCIES[toCurr] || { flag: '', symbol: toCurr };

  // Swap currencies
  const handleSwap = () => {
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  // Historical fluctuation calculation
  const historicalRateDiffPercent = activeStats?.change || 0;
  const historicalImpact = (numAmount * currentRate * (historicalRateDiffPercent / 100));
  const isPositiveShift = historicalImpact >= 0;

  return (
    <div className="glass-panel rounded-2xl p-5 mb-6 relative overflow-hidden">
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white tracking-tight">
              Institutional Conversion Engine
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Live zero-spread parity with purchasing power drift analysis
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25">
          Interbank Parity
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center mt-4">
        {/* From Input */}
        <div className="md:col-span-5 glass-input p-3.5 rounded-2xl border border-white/[0.08] focus-within:border-emerald-500/60 transition-all">
          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1.5">
            YOU TRANSMIT / DEPOSIT
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-2xl font-bold font-mono text-white focus:outline-none"
              placeholder="0.00"
            />
            <select
              value={fromCurr}
              onChange={(e) => setFromCurr(e.target.value)}
              className="bg-[#0b101d] text-slate-200 text-xs font-mono py-1.5 px-2.5 rounded-xl border border-white/[0.12] focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c} className="bg-[#030712] text-white">
                  {CURRENCIES[c].flag} {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center">
          <button
            onClick={handleSwap}
            className="p-3 rounded-2xl bg-white/[0.04] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-white/[0.08] hover:border-emerald-500/40 transition-all hover:rotate-180 duration-300 shadow-sm"
            title="Invert currency pair"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* To Result */}
        <div className="md:col-span-5 glass-input p-3.5 rounded-2xl border border-white/[0.08] focus-within:border-emerald-500/60 transition-all">
          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1.5">
            BENEFICIARY CONVERTED VALUE
          </label>
          <div className="flex items-center gap-2">
            <span className="w-full text-2xl font-bold font-mono text-emerald-400 truncate tracking-tight">
              {Number(convertedTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <select
              value={toCurr}
              onChange={(e) => setToCurr(e.target.value)}
              className="bg-[#0b101d] text-slate-200 text-xs font-mono py-1.5 px-2.5 rounded-xl border border-white/[0.12] focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c} className="bg-[#030712] text-white">
                  {CURRENCIES[c].flag} {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Amount Presets */}
      <div className="flex flex-wrap items-center gap-2 mt-3.5">
        <span className="text-[11px] font-mono text-slate-400">Quick Volume:</span>
        {[1000, 5000, 10000, 50000, 100000].map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset.toString())}
            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border border-white/[0.07] hover:border-white/20 transition-all"
          >
            {fromInfo.symbol}{preset.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Quantitative Procurement Drift Simulation */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-white/[0.02] via-emerald-950/20 to-cyan-950/20 border border-white/[0.07] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5 border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-200">Procurement & Timing Drift Model</span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              1 {fromCurr} = {currentRate.toFixed(4)} {toCurr}.
              {fromCurr === 'USD' && toCurr === 'AED' ? ' Central Bank Peg eliminates volatility risk completely.' : ''}
            </p>
          </div>
        </div>

        {fromCurr !== toCurr && (
          <div className="flex items-center gap-2.5 bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/[0.08] self-stretch sm:self-auto justify-between">
            <span className="text-slate-400 text-[11px]">Period Drift:</span>
            <span className={`font-bold font-mono flex items-center gap-1 ${isPositiveShift ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositiveShift ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {Math.abs(historicalImpact) > 0 ? `${toInfo.symbol}${Math.abs(historicalImpact).toFixed(2)}` : '0.00'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
