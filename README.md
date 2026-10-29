# FinPulse

An institutional-grade Foreign Exchange & Macroeconomic intelligence terminal built with React 19, Tailwind CSS v4, and Chart.js, powered by live European Central Bank (ECB) reference rates via Frankfurter API.

Live Application: https://moiz0820.github.io/FinPulse/

---

## Overview

FinPulse provides real-time foreign exchange monitoring, technical price trajectory analysis, and quantitative procurement impact simulations across 30+ world reserve and emerging currencies. 

Built with an editorial warm-beige aesthetic and pure typographic design, the platform operates client-side with zero subscription barriers and automated GitHub Actions deployment.

---

## Core Capabilities

- **Live Spot Rate Stream**: Real-time European Central Bank (ECB) official reference rates across 30+ global currencies.
- **GCC / UAE Dirham (AED) Synthetic Anchor**: Integrated central bank peg calculation (3.6725 USD/AED) for Middle East and cross-border commercial transactions.
- **Quantitative Time-Series Engine**:
  - Timeframe toggles (7D, 1M, 3M, 6M, 1Y).
  - Overlayable 7-Day Simple Moving Average (SMA-7) trendline.
  - Granular tooltips, period high/low watermarks, mean average, and net shift percentage.
- **Daily Delta Momentum**: Bar chart visualizing day-over-day percentage gains and losses against zero baseline.
- **Volatility Dispersion Metric**: Standard deviation calculation quantifying exchange rate risk over selected time horizons.
- **Procurement & Drift Simulator**:
  - Zero-spread cross-currency conversion.
  - Fluctuation timing impact model analyzing purchasing power drift over 30 and 90-day procurement cycles.
- **Interbank Cross-Parity Matrix**:
  - Multi-currency matrix across major pairs (USD, EUR, GBP, JPY, CHF, CAD, AUD, AED).
  - Click any intersection cell to directly focus and plot that currency pair.
- **Tabular Currency Directory**:
  - Real-time client-side search and multi-column sorting (rate, inverse rate, currency code).
- **Tabular Data Export**:
  - 1-click CSV export of historical time-series datasets formatted for Microsoft Excel, Power BI, and Python/Pandas workflows.

---

## Architecture & Tech Stack

- **Framework**: React 19, Vite 8
- **Styling**: Tailwind CSS v4, Custom Warm Beige Glassmorphism, Pure Typographic Layout
- **Data Visualization**: Chart.js, React-ChartJS-2
- **Data Sources**:
  - Frankfurter Open API (Official European Central Bank feeds)
  - Public APIs Collection

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Moiz0820/FinPulse.git

# Navigate into the project directory
cd FinPulse

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## Deployment

This repository is configured for automated continuous deployment to GitHub Pages via GitHub Actions.

Every push to the `main` branch automatically triggers the build workflow defined in `.github/workflows/deploy.yml` and updates the live site at:
https://moiz0820.github.io/FinPulse/

---

## Author

**Moiz Anwar**
- GitHub: [@Moiz0820](https://github.com/Moiz0820)
- Role: AI & Data Science Engineer / Business Data & Analytics Specialist
- Portfolio: https://github.com/Moiz0820/Portfolio
