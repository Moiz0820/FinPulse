import React from 'react';
import { Grid, Eye } from 'lucide-react';
import { CURRENCIES, MAJOR_PAIRS } from '../constants/currencies';

export default function CrossRateMatrix({ rates, base, onSelectPair }) {
  const getCrossRate = (rowCurr, colCurr) => {
    if (rowCurr === colCurr) return 1.0;
    const rowRate = rates?.[rowCurr] || 1;
    const colRate = rates?.[colCurr] || 1;
    return colRate / rowRate;
  };

  return (
    <div className="glass-panel rounded-2xl p-5 mb-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#e5decfa6] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 border border-amber-200 text-amber-800">
            <Grid className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-stone-900 tracking-tight">
              Interbank Cross-Parity Matrix
            </h3>
            <p className="text-[11px] text-stone-500 font-mono">
              Real-time cross currency exchange rates • Click any cell to target and plot
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-stone-600 flex items-center gap-1.5 bg-[#efeae0] px-2.5 py-1 rounded-full border border-[#ded5c6]">
          <Eye className="w-3.5 h-3.5 text-amber-700" /> Interactive Cell Selector
        </span>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left text-stone-500 font-semibold border-b border-[#ded5c6] bg-[#f0eae0]/60">
                BASE \ QUOTE
              </th>
              {MAJOR_PAIRS.map((col) => (
                <th
                  key={col}
                  className="p-3 text-center text-stone-800 font-bold border-b border-[#ded5c6] bg-[#f0eae0]/60 min-w-[75px]"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{CURRENCIES[col]?.flag}</span>
                    <span>{col}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MAJOR_PAIRS.map((row) => (
              <tr key={row} className="hover:bg-white/60 transition-colors">
                <td className="p-3 font-bold text-stone-900 border-b border-[#e5decfa6] bg-[#f0eae0]/30">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{CURRENCIES[row]?.flag}</span>
                    <span>{row}</span>
                  </div>
                </td>
                {MAJOR_PAIRS.map((col) => {
                  const isDiagonal = row === col;
                  const rate = getCrossRate(row, col);
                  const formatted = isDiagonal
                    ? '1.0000'
                    : rate > 100
                    ? rate.toFixed(1)
                    : rate > 1
                    ? rate.toFixed(3)
                    : rate.toFixed(4);

                  return (
                    <td
                      key={col}
                      onClick={() => !isDiagonal && onSelectPair(row, col)}
                      className={`p-3 text-center border-b border-[#e5decfa6] transition-all ${
                        isDiagonal
                          ? 'text-stone-400 bg-stone-100/40 cursor-default'
                          : 'text-stone-800 hover:text-emerald-800 hover:bg-emerald-50 cursor-pointer font-medium'
                      }`}
                      title={!isDiagonal ? `Select 1 ${row} = ${formatted} ${col}` : ''}
                    >
                      {formatted}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
