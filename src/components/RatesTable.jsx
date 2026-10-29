import React, { useState } from 'react';
import { Search, ArrowUpDown, LineChart, CheckCircle2 } from 'lucide-react';
import { CURRENCIES } from '../constants/currencies';

export default function RatesTable({ rates, base, onSelectTarget, activeTarget }) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('code');
  const [sortAsc, setSortAsc] = useState(true);

  const currencyList = Object.keys(CURRENCIES).map((code) => {
    const meta = CURRENCIES[code];
    const rate = rates?.[code] || (code === base ? 1 : 0);
    const inverse = rate > 0 ? 1 / rate : 0;

    return {
      code,
      name: meta.name,
      country: meta.country,
      flag: meta.flag,
      symbol: meta.symbol,
      isPegged: meta.isPeggedToUSD,
      rate,
      inverse,
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
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h3 className="text-sm font-bold font-mono text-white">Global Exchange Rates Directory</h3>
          <p className="text-[11px] text-slate-400 font-mono">
            Full market depth for 30+ world reserve and emerging currencies
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search currency, country..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-left">
              <th
                onClick={() => toggleSort('code')}
                className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>CURRENCY</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('rate')}
                className="py-3 px-3 cursor-pointer hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>SPOT RATE (1 {base})</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('inverse')}
                className="py-3 px-3 cursor-pointer hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>INVERSE (1 UNIT)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-3 text-center">EXCHANGE REGIME</th>
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
                  className={`border-b border-slate-800/40 hover:bg-slate-800/40 transition-colors ${
                    isActive ? 'bg-emerald-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{item.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-200">{item.code}</span>
                          <span className="text-slate-500 text-[10px]">({item.symbol})</span>
                          {isBase && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[9px] border border-emerald-500/20">
                              BASE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{item.name} • {item.country}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right font-bold text-slate-100">
                    {isBase
                      ? '1.0000'
                      : item.rate > 100
                      ? item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : item.rate.toFixed(4)}
                  </td>

                  <td className="py-3 px-3 text-right text-slate-400">
                    {isBase
                      ? `1.0000 ${base}`
                      : `${item.inverse > 100 ? item.inverse.toFixed(2) : item.inverse.toFixed(4)} ${base}`}
                  </td>

                  <td className="py-3 px-3 text-center">
                    {item.isPegged ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        USD Pegged (3.6725)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400 border border-slate-700/60">
                        Free Floating
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right">
                    {isBase ? (
                      <span className="text-[11px] text-slate-600 font-mono">Current Base</span>
                    ) : (
                      <button
                        onClick={() => onSelectTarget(item.code)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                      >
                        <LineChart className="w-3 h-3" />
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
