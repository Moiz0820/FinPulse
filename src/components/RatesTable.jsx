import React, { useState } from 'react';
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
      symbol: meta.symbol,
      isPegged: meta.isPeggedToUSD,
      rate,
      inverse,
    };
  });

  const filtered = currencyList.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.code.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.country.toLowerCase().includes(q)
    );
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e5decfa6] gap-3">
        <div>
          <h3 className="text-sm font-bold font-mono text-stone-900 tracking-tight">
            Comprehensive Currency Directory
          </h3>
          <p className="text-[11px] text-stone-500 font-mono">
            Full market depth and currency exchange classifications
          </p>
        </div>

        {/* Clean Text Search Input (No Search Icon) */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by code, name, country..."
            className="w-full glass-input rounded-xl px-4 py-2 text-xs font-mono text-stone-900 placeholder-stone-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-[#ded5c6] text-stone-500 text-left">
              <th
                onClick={() => toggleSort('code')}
                className="py-3 px-3 cursor-pointer hover:text-stone-900 transition-colors font-semibold"
              >
                CURRENCY
              </th>
              <th
                onClick={() => toggleSort('rate')}
                className="py-3 px-3 cursor-pointer hover:text-stone-900 transition-colors text-right font-semibold"
              >
                SPOT RATE (1 {base})
              </th>
              <th
                onClick={() => toggleSort('inverse')}
                className="py-3 px-3 cursor-pointer hover:text-stone-900 transition-colors text-right hidden sm:table-cell font-semibold"
              >
                INVERSE (1 UNIT)
              </th>
              <th className="py-3 px-3 text-center font-semibold">REGIME</th>
              <th className="py-3 px-3 text-right font-semibold">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => {
              const isBase = item.code === base;
              const isActive = item.code === activeTarget;

              return (
                <tr
                  key={item.code}
                  className={`border-b border-[#e5decfa6] hover:bg-white/70 transition-colors ${
                    isActive ? 'bg-emerald-50/70' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{item.code}</span>
                        <span className="text-stone-500 text-[10px]">({item.symbol})</span>
                        {isBase && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold border border-emerald-300">
                            BASE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500">{item.name} • {item.country}</div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right font-bold text-stone-900 tracking-tight">
                    {isBase
                      ? '1.0000'
                      : item.rate > 100
                      ? item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : item.rate.toFixed(4)}
                  </td>

                  <td className="py-3 px-3 text-right text-stone-600 hidden sm:table-cell">
                    {isBase
                      ? `1.0000 ${base}`
                      : `${item.inverse > 100 ? item.inverse.toFixed(2) : item.inverse.toFixed(4)} ${base}`}
                  </td>

                  <td className="py-3 px-3 text-center">
                    {item.isPegged ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                        USD Peg (3.6725)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-stone-100 text-stone-600 border border-stone-200">
                        Free Floating
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right">
                    {isBase ? (
                      <span className="text-[11px] text-stone-400 font-mono">Current Base</span>
                    ) : (
                      <button
                        onClick={() => onSelectTarget(item.code)}
                        className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-mono transition-all ${
                          isActive
                            ? 'bg-emerald-700 text-white font-bold shadow-xs'
                            : 'bg-white hover:bg-stone-50 text-stone-700 border border-[#ded5c6] hover:border-stone-400 shadow-xs'
                        }`}
                      >
                        {isActive ? 'Active' : 'Chart'}
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
