# ⚡ FinPulse | Global FX & Macro Financial Intelligence Terminal

> An institutional-grade, zero-latency Foreign Exchange & Macroeconomic intelligence terminal built with React 19, Tailwind CSS v4, and Chart.js, powered by live European Central Bank (ECB) reference rates via Frankfurter API.

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.x-38bdf8.svg)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384.svg)](https://www.chartjs.org/)
[![API](https://img.shields.io/badge/Data-Frankfurter%20ECB%20API-success.svg)](https://www.frankfurter.app/)

---

## 📸 Key Features

- 🟢 **Live Spot Rate Feeds**: Real-time European Central Bank (ECB) official benchmark rates across 30+ global currencies.
- 🇦🇪 **GCC / UAE Dirham (AED) Synthetic Anchor**: Integrated peg engine (3.6725 USD/AED) for seamless Middle East & cross-border commercial modeling.
- 📈 **Interactive Technical Time-Series Chart**:
  - Timeframe toggles (`7D`, `1M`, `3M`, `6M`, `1Y`).
  - Overlayable **7-Day Simple Moving Average (SMA-7)** trend line.
  - Granular tooltips, period high/low, mean average, and net movement percentage.
- 📉 **Volatility Index (σ)**: Standard deviation computations to quantify exchange rate risk.
- 🧮 **Smart Converter & Procurement Simulator**:
  - Immediate zero-spread cross-currency conversion.
  - **Purchasing Power Drift Analyzer**: Simulates gains or losses due to foreign exchange fluctuation over 30/90-day periods.
- 🌐 **Interbank Cross-Rate Parity Matrix**:
  - Interactive multi-currency matrix (USD, EUR, GBP, JPY, CHF, CAD, AUD, AED).
  - Click any intersection cell to directly focus and chart that currency pair.
- 📊 **Tabular Currency Directory**:
  - Instant live search & multi-column sorting (rate, inverse rate, currency code).
- 💾 **Data Engineering Export**:
  - 1-click **Export to CSV** for historical rate analysis in Microsoft Excel, Power BI, or Python/Pandas.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, Vite 8
- **Styling**: Tailwind CSS v4, Lucide Icons, Glassmorphic Bloomberg-terminal design
- **Data Visualization**: Chart.js, React-ChartJS-2
- **Data Providers**:
  - [Frankfurter Open API](https://www.frankfurter.app/) (Official European Central Bank feeds)
  - [Public APIs Collection](https://github.com/public-apis/public-apis)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Moiz0820/finpulse-forex-terminal.git

# Navigate into the project directory
cd finpulse-forex-terminal

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

## 🌐 Deployment to GitHub Pages

This project is pre-configured with relative asset paths (`base: './'`) for 1-click GitHub Pages deployment:

1. Push this repository to GitHub under `Moiz0820/finpulse-forex-terminal`.
2. Go to **Settings > Pages** on GitHub.
3. Select **GitHub Actions** or deploy from the `dist` branch.

---

## 👨‍💻 Author

**Moiz Anwar**
- **GitHub**: [@Moiz0820](https://github.com/Moiz0820)
- **Role**: AI & Data Science Engineer / Business Data & Analytics Specialist
