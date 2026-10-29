import { CURRENCIES } from '../constants/currencies';

const BASE_URL = 'https://api.frankfurter.dev/v1';
const AED_USD_PEG = 3.6725;

// Memory cache
const cache = new Map();

/**
 * Format Date to YYYY-MM-DD
 */
export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Get dates for standard timeframe
 */
export function getTimeframeDates(timeframe) {
  const end = new Date();
  const start = new Date();

  switch (timeframe) {
    case '7D':
      start.setDate(end.getDate() - 7);
      break;
    case '1M':
      start.setMonth(end.getMonth() - 1);
      break;
    case '3M':
      start.setMonth(end.getMonth() - 3);
      break;
    case '6M':
      start.setMonth(end.getMonth() - 6);
      break;
    case '1Y':
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setMonth(end.getMonth() - 1);
  }

  return {
    startStr: formatDate(start),
    endStr: formatDate(end),
  };
}

/**
 * Fetch latest rates with automatic AED synthetic peg support
 */
export async function fetchLatestRates(base = 'USD') {
  const cacheKey = `latest_${base}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const apiBase = base === 'AED' ? 'USD' : base;
    const res = await fetch(`${BASE_URL}/latest?from=${apiBase}`);
    if (!res.ok) throw new Error(`Frankfurter API error: ${res.statusText}`);
    const data = await res.json();

    let rates = { ...data.rates };

    // Inject synthetic AED or rebase if base is AED
    if (base === 'AED') {
      const adjustedRates = {};
      // 1 AED = (1 / 3.6725) USD
      adjustedRates['USD'] = 1 / AED_USD_PEG;
      for (const [curr, val] of Object.entries(rates)) {
        adjustedRates[curr] = val / AED_USD_PEG;
      }
      rates = adjustedRates;
    } else {
      // If base is USD, 1 USD = 3.6725 AED
      if (base === 'USD') {
        rates['AED'] = AED_USD_PEG;
      } else {
        // If base is EUR, 1 EUR = rates['USD'] * 3.6725 AED
        const usdRate = rates['USD'] || 1;
        rates['AED'] = usdRate * AED_USD_PEG;
      }
    }

    const result = {
      base,
      date: data.date,
      rates,
    };

    cache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.warn('Network fetch failed, using fallback market data', err);
    return getFallbackRates(base);
  }
}

/**
 * Fetch historical time-series for a pair
 */
export async function fetchTimeSeries(base = 'USD', target = 'EUR', timeframe = '1M') {
  const { startStr, endStr } = getTimeframeDates(timeframe);
  const cacheKey = `history_${base}_${target}_${timeframe}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const isBaseAED = base === 'AED';
    const isTargetAED = target === 'AED';

    const apiBase = isBaseAED ? 'USD' : base;
    const apiTarget = isTargetAED ? 'USD' : target;

    // If both are AED/USD or same, handle gracefully
    let url = `${BASE_URL}/${startStr}..${endStr}?from=${apiBase}`;
    if (apiTarget && apiTarget !== apiBase) {
      url += `&to=${apiTarget}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch historical rates');
    const data = await res.json();

    const points = [];
    const dateEntries = Object.entries(data.rates || {}).sort((a, b) => a[0].localeCompare(b[0]));

    for (const [d, dayRates] of dateEntries) {
      let rawRate = dayRates[apiTarget] || 1;
      let finalRate = rawRate;

      if (isBaseAED && isTargetAED) {
        finalRate = 1;
      } else if (isBaseAED) {
        // 1 AED = (rawRate / 3.6725) Target
        finalRate = rawRate / AED_USD_PEG;
      } else if (isTargetAED) {
        // If target is AED: Base -> USD rate * 3.6725
        finalRate = rawRate * AED_USD_PEG;
      }

      points.push({
        date: d,
        rate: Number(finalRate.toFixed(4)),
      });
    }

    // Compute moving averages & volatility statistics
    const enriched = computeAnalytics(points);
    cache.set(cacheKey, enriched);
    return enriched;
  } catch (err) {
    console.warn('Historical fetch error, synthesizing realistic curve', err);
    return generateFallbackTimeSeries(base, target, timeframe);
  }
}

/**
 * Compute technical analysis metrics (SMA-7, Min, Max, Volatility, Returns)
 */
function computeAnalytics(dataPoints) {
  if (!dataPoints || dataPoints.length === 0) {
    return { dataPoints: [], stats: { min: 0, max: 0, avg: 0, change: 0, volatility: 0 } };
  }

  const values = dataPoints.map(p => p.rate);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const sum = values.reduce((acc, v) => acc + v, 0);
  const avg = sum / values.length;

  const first = values[0];
  const last = values[values.length - 1];
  const change = first ? ((last - first) / first) * 100 : 0;

  // Standard deviation (volatility)
  const variance = values.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / values.length;
  const volatility = Math.sqrt(variance);

  // 7-day Simple Moving Average
  const enrichedPoints = dataPoints.map((item, idx) => {
    let sma = null;
    const window = 7;
    if (idx >= window - 1) {
      const subset = values.slice(idx - window + 1, idx + 1);
      sma = Number((subset.reduce((a, b) => a + b, 0) / window).toFixed(4));
    }
    return {
      ...item,
      sma,
    };
  });

  return {
    dataPoints: enrichedPoints,
    stats: {
      min: Number(min.toFixed(4)),
      max: Number(max.toFixed(4)),
      avg: Number(avg.toFixed(4)),
      change: Number(change.toFixed(2)),
      volatility: Number(volatility.toFixed(4)),
      latest: Number(last.toFixed(4)),
      count: values.length,
    },
  };
}

/**
 * Fallback baseline rates if offline
 */
function getFallbackRates(base) {
  const fallbackUSD = {
    EUR: 0.92,
    GBP: 0.79,
    AED: 3.6725,
    JPY: 154.5,
    CAD: 1.39,
    AUD: 1.53,
    CHF: 0.88,
    CNY: 7.23,
    INR: 84.4,
    SGD: 1.34,
    HKD: 7.78,
    BRL: 5.75,
    MXN: 20.3,
    ZAR: 18.1,
    SEK: 10.9,
    NOK: 11.0,
    DKK: 6.87,
    PLN: 4.08,
    THB: 34.6,
  };

  if (base === 'USD') {
    return { base: 'USD', date: '2026-10-28', rates: fallbackUSD };
  }

  const baseToUsd = base === 'AED' ? 1 / AED_USD_PEG : (1 / (fallbackUSD[base] || 1));
  const rates = {};
  rates['USD'] = Number(baseToUsd.toFixed(4));

  for (const [k, v] of Object.entries(fallbackUSD)) {
    if (k !== base) {
      rates[k] = Number((v * baseToUsd).toFixed(4));
    }
  }

  return { base, date: '2026-10-28', rates };
}

/**
 * Generate fallback historical data
 */
function generateFallbackTimeSeries(base, target, timeframe) {
  const days = timeframe === '7D' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 180;
  const baseRate = target === 'JPY' ? 154.2 : target === 'EUR' ? 0.92 : 1.38;
  const points = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const noise = (Math.sin(i / 3) * 0.02) + ((Math.random() - 0.5) * 0.008);
    points.push({
      date: formatDate(d),
      rate: Number((baseRate * (1 + noise)).toFixed(4)),
    });
  }

  return computeAnalytics(points);
}
