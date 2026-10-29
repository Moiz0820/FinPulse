import React from 'react';
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
        <div>
          <h3 className="text-sm font-bold font-mono text-stone-900 tracking-tight">
            Interbank Cross-Parity Matrix
          </h3>
          <p className="text-[11px] text-stone-500 font-mono">
            Cross currency rates • Click any cell to target and plot
          </p>
        </div>
        <span className="text-[11px] font-mono text-stone-600 bg-[#efeae0] px-2.5 py-1 rounded-full border border-[#ded5c6]">
          Interactive Cell Selector
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
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MAJOR_PAIRS.map((row) => (
              <tr key={row} className="hover:bg-white/60 transition-colors">
                <td className="p-3 font-bold text-stone-900 border-b border-[#e5decfa6] bg-[#f0eae0]/30">
                  {row}
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
