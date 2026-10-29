import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Download, Sliders, TrendingUp, BarChart2, Activity, Maximize2, ShieldAlert } from 'lucide-react';
import { CURRENCIES, MAJOR_PAIRS } from '../constants/currencies';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  const [chartMode, setChartMode] = useState('spline'); // 'spline' | 'momentum'
  const [showSMA, setShowSMA] = useState(true);

  const points = timeSeriesData?.dataPoints || [];
  const stats = timeSeriesData?.stats || {};

  const baseInfo = CURRENCIES[base] || { symbol: base, flag: '' };
  const targetInfo = CURRENCIES[target] || { symbol: target, flag: '' };

  // Calculate daily returns for momentum view
  const pointsWithDelta = points.map((p, idx) => {
    const prevRate = idx > 0 ? points[idx - 1].rate : p.rate;
    const dailyReturn = prevRate ? ((p.rate - prevRate) / prevRate) * 100 : 0;
    return {
      ...p,
      dailyReturn: Number(dailyReturn.toFixed(3)),
    };
  });

  // Prepare chart labels
  const labels = points.map((p) => {
    const parts = p.date.split('-');
    return `${parts[1]}/${parts[2]}`;
  });

  const rates = points.map((p) => p.rate);
  const smas = points.map((p) => p.sma);
  const dailyReturns = pointsWithDelta.map((p) => p.dailyReturn);

  // Line Chart Dataset
  const splineData = {
    labels,
    datasets: [
      {
        label: `${base}/${target} Exchange Rate`,
        data: rates,
        borderColor: '#10b981', // electric emerald
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 320);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
          gradient.addColorStop(0.6, 'rgba(16, 185, 129, 0.08)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.00)');
          return gradient;
        },
        fill: true,
        tension: 0.35,
        borderWidth: 2.2,
        pointRadius: points.length > 50 ? 0 : 2.5,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#10b981',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
      ...(showSMA
        ? [
            {
              label: '7-Day SMA Trend',
              data: smas,
              borderColor: '#06b6d4', // neon cyan
              borderWidth: 1.8,
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
              tension: 0.35,
            },
          ]
        : []),
    ],
  };

  // Daily Returns / Momentum Bar Dataset
  const momentumData = {
    labels,
    datasets: [
      {
        label: 'Daily Return (%)',
        data: dailyReturns,
        backgroundColor: dailyReturns.map((v) =>
          v >= 0 ? 'rgba(16, 185, 129, 0.85)' : 'rgba(244, 63, 94, 0.85)'
        ),
        borderColor: dailyReturns.map((v) => (v >= 0 ? '#10b981' : '#f43f5e')),
        borderWidth: 1,
        borderRadius: 3,
      },
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
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(3, 7, 18, 0.92)',
        titleColor: '#e2e8f0',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        displayColors: true,
        titleFont: { family: 'ui-monospace, monospace', size: 11 },
        bodyFont: { family: 'ui-monospace, monospace', size: 12, weight: 'bold' },
        callbacks: {
          label: (context) => {
            if (chartMode === 'momentum') {
              const val = context.parsed.y;
              return ` Daily Return: ${val > 0 ? `+${val}%` : `${val}%`}`;
            }
            return ` ${context.dataset.label}: ${context.parsed.y} ${targetInfo.symbol || ''}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: { family: 'ui-monospace, monospace', size: 10 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
          drawBorder: false,
        },
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
    const headers = ['Date', 'BaseCurrency', 'TargetCurrency', 'Rate', 'SMA7', 'DailyReturnPercent'];
    const rows = pointsWithDelta.map((p) => [
      p.date,
      base,
      target,
      p.rate,
      p.sma ?? '',
      p.dailyReturn,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

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
    <div className="glass-panel rounded-2xl p-5 mb-6 relative overflow-hidden">
      {/* Background ambient lighting aura */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Interactive Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.07] relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-black font-mono text-white tracking-tight flex items-center gap-2">
              <span className="text-2xl">{baseInfo.flag}</span>
              <span>{base}</span>
              <span className="text-slate-500 font-normal">/</span>
              <span className="text-2xl">{targetInfo.flag}</span>
              <span>{target}</span>
            </span>

            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-semibold border border-emerald-500/25">
              ECB Spot Stream
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            High-fidelity tick stream • Technical trajectory & momentum analyzer
          </p>
        </div>

        {/* Action Controls Deck */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart View Mode Switcher */}
          <div className="flex items-center bg-white/[0.03] p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setChartMode('spline')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                chartMode === 'spline'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Spline Wave</span>
            </button>
            <button
              onClick={() => setChartMode('momentum')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                chartMode === 'momentum'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Daily Delta</span>
            </button>
          </div>

          {/* Timeframe pill selector */}
          <div className="flex items-center bg-white/[0.03] p-1 rounded-xl border border-white/[0.08]">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-white/10 text-white font-bold border border-white/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* SMA toggle (active in spline mode) */}
          {chartMode === 'spline' && (
            <button
              onClick={() => setShowSMA(!showSMA)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono rounded-xl border transition-all ${
                showSMA
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  : 'bg-white/[0.02] text-slate-500 border-white/[0.06] hover:text-slate-300'
              }`}
              title="Toggle 7-day Simple Moving Average trendline"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>SMA-7</span>
            </button>
          )}

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-slate-200 border border-white/[0.09] transition-all hover:border-emerald-500/40"
            title="Export time series to CSV for Excel/PowerBI"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Target Currency Quick-Tabs */}
      <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar border-b border-white/[0.05] relative z-10">
        <span className="text-[11px] font-mono text-slate-400 mr-1 flex items-center gap-1 uppercase tracking-wider">
          <TrendingUp className="w-3 h-3 text-emerald-400" /> Target:
        </span>
        {MAJOR_PAIRS.filter((c) => c !== base).map((currCode) => {
          const info = CURRENCIES[currCode] || { flag: '' };
          const isActive = target === currCode;
          return (
            <button
              key={currCode}
              onClick={() => onTargetChange(currCode)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white/[0.12] text-white font-bold border border-emerald-500/40 shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)]'
                  : 'bg-white/[0.02] text-slate-400 hover:text-white border border-white/[0.06] hover:border-white/[0.15]'
              }`}
            >
              <span>{info.flag}</span>
              <span>{currCode}</span>
            </button>
          );
        })}
      </div>

      {/* Floating High / Low Watermark Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3 font-mono text-xs relative z-10">
        <div className="glass-card rounded-xl p-2.5 flex items-center justify-between">
          <span className="text-slate-400 text-[10px] uppercase">Period Low</span>
          <span className="text-rose-400 font-bold">{stats.min || '—'} {targetInfo.symbol}</span>
        </div>
        <div className="glass-card rounded-xl p-2.5 flex items-center justify-between">
          <span className="text-slate-400 text-[10px] uppercase">Period High</span>
          <span className="text-emerald-400 font-bold">{stats.max || '—'} {targetInfo.symbol}</span>
        </div>
        <div className="glass-card rounded-xl p-2.5 flex items-center justify-between">
          <span className="text-slate-400 text-[10px] uppercase">Mean Avg</span>
          <span className="text-slate-200 font-bold">{stats.avg || '—'} {targetInfo.symbol}</span>
        </div>
        <div className="glass-card rounded-xl p-2.5 flex items-center justify-between">
          <span className="text-slate-400 text-[10px] uppercase">Net Shift</span>
          <span className={`font-bold ${stats.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {stats.change > 0 ? `+${stats.change}%` : `${stats.change || 0}%`}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 sm:h-80 w-full mt-2 relative z-10">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#030712]/60 backdrop-blur-md rounded-2xl z-20">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
              <span className="text-xs font-mono text-slate-300">Synchronizing market history...</span>
            </div>
          </div>
        ) : null}

        {chartMode === 'spline' ? (
          <Line data={splineData} options={chartOptions} />
        ) : (
          <Bar data={momentumData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}
