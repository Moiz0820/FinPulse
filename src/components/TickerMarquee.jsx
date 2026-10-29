import React from 'react';
import { CURRENCIES } from '../constants/currencies';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TickerMarquee({ rates, base }) {
  if (!rates) return null;

  const keyPairs = ['EUR', 'GBP', 'AED', 'JPY', 'CHF', 'CAD', 'AUD', 'INR', 'CNY', 'SGD'];

  const items = keyPairs.map((code) => {
    const meta = CURRENCIES[code] || { flag: '', symbol: '' };
    const rate = rates[code] || 1;
    const pseudoChange = ((code.charCodeAt(0) % 5) - 2) * 0.15;
    const isUp = pseudoChange >= 0;

    return {
      code,
      meta,
      rate: rate > 100 ? rate.toFixed(1) : rate > 1 ? rate.toFixed(3) : rate.toFixed(4),
      change: pseudoChange.toFixed(2),
      isUp,
    };
  });

  const marqueeList = [...items, ...items];

  return (
    <div className="w-full bg-[#eee8dc] border-y border-[#dfd6c6] overflow-hidden py-1.5 backdrop-blur-md select-none">
      <div className="animate-marquee flex items-center gap-8">
        {marqueeList.map((item, index) => (
          <div key={`${item.code}-${index}`} className="flex items-center gap-2 font-mono text-xs whitespace-nowrap">
            <span className="text-base">{item.meta.flag}</span>
            <span className="font-bold text-stone-800">{base}/{item.code}</span>
            <span className="text-stone-900 font-semibold">{item.rate}</span>
            <span
              className={`flex items-center text-[10px] font-semibold px-1 py-0.2 rounded ${
                item.isUp
                  ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100/80 text-rose-800 border border-rose-300'
              }`}
            >
              {item.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {item.isUp ? `+${item.change}%` : `${item.change}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
