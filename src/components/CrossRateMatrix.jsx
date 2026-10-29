import React from 'react';
import { Grid, Eye } from 'lucide-react';
import { CURRENCIES, MAJOR_PAIRS } from '../constants/currencies';

export default function CrossRateMatrix({ rates, base, onSelectPair }) {
  // Cross-rate calculation relative to the unified base rates
  const getCrossRate = (rowCurr, colCurr) => {
    if (rowCurr === colCurr) return 1.0;
    const rowRate = rates?.[rowCurr] || 1;
    const colRate = rates?.[colCurr] || 1;

    // Both rates are relative to active base
    // 1 rowCurr = (colRate / rowRate) colCurr
    return colRate / rowRate;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Grid className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white">Cross-Currency Parity Matrix</h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Interbank exchange matrix • Click any intersection to load into active chart
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-cyan-400" /> Click cell to inspect
        </span>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr>
              <th className="p-2.5 text-left text-slate-500 font-medium border-b border-slate-800 bg-slate-950/40">
                BASE \ QUOTE
              </th>
              {MAJOR_PAIRS.map((col) => (
                <th
                  key={col}
                  className="p-2.5 text-center text-slate-300 font-bold border-b border-slate-800 bg-slate-950/40 min-w-[70px]"
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
              <tr key={row} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-2.5 font-bold text-slate-300 border-b border-slate-800/60 bg-slate-950/20">
                  <div className="flex items-center gap-1.5">
                    <span>{CURRENCIES[row]?.flag}</span>
                    <span>{row}</span>
                  </div>
                </td>
                {MAJOR_PAIRS.map((col) => {
                  const isDiagonal = row === col;
                  const rate = getCrossRate(row, col);
                  const formatted = isDiagonal ? '1.0000' : rate > 100 ? rate.toFixed(1) : rate > 1 ? rate.toFixed(3) : rate.toFixed(4);

                  return (
                    <td
                      key={col}
                      onClick={() => !isDiagonal && onSelectPair(row, col)}
                      className={`p-2.5 text-center border-b border-slate-800/60 transition-all ${
                        isDiagonal
                          ? 'text-slate-600 bg-slate-950/40 cursor-default'
                          : 'text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer font-medium'
                      }`}
                      title={!isDiagonal ? `Click to chart 1 ${row} = ${formatted} ${col}` : ''}
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
