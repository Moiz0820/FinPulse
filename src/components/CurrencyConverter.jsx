import React, { useState } from 'react';
import { ArrowLeftRight, Calculator, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
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

  const historicalRateDiffPercent = activeStats?.change || 0;
  const historicalImpact = (numAmount * currentRate * (historicalRateDiffPercent / 100));
  const isPositiveShift = historicalImpact >= 0;

  return (
    <div className="glass-panel rounded-2xl p-5 mb-6 relative overflow-hidden">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#e5decfa6]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-stone-900 tracking-tight">
              Institutional Conversion Engine
            </h3>
            <p className="text-[11px] text-stone-500 font-mono">
              Live zero-spread parity with purchasing power drift analysis
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 font-semibold">
          Interbank Parity
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center mt-4">
        {/* From Input */}
        <div className="md:col-span-5 glass-input p-3.5 rounded-2xl border border-[#ded5c6]">
          <label className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-semibold block mb-1.5">
            YOU TRANSMIT / DEPOSIT
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-2xl font-bold font-mono text-stone-900 focus:outline-none"
              placeholder="0.00"
            />
            <select
              value={fromCurr}
              onChange={(e) => setFromCurr(e.target.value)}
              className="bg-white text-stone-900 text-xs font-mono py-1.5 px-2.5 rounded-xl border border-[#ded5c6] focus:outline-none cursor-pointer shadow-xs"
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c} className="bg-white text-stone-900">
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
            className="p-3 rounded-2xl bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-[#ded5c6] hover:border-emerald-300 transition-all hover:rotate-180 duration-300 shadow-xs"
            title="Invert currency pair"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* To Result */}
        <div className="md:col-span-5 glass-input p-3.5 rounded-2xl border border-[#ded5c6]">
          <label className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-semibold block mb-1.5">
            BENEFICIARY CONVERTED VALUE
          </label>
          <div className="flex items-center gap-2">
            <span className="w-full text-2xl font-bold font-mono text-emerald-700 truncate tracking-tight">
              {Number(convertedTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <select
              value={toCurr}
              onChange={(e) => setToCurr(e.target.value)}
              className="bg-white text-stone-900 text-xs font-mono py-1.5 px-2.5 rounded-xl border border-[#ded5c6] focus:outline-none cursor-pointer shadow-xs"
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c} className="bg-white text-stone-900">
                  {CURRENCIES[c].flag} {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Volume Presets */}
      <div className="flex flex-wrap items-center gap-2 mt-3.5">
        <span className="text-[11px] font-mono text-stone-500 font-medium">Quick Volume:</span>
        {[1000, 5000, 10000, 50000, 100000].map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset.toString())}
            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-stone-700 border border-[#ded5c6] hover:border-stone-400 transition-all shadow-xs"
          >
            {fromInfo.symbol}{preset.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Procurement Timing Drift Model */}
      <div className="mt-4 p-4 rounded-xl bg-[#f0eae0]/80 border border-[#dfd6c6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800 mt-0.5 border border-emerald-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-stone-900">Procurement & Timing Drift Model</span>
            <p className="text-stone-600 text-[11px] mt-0.5">
              1 {fromCurr} = {currentRate.toFixed(4)} {toCurr}.
              {fromCurr === 'USD' && toCurr === 'AED' ? ' Central Bank Peg eliminates volatility risk completely.' : ''}
            </p>
          </div>
        </div>

        {fromCurr !== toCurr && (
          <div className="flex items-center gap-2.5 bg-white px-3.5 py-1.5 rounded-xl border border-[#ded5c6] self-stretch sm:self-auto justify-between shadow-xs">
            <span className="text-stone-500 text-[11px] font-semibold">Period Drift:</span>
            <span className={`font-bold font-mono flex items-center gap-1 ${isPositiveShift ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isPositiveShift ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {Math.abs(historicalImpact) > 0 ? `${toInfo.symbol}${Math.abs(historicalImpact).toFixed(2)}` : '0.00'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
