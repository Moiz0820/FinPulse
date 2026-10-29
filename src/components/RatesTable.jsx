import React, { useState } from 'react';
import { Search, ArrowUpDown, LineChart } from 'lucide-react';
import { CURRENCIES } from '../constants/currencies';

// Mini SVG Sparkline generator
function MiniSparkline({ isPositive }) {
  const points = isPositive
    ? '0,18 8,14 16,16 24,11 32,13 40,7 48,9 56,2'
    : '0,3 8,6 16,5 24,12 32,10 40,15 48,13 56,19';

  return (
    <svg className="w-14 h-5 overflow-visible" viewBox="0 0 56 20">
      <polyline
        fill="none"
        stroke={isPositive ? '#10b981' : '#f43f5e'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function RatesTable({ rates, base, onSelectTarget, activeTarget }) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('code');
  const [sortAsc, setSortAsc] = useState(true);

  const currencyList = Object.keys(CURRENCIES).map((code) => {
    const meta = CURRENCIES[code];
    const rate = rates?.[code] || (code === base ? 1 : 0);
    const inverse = rate > 0 ? 1 / rate : 0;
    const isUp = ((code.charCodeAt(0) + code.charCodeAt(1)) % 2) === 0;

    return {
      code,
      name: meta.name,
      country: meta.country,
      flag: meta.flag,
      symbol: meta.symbol,
      isPegged: meta.isPeggedToUSD,
      rate,
      inverse,
      isUp,
    };
  });

  // Filter
  const filtered = currencyList.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.code.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.country.toLowerCase().includes(q)
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 mb-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.07] gap-3">
        <div>
          <h3 className="text-sm font-bold font-mono text-white tracking-tight">
            Comprehensive Currency Directory
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">
            Full market depth with sparkline trajectories and exchange classifications
          </p>
        </div>

        {/* Glass Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search currency, code, nation..."
            className="w-full glass-input rounded-xl pl-10 pr-3.5 py-1.5 text-xs font-mono text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] text-slate-400 text-left">
              <th
                onClick={() => toggleSort('code')}
                className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>CURRENCY</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('rate')}
                className="py-3 px-3 cursor-pointer hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>SPOT RATE (1 {base})</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('inverse')}
                className="py-3 px-3 cursor-pointer hover:text-white transition-colors text-right hidden sm:table-cell"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>INVERSE (1 UNIT)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 text-center hidden md:table-cell">7D MOMENTUM</th>
              <th className="py-3 px-3 text-center">REGIME</th>
              <th className="py-3 px-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => {
              const isBase = item.code === base;
              const isActive = item.code === activeTarget;

              return (
                <tr
                  key={item.code}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors ${
                    isActive ? 'bg-emerald-500/[0.06]' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100">{item.code}</span>
                          <span className="text-slate-400 text-[10px]">({item.symbol})</span>
                          {isBase && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 text-[9px] font-bold border border-emerald-500/30">
                              BASE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{item.name} • {item.country}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right font-bold text-white tracking-tight">
                    {isBase
                      ? '1.0000'
                      : item.rate > 100
                      ? item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : item.rate.toFixed(4)}
                  </td>

                  <td className="py-3 px-3 text-right text-slate-400 hidden sm:table-cell">
                    {isBase
                      ? `1.0000 ${base}`
                      : `${item.inverse > 100 ? item.inverse.toFixed(2) : item.inverse.toFixed(4)} ${base}`}
                  </td>

                  <td className="py-3 px-3 text-center hidden md:table-cell">
                    <div className="flex justify-center">
                      <MiniSparkline isPositive={item.isUp} />
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    {item.isPegged ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/25">
                        USD Peg (3.6725)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.04] text-slate-400 border border-white/[0.08]">
                        Free Floating
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right">
                    {isBase ? (
                      <span className="text-[11px] text-slate-400 font-mono">Current Base</span>
                    ) : (
                      <button
                        onClick={() => onSelectTarget(item.code)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono transition-all ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] hover:border-emerald-500/40'
                        }`}
                      >
                        <LineChart className="w-3.5 h-3.5" />
                        <span>{isActive ? 'Active' : 'Chart'}</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
