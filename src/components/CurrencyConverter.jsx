import React, { useState } from 'react';
import { ArrowLeftRight, Calculator, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { CURRENCIES } from '../constants/currencies';

export default function CurrencyConverter({
  rates,
  base,
  activeTarget,
  onBaseChange,
  onTargetChange,
  activeStats,
}) {
  const [amount, setAmount] = useState('10000');
  const [fromCurr, setFromCurr] = useState(base);
  const [toCurr, setToCurr] = useState(activeTarget);

  const numAmount = parseFloat(amount) || 0;

  // Rate calculation
  // Base rates are relative to `base`
  const getRate = (from, to) => {
    if (from === to) return 1;
    const fromRate = rates?.[from] || 1;
    const toRate = rates?.[to] || 1;

    if (from === base) {
      return toRate;
    }
    if (to === base) {
      return 1 / fromRate;
    }
    // Cross rate
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

  // Historical fluctuation calculation (30 days impact)
  const historicalRateDiffPercent = activeStats?.change || 0;
  // If rate changed by X%, what would the difference be?
  const historicalImpact = ((numAmount * currentRate) * (historicalRateDiffPercent / 100));
  const isPositiveShift = historicalImpact >= 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white">Smart Converter & Procurement Simulator</h3>
            <p className="text-[11px] text-slate-400 font-mono">Real-time conversion with purchasing power drift analysis</p>
          </div>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
          Zero-Spread Rate
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center mt-4">
        {/* From Input */}
        <div className="md:col-span-5 bg-slate-950/80 p-3 rounded-xl border border-slate-800 focus-within:border-emerald-500 transition-colors">
          <label className="text-[11px] font-mono text-slate-400 block mb-1">YOU SEND / CONVERT</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-xl font-bold font-mono text-white focus:outline-none"
              placeholder="0.00"
            />
            <select
              value={fromCurr}
              onChange={(e) => setFromCurr(e.target.value)}
              className="bg-slate-900 text-slate-200 text-xs font-mono py-1.5 px-2 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
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
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all hover:rotate-180 duration-300"
            title="Swap currencies"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* To Result */}
        <div className="md:col-span-5 bg-slate-950/80 p-3 rounded-xl border border-slate-800 focus-within:border-emerald-500 transition-colors">
          <label className="text-[11px] font-mono text-slate-400 block mb-1">RECIPIENT RECEIVES (EST.)</label>
          <div className="flex items-center gap-2">
            <span className="w-full text-xl font-bold font-mono text-emerald-400 truncate">
              {Number(convertedTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <select
              value={toCurr}
              onChange={(e) => setToCurr(e.target.value)}
              className="bg-slate-900 text-slate-200 text-xs font-mono py-1.5 px-2 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {CURRENCIES[c].flag} {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="text-[11px] font-mono text-slate-500">Quick Amounts:</span>
        {[1000, 5000, 10000, 50000, 100000].map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset.toString())}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
          >
            {fromInfo.symbol}{preset.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Financial Analyst Procurement Simulator Card */}
      <div className="mt-4 p-3.5 rounded-lg bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-indigo-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded bg-indigo-500/20 text-indigo-400 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-slate-200">Procurement & Timing Impact Analysis</span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Current conversion parity: 1 {fromCurr} = {currentRate.toFixed(4)} {toCurr}. 
              {fromCurr === 'USD' && toCurr === 'AED' ? ' Pegged rate ensures zero volatility risk.' : ''}
            </p>
          </div>
        </div>

        {fromCurr !== toCurr && (
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 self-stretch sm:self-auto justify-between">
            <span className="text-slate-400 text-[11px]">Period Drift:</span>
            <span className={`font-bold flex items-center gap-1 ${isPositiveShift ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositiveShift ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {Math.abs(historicalImpact) > 0 ? `${toInfo.symbol}${Math.abs(historicalImpact).toFixed(2)}` : '0.00'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
