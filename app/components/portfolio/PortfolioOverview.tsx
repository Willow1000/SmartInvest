'use client';

import { useState, useMemo } from 'react';
import { useModal } from '../auth/ModalContext';
import TradingAutomations from './TradingAutomations';

// Deterministic random walk generator for realistic charts
const generatePath = (seed: number, pointsCount: number, startY: number, endY: number, volatility: number) => {
  let currentY = startY;
  const walk = [startY];

  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 1; i < pointsCount; i++) {
    currentY += (random() - 0.5) * volatility;
    walk.push(currentY);
  }

  const finalDrift = walk[pointsCount - 1];
  const correctionPerStep = (endY - finalDrift) / (pointsCount - 1);

  let path = `M0,${startY}`;
  const stepX = 800 / (pointsCount - 1);

  const points = [{ x: 0, y: startY }];
  for (let i = 1; i < pointsCount; i++) {
    walk[i] += correctionPerStep * i;
    const y = Math.max(5, Math.min(195, walk[i]));
    const x = i * stepX;
    path += ` L${x.toFixed(1)},${y.toFixed(1)}`;
    points.push({ x, y });
  }
  return { path, points };
};

export default function PortfolioOverview() {
  const { openDeposit, openWithdraw, balance, currencyProfits, transactions } = useModal();
  const [activeTimeframe, setActiveTimeframe] = useState('ALL');

  const totalEarnings = currencyProfits.reduce((acc, curr) => acc + curr.profit, 0);
  const totalInvestment = currencyProfits.reduce((acc, curr) => acc + curr.investment, 0);
  const earningsPercent = totalInvestment > 0 ? (totalEarnings / totalInvestment) * 100 : 0;

  const chartData = useMemo(() => ({
    '1D': {
      pathData: generatePath(1, 100, 150, 120, 10),
      percent: "+0.85%",
    },
    '1W': {
      pathData: generatePath(2, 100, 140, 90, 15),
      percent: "+3.20%",
    },
    '1M': {
      pathData: generatePath(3, 100, 160, 80, 20),
      percent: "+8.45%",
    },
    'YTD': {
      pathData: generatePath(4, 100, 180, 60, 25),
      percent: "+15.30%",
    },
    'ALL': {
      pathData: generatePath(5, 100, 190, 40, 30),
      percent: `+${earningsPercent.toFixed(2)}%`,
    }
  }), [earningsPercent]);

  const currentData = chartData[activeTimeframe as keyof typeof chartData];
  const mockAreaPoints = `${currentData.pathData.path} L800,200 L0,200 Z`;

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    const idx = Math.min(99, Math.max(0, Math.round(ratio * 99)));
    setHoverIdx(idx);
  };

  return (
    <div className="space-y-24 md:space-y-32">

      {/* SECTION 1: OVERVIEW & PERFORMANCE (Full Height / Prominent) */}
      <section className="min-h-[85vh] flex flex-col justify-center relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4a9d7e]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 relative z-10 w-full max-w-7xl mx-auto">
          <div>
            <p className="text-[#4a9d7e] font-bold text-xs uppercase tracking-[0.2em] mb-4">Total Portfolio Equity</p>
            <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tighter mb-4">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h1>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-[#4a9d7e]/20 text-[#4a9d7e] rounded-lg font-bold text-lg flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {currentData.percent}
              </div>
              <span className="text-gray-500 font-medium">{activeTimeframe === 'ALL' ? 'All Time' : activeTimeframe}</span>
            </div>
          </div>

          <div className="mt-8 md:mt-0 flex flex-col items-end gap-6">
            <div className="flex bg-[#1a1d29]/80 p-1.5 rounded-xl border border-gray-800/50 backdrop-blur-md">
              {['1D', '1W', '1M', 'YTD', 'ALL'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-4 py-2 ${activeTimeframe === tf ? 'bg-[#252836] text-white shadow-md' : 'text-gray-500 hover:text-white'} rounded-lg text-xs font-bold transition-all`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={openDeposit} className="px-8 py-3 bg-[#4a9d7e] hover:bg-[#3d8567] text-white rounded-xl font-bold text-sm tracking-wide transition-colors">
                Quick Deposit
              </button>
              <button onClick={openWithdraw} className="px-8 py-3 bg-[#252836] hover:bg-[#2c3040] text-white border border-gray-700/50 rounded-xl font-bold text-sm tracking-wide transition-colors">
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Large Faux SVG Chart */}
        <div className="relative w-full max-w-7xl mx-auto h-80 md:h-[400px] bg-[#1a1d29]/40 border border-gray-800/50 rounded-3xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d29] to-transparent z-10 pointer-events-none" />

          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-8 px-4 z-0 opacity-20 pointer-events-none">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-gray-600" />)}
          </div>

          <svg
            className="absolute inset-0 w-full h-full object-cover z-20 cursor-crosshair"
            preserveAspectRatio="none"
            viewBox="0 0 800 200"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIdx(null)}
          >
            <defs>
              <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a9d7e" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4a9d7e" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={mockAreaPoints} fill="url(#chartGlow)" className="origin-bottom pointer-events-none" style={{ transition: 'all 1s ease-in-out', transform: 'scaleY(1)' }} />
            <path d={currentData.pathData.path} fill="none" stroke="#4a9d7e" strokeWidth="2" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(74,157,126,0.8)] pointer-events-none" style={{ transition: 'all 1s ease-in-out' }} />
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoverIdx !== null && (
            <div
              className="absolute top-0 bottom-0 w-px bg-white/30 z-30 pointer-events-none"
              style={{ left: `${(hoverIdx / 99) * 100}%` }}
            >
              <div
                className="absolute left-0 w-4 h-4 bg-[#1a1d29] border-2 border-[#4a9d7e] rounded-full shadow-[0_0_15px_#4a9d7e]"
                style={{ top: `${(currentData.pathData.points[hoverIdx].y / 200) * 100}%`, transform: 'translate(-50%, -50%)' }}
              />
              <div className={`absolute top-[20%] bg-[#252836] border border-gray-700 p-3 rounded-xl pointer-events-none min-w-[120px] shadow-2xl z-40 ${hoverIdx > 70 ? 'right-full mr-4' : 'left-full ml-4'}`}>
                <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Portfolio Value</p>
                <p className="text-white font-bold text-lg">
                  ${(balance * (1 - (currentData.pathData.points[hoverIdx].y - 100) * 0.002)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: ASSET ALLOCATION & ADVANCED ANALYTICS (Full Height) */}
      <section className="min-h-[75vh] flex flex-col justify-center w-full max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">Asset Intelligence</h2>
          <p className="text-gray-400 text-lg">Deep dive into your portfolio's composition and risk vectors.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Asset Allocation Donut / breakdown */}
          <div className="lg:col-span-1 bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />
            <h3 className="text-2xl font-bold text-white mb-8">Allocation</h3>

            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                {/* Background */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="12" />

                {/* Crypto: 65% */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#4a9d7e" strokeWidth="12"
                  strokeDasharray="163.36 251.327" strokeDashoffset="0"
                  className={`transition-all duration-300 cursor-pointer hover:stroke-[16px] ${hoveredAsset && hoveredAsset !== 'Crypto' ? 'opacity-30' : 'opacity-100'}`}
                  onMouseEnter={() => setHoveredAsset('Crypto')}
                  onMouseLeave={() => setHoveredAsset(null)}
                />

                {/* Stocks: 25% */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="12"
                  strokeDasharray="62.83 251.327" strokeDashoffset="-163.36"
                  className={`transition-all duration-300 cursor-pointer hover:stroke-[16px] ${hoveredAsset && hoveredAsset !== 'Stocks' ? 'opacity-30' : 'opacity-100'}`}
                  onMouseEnter={() => setHoveredAsset('Stocks')}
                  onMouseLeave={() => setHoveredAsset(null)}
                />

                {/* Cash: 10% */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#6b7280" strokeWidth="12"
                  strokeDasharray="25.13 251.327" strokeDashoffset="-226.19"
                  className={`transition-all duration-300 cursor-pointer hover:stroke-[16px] ${hoveredAsset && hoveredAsset !== 'Cash' ? 'opacity-30' : 'opacity-100'}`}
                  onMouseEnter={() => setHoveredAsset('Cash')}
                  onMouseLeave={() => setHoveredAsset(null)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
                <span className={`text-3xl font-bold transition-colors ${hoveredAsset === 'Crypto' ? 'text-[#4a9d7e]' : hoveredAsset === 'Stocks' ? 'text-purple-400' : hoveredAsset === 'Cash' ? 'text-gray-400' : 'text-white'}`}>
                  {hoveredAsset ? (hoveredAsset === 'Crypto' ? '65%' : hoveredAsset === 'Stocks' ? '25%' : '10%') : '4'}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{hoveredAsset || 'Assets'}</span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Cryptocurrency', pct: '65%', color: 'bg-[#4a9d7e]' },
                { label: 'Stocks & ETFs', pct: '25%', color: 'bg-purple-500' },
                { label: 'Cash / Stables', pct: '10%', color: 'bg-gray-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-gray-300 font-medium text-sm">{item.label}</span>
                  </div>
                  <span className="text-white font-bold">{item.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics & Metrics Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset List Details */}
            <div className="md:col-span-2 bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Position Performance</h3>
              <div className="space-y-4">
                {currencyProfits.map((asset, index) => (
                  <div key={`${asset.symbol}-${index}`} className="flex justify-between items-center p-4 bg-[#1a1d29]/40 border border-gray-800/50 rounded-2xl hover:border-[#4a9d7e]/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#252836] rounded-xl flex items-center justify-center border border-gray-700">
                        <span className="text-[#4a9d7e] font-bold text-xs">{asset.symbol}</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">{asset.name}</p>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Invested: ${asset.investment.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#4a9d7e] font-bold text-lg">+${asset.profit.toLocaleString()}</p>
                      <p className="text-[#4a9d7e] text-xs font-bold leading-none bg-[#4a9d7e]/10 inline-block px-2 py-1 rounded mt-1">
                        +{asset.profitPercent}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="bg-[#252836]/30 border border-gray-800/50 rounded-3xl p-6">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-2">Sharpe Ratio</p>
              <h4 className="text-3xl font-bold text-white mb-2">2.4<span className="text-emerald-500 text-xs ml-2 align-middle px-2 py-0.5 bg-emerald-500/10 rounded-full">↑ Excellent</span></h4>
              <p className="text-gray-400 text-xs mt-4">Risk-adjusted return significantly outperforms the market average.</p>
            </div>
            <div className="bg-[#252836]/30 border border-gray-800/50 rounded-3xl p-6">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-2">Max Drawdown</p>
              <h4 className="text-3xl font-bold text-white mb-2">-8.5%<span className="text-emerald-500 text-xs ml-2 align-middle px-2 py-0.5 bg-emerald-500/10 rounded-full">Secure</span></h4>
              <p className="text-gray-400 text-xs mt-4">Calculated over a 12-month rolling period with high confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: AUTOMATIONS (Full Height) */}
      <section id="automations" className="min-h-[85vh] flex flex-col justify-center scroll-mt-24">
        <TradingAutomations />
      </section>

      {/* SECTION 4: LEDGER (Full Height) */}
      <section className="min-h-[75vh] flex flex-col justify-center pb-24 w-full max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">Transaction Ledger</h2>
          <p className="text-gray-400 text-lg">Full audit trail of your account activity, deposits, and algorithmic executions.</p>
        </div>

        <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 lg:p-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-40">Date & Time</th>
                  <th className="py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</th>
                  <th className="py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reference ID</th>
                  <th className="py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr key={tx.id || idx} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                    <td className="py-6">
                      <span className="text-gray-300 font-medium">{tx.timestamp}</span>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {tx.type === 'deposit' ? '↓' : '↑'}
                        </div>
                        <span className="text-white font-bold capitalize">{tx.type}</span>
                      </div>
                    </td>
                    <td className="py-6 text-gray-500 font-mono text-xs">
                      {tx.id ? tx.id : `TXN-${Math.floor(Math.random() * 900000 + 100000)}`}
                    </td>
                    <td className="py-6">
                      <span className="px-3 py-1 bg-gray-800 text-gray-300 text-[10px] font-bold uppercase tracking-widest rounded-full">
                        {tx.status || 'Completed'}
                      </span>
                    </td>
                    <td className={`py-6 text-right font-bold text-lg ${tx.type === 'deposit' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && (
              <div className="py-12 text-center text-gray-500 font-medium">No transactions found matching the criteria.</div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button className="px-6 py-3 bg-[#1a1d29] hover:bg-[#252836] border border-gray-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
              Download CSV Ledger
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
