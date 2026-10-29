import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Download, Sliders, Calendar, TrendingUp, BarChart2 } from 'lucide-react';
import { CURRENCIES, MAJOR_PAIRS } from '../constants/currencies';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartSection({
  base,
  target,
  onTargetChange,
  timeframe,
  onTimeframeChange,
  timeSeriesData,
  loading,
}) {
  const [showSMA, setShowSMA] = useState(true);

  const points = timeSeriesData?.dataPoints || [];
  const stats = timeSeriesData?.stats || {};

  const baseInfo = CURRENCIES[base] || { symbol: base, flag: '' };
  const targetInfo = CURRENCIES[target] || { symbol: target, flag: '' };

  // Prepare Chart.js dataset
  const labels = points.map(p => {
    const parts = p.date.split('-');
    return `${parts[1]}/${parts[2]}`;
  });

  const rates = points.map(p => p.rate);
  const smas = points.map(p => p.sma);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${base}/${target} Exchange Rate`,
        data: rates,
        borderColor: '#10b981', // emerald-500
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 320);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.00)');
          return gradient;
        },
        fill: true,
        tension: 0.25,
        borderWidth: 2,
        pointRadius: points.length > 40 ? 0 : 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#10b981',
      },
      ...(showSMA
        ? [
            {
              label: '7-Day SMA Trend',
              data: smas,
              borderColor: '#818cf8', // indigo-400
              borderWidth: 1.8,
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
              tension: 0.3,
            },
          ]
        : []),
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#94a3b8',
          font: { family: 'ui-monospace, monospace', size: 11 },
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#e2e8f0',
        bodyColor: '#f8fafc',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        titleFont: { family: 'ui-monospace, monospace', size: 11 },
        bodyFont: { family: 'ui-monospace, monospace', size: 12, weight: 'bold' },
        callbacks: {
          label: (context) => {
            return ` ${context.dataset.label}: ${context.parsed.y} ${targetInfo.symbol || ''}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.25)' },
        ticks: {
          color: '#64748b',
          font: { family: 'ui-monospace, monospace', size: 10 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.25)' },
        ticks: {
          color: '#64748b',
          font: { family: 'ui-monospace, monospace', size: 10 },
        },
      },
    },
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (!points.length) return;
    const headers = ['Date', 'BaseCurrency', 'TargetCurrency', 'Rate', 'SMA7'];
    const rows = points.map(p => [p.date, base, target, p.rate, p.sma ?? '']);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinPulse_${base}_${target}_${timeframe}_series.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const timeframes = ['7D', '1M', '3M', '6M', '1Y'];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm mb-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
              {baseInfo.flag} {base} / {targetInfo.flag} {target}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
              Spot Market Rate
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            ECB Reference Price Action • Time Series Granularity
          </p>
        </div>

        {/* Action Buttons: Timeframe & Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe pill selector */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            {timeframes.map(tf => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all ${
                  timeframe === tf
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* SMA toggle */}
          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
              showSMA
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                : 'bg-slate-800/40 text-slate-500 border-slate-700/40 hover:text-slate-300'
            }`}
            title="Toggle 7-day Simple Moving Average trendline"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>SMA-7</span>
          </button>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Export time series to CSV for Excel/PowerBI"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Target Currency Quick-Tabs */}
      <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar border-b border-slate-800/60">
        <span className="text-xs font-mono text-slate-500 mr-1 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> Pair:
        </span>
        {MAJOR_PAIRS.filter(c => c !== base).map(currCode => {
          const info = CURRENCIES[currCode] || { flag: '' };
          const isActive = target === currCode;
          return (
            <button
              key={currCode}
              onClick={() => onTargetChange(currCode)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-700 text-white font-bold border border-slate-600'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <span>{info.flag}</span>
              <span>{currCode}</span>
            </button>
          );
        })}
      </div>

      {/* Chart Canvas */}
      <div className="h-72 sm:h-80 w-full mt-4 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-slate-400">Loading historical data...</span>
            </div>
          </div>
        ) : null}
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Bottom Technical Indicators Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono">
        <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
          <span className="text-slate-500 block text-[11px]">PERIOD MIN</span>
          <span className="text-slate-200 font-bold">{stats.min || '—'} {targetInfo.symbol}</span>
        </div>
        <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
          <span className="text-slate-500 block text-[11px]">PERIOD MAX</span>
          <span className="text-slate-200 font-bold">{stats.max || '—'} {targetInfo.symbol}</span>
        </div>
        <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
          <span className="text-slate-500 block text-[11px]">MEAN (AVG)</span>
          <span className="text-slate-200 font-bold">{stats.avg || '—'} {targetInfo.symbol}</span>
        </div>
        <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
          <span className="text-slate-500 block text-[11px]">NET MOVEMENT</span>
          <span className={`font-bold ${stats.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {stats.change > 0 ? `+${stats.change}%` : `${stats.change || 0}%`}
          </span>
        </div>
      </div>
    </div>
  );
}
