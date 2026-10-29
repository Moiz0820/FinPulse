import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import ChartSection from './components/ChartSection';
import CurrencyConverter from './components/CurrencyConverter';
import CrossRateMatrix from './components/CrossRateMatrix';
import RatesTable from './components/RatesTable';
import Footer from './components/Footer';
import { fetchLatestRates, fetchTimeSeries } from './services/api';
import { CURRENCIES, MAJOR_PAIRS } from './constants/currencies';
import { RefreshCw, Coins, TrendingUp } from 'lucide-react';

export default function App() {
  const [base, setBase] = useState('USD');
  const [target, setTarget] = useState('EUR');
  const [timeframe, setTimeframe] = useState('1M');

  const [latestData, setLatestData] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);

  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);

  // Load latest rates when base changes
  useEffect(() => {
    let isMounted = true;
    setRatesLoading(true);

    fetchLatestRates(base)
      .then((data) => {
        if (isMounted) {
          setLatestData(data);
          setRatesLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching latest rates:', err);
        if (isMounted) setRatesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [base]);

  // Load time series whenever base, target, or timeframe changes
  useEffect(() => {
    let isMounted = true;
    setChartLoading(true);

    fetchTimeSeries(base, target, timeframe)
      .then((data) => {
        if (isMounted) {
          setTimeSeriesData(data);
          setChartLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching time series:', err);
        if (isMounted) setChartLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [base, target, timeframe]);

  // Handler when user selects a cross-rate pair from the matrix
  const handleSelectPair = (newBase, newTarget) => {
    setBase(newBase);
    setTarget(newTarget);
    // Smooth scroll to top of chart
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSelectTarget = (newTarget) => {
    setTarget(newTarget);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Terminal Sub-header & Base Currency Command Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 backdrop-blur-sm mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-slate-400">Terminal Base Anchor</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-emerald-400 border border-slate-700">
                  {latestData?.date ? `As of ${latestData.date}` : 'Real-time'}
                </span>
              </div>
              <h2 className="text-base font-bold font-mono text-white">
                Base Currency: <span className="text-emerald-400">{CURRENCIES[base]?.flag} {base}</span>
                <span className="text-xs font-normal text-slate-400 ml-2">({CURRENCIES[base]?.name})</span>
              </h2>
            </div>
          </div>

          {/* Quick Base Currency Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-mono text-slate-500 mr-1 hidden sm:inline">Set Base:</span>
            {MAJOR_PAIRS.map((curr) => {
              const meta = CURRENCIES[curr];
              const isCurrent = base === curr;
              return (
                <button
                  key={curr}
                  onClick={() => {
                    if (curr === target) {
                      setTarget(base); // swap if selecting current target
                    }
                    setBase(curr);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{meta?.flag}</span>
                  <span>{curr}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. Metric Overview Cards */}
        <MetricCards
          base={base}
          rates={latestData?.rates}
          activeTarget={target}
          activeStats={timeSeriesData?.stats}
        />

        {/* 2. Interactive Chart Section */}
        <ChartSection
          base={base}
          target={target}
          onTargetChange={setTarget}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          timeSeriesData={timeSeriesData}
          loading={chartLoading}
        />

        {/* 3. Currency Converter & Procurement Calculator */}
        <CurrencyConverter
          rates={latestData?.rates}
          base={base}
          activeTarget={target}
          onBaseChange={setBase}
          onTargetChange={setTarget}
          activeStats={timeSeriesData?.stats}
        />

        {/* 4. Cross-Currency Parity Matrix */}
        <CrossRateMatrix
          rates={latestData?.rates}
          base={base}
          onSelectPair={handleSelectPair}
        />

        {/* 5. Comprehensive Directory / Table of all 30+ Currencies */}
        <RatesTable
          rates={latestData?.rates}
          base={base}
          onSelectTarget={handleSelectTarget}
          activeTarget={target}
        />
      </main>

      <Footer />
    </div>
  );
}
