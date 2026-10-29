import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TickerMarquee from './components/TickerMarquee';
import MetricCards from './components/MetricCards';
import ChartSection from './components/ChartSection';
import CurrencyConverter from './components/CurrencyConverter';
import CrossRateMatrix from './components/CrossRateMatrix';
import RatesTable from './components/RatesTable';
import Footer from './components/Footer';
import { fetchLatestRates, fetchTimeSeries } from './services/api';
import { CURRENCIES, MAJOR_PAIRS } from './constants/currencies';
import { Coins } from 'lucide-react';

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

  // Handlers
  const handleSelectPair = (newBase, newTarget) => {
    setBase(newBase);
    setTarget(newTarget);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleSelectTarget = (newTarget) => {
    setTarget(newTarget);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-stone-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-900 relative overflow-x-hidden">
      {/* Ambient background warm glows */}
      <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#ebe1cf]/60 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-[30%] right-[-10%] w-[650px] h-[650px] bg-[#ebd8c1]/45 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-[#dbe8dc]/40 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* 1. Header */}
      <Header />

      {/* 2. Real-time Ticker Marquee */}
      <TickerMarquee rates={latestData?.rates} base={base} />

      {/* Main Terminal Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Terminal Sub-header & Base Currency Command Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4.5 rounded-2xl mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-600 p-[1.5px] shadow-xs">
              <div className="w-full h-full bg-[#fdfbf7] rounded-[10px] p-2">
                <Coins className="w-5 h-5 text-emerald-700" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-semibold">
                  TERMINAL BASE ANCHOR
                </span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-[10px] font-mono text-emerald-800 border border-emerald-300 font-semibold">
                  {latestData?.date ? `Sync: ${latestData.date}` : 'Real-time Feed'}
                </span>
              </div>
              <h2 className="text-base font-bold font-mono text-stone-900 mt-0.5">
                Base Currency: <span className="text-emerald-700 font-extrabold">{CURRENCIES[base]?.flag} {base}</span>
                <span className="text-xs font-normal text-stone-500 ml-2">({CURRENCIES[base]?.name})</span>
              </h2>
            </div>
          </div>

          {/* Quick Base Currency Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-mono text-stone-500 mr-1 hidden sm:inline uppercase tracking-wider font-semibold">
              Set Base:
            </span>
            {MAJOR_PAIRS.map((curr) => {
              const meta = CURRENCIES[curr];
              const isCurrent = base === curr;
              return (
                <button
                  key={curr}
                  onClick={() => {
                    if (curr === target) {
                      setTarget(base);
                    }
                    setBase(curr);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    isCurrent
                      ? 'bg-stone-900 text-white font-bold shadow-xs'
                      : 'bg-white/80 text-stone-700 hover:text-stone-900 border border-[#ded5c6] hover:border-stone-400'
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

        {/* 2. Interactive Chart Section (Spline Wave + Daily Delta Momentum) */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
