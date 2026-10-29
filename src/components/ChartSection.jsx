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

  const targetInfo = CURRENCIES[target] || { symbol: target };

  const pointsWithDelta = points.map((p, idx) => {
    const prevRate = idx > 0 ? points[idx - 1].rate : p.rate;
    const dailyReturn = prevRate ? ((p.rate - prevRate) / prevRate) * 100 : 0;
    return {
      ...p,
      dailyReturn: Number(dailyReturn.toFixed(3)),
    };
  });

  const labels = points.map((p) => {
    const parts = p.date.split('-');
    return `${parts[1]}/${parts[2]}`;
  });

  const rates = points.map((p) => p.rate);
  const smas = points.map((p) => p.sma);
  const dailyReturns = pointsWithDelta.map((p) => p.dailyReturn);

  const splineData = {
    labels,
    datasets: [
      {
        label: `${base}/${target} Rate`,
        data: rates,
        borderColor: '#059669',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 320);
          gradient.addColorStop(0, 'rgba(5, 150, 105, 0.22)');
          gradient.addColorStop(0.7, 'rgba(5, 150, 105, 0.04)');
          gradient.addColorStop(1, 'rgba(247, 244, 238, 0.00)');
          return gradient;
        },
        fill: true,
        tension: 0.35,
        borderWidth: 2.2,
        pointRadius: points.length > 50 ? 0 : 2.5,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#059669',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
      ...(showSMA
        ? [
            {
              label: '7-Day SMA',
              data: smas,
              borderColor: '#b45309',
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

  const momentumData = {
    labels,
    datasets: [
      {
        label: 'Daily Return (%)',
        data: dailyReturns,
        backgroundColor: dailyReturns.map((v) =>
          v >= 0 ? 'rgba(5, 150, 105, 0.85)' : 'rgba(225, 29, 72, 0.85)'
        ),
        borderColor: dailyReturns.map((v) => (v >= 0 ? '#059669' : '#e11d48')),
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
          color: '#57534e',
          font: { family: 'ui-monospace, monospace', size: 11 },
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(28, 25, 23, 0.94)',
        titleColor: '#e7e5e4',
        bodyColor: '#fafaf9',
        borderColor: 'rgba(214, 206, 191, 0.3)',
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
          color: 'rgba(180, 160, 135, 0.16)',
          drawBorder: false,
        },
        ticks: {
          color: '#78716c',
          font: { family: 'ui-monospace, monospace', size: 10 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: {
          color: 'rgba(180, 160, 135, 0.16)',
          drawBorder: false,
        },
        ticks: {
          color: '#78716c',
          font: { family: 'ui-monospace, monospace', size: 10 },
        },
      },
    },
  };

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
      {/* Top Header & Interactive Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e5decfa6]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-black font-mono text-stone-900 tracking-tight">
              {base} / {target}
            </span>

            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-semibold border border-emerald-300">
              ECB Spot Stream
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 font-mono">
            Tick stream trajectory and momentum analysis
          </p>
        </div>

        {/* Action Controls Deck */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart View Mode Switcher */}
          <div className="flex items-center bg-[#efeae0] p-1 rounded-xl border border-[#ded5c6]">
            <button
              onClick={() => setChartMode('spline')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                chartMode === 'spline'
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Spline View
            </button>
            <button
              onClick={() => setChartMode('momentum')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                chartMode === 'momentum'
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Momentum Bars
            </button>
          </div>

          {/* Timeframe pill selector */}
          <div className="flex items-center bg-[#efeae0] p-1 rounded-xl border border-[#ded5c6]">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-white text-stone-900 font-bold shadow-xs border border-[#ded5c6]'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* SMA toggle */}
          {chartMode === 'spline' && (
            <button
              onClick={() => setShowSMA(!showSMA)}
              className={`px-2.5 py-1.5 text-xs font-mono rounded-xl border transition-all ${
                showSMA
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                  : 'bg-white/60 text-stone-500 border-[#ded5c6] hover:text-stone-800'
              }`}
            >
              SMA-7
            </button>
          )}

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 text-xs font-mono rounded-xl bg-white/90 hover:bg-white text-stone-800 border border-[#ded5c6] transition-all hover:border-emerald-600/40 shadow-xs font-medium"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Target Currency Quick-Tabs */}
      <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar border-b border-[#e5decfa6]">
        <span className="text-[11px] font-mono text-stone-500 mr-1 uppercase tracking-wider font-semibold">
          Target:
        </span>
        {MAJOR_PAIRS.filter((c) => c !== base).map((currCode) => {
          const isActive = target === currCode;
          return (
            <button
              key={currCode}
              onClick={() => onTargetChange(currCode)}
              className={`px-3 py-1 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-stone-900 text-white font-bold shadow-xs'
                  : 'bg-white/80 text-stone-700 hover:text-stone-900 border border-[#ded5c6] hover:border-stone-400'
              }`}
            >
              {currCode}
            </button>
          );
        })}
      </div>

      {/* High / Low Watermark Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3 font-mono text-xs">
        <div className="glass-card rounded-xl p-2.5 flex items-center justify-between">
          <span className="text-stone-500 text-[10px] uppercase font-semibold">Period Low</span>
          <span className="text-rose-700 font-bold">{stats.min || '—'} {targetInfo.symbol}</span>
        </div>
        <div className="glass-card rounded-xl p-2.5 flex items-center justify-between">
          <span className="text-stone-500 text-[10px] uppercase font-semibold">Period High</span>
          <span className="text-emerald-700 font-bold">{stats.max || '—'} {targetInfo.symbol}</span>
        </div>
        <div className="glass-card rounded-xl p-2.5 flex items-center justify-between">
          <span className="text-stone-500 text-[10px] uppercase font-semibold">Mean Avg</span>
          <span className="text-stone-900 font-bold">{stats.avg || '—'} {targetInfo.symbol}</span>
        </div>
        <div className="glass-card rounded-xl p-2.5 flex items-center justify-between">
          <span className="text-stone-500 text-[10px] uppercase font-semibold">Net Shift</span>
          <span className={`font-bold ${stats.change >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {stats.change > 0 ? `+${stats.change}%` : `${stats.change || 0}%`}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 sm:h-80 w-full mt-2 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f7f4ee]/70 backdrop-blur-xs rounded-2xl z-20">
            <span className="text-xs font-mono text-stone-600">Synchronizing market history...</span>
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
