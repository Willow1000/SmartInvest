'use client';

import React, { useState } from 'react';
import { useModal } from '../auth/ModalContext';

export default function InvestmentAnalytics() {
  const { performanceHistory, analytics, currencyProfits } = useModal();

  // Calculate chart dimensions and points
  const width = 800;
  const height = 300;
  const padding = 40;
  const maxValue = Math.max(...performanceHistory.map(d => d.value));
  const minValue = Math.min(...performanceHistory.map(d => d.value));
  const range = maxValue - minValue;

  const points = performanceHistory.map((d, i) => {
    const x = (i / (performanceHistory.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((d.value - minValue) / range) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  const fillPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    const paddingRatio = padding / width;
    const innerRatio = (width - padding * 2) / width;

    // Calculate index based on mouse position relative to inner chart area
    let index = Math.round(((ratio - paddingRatio) / innerRatio) * (performanceHistory.length - 1));
    index = Math.max(0, Math.min(performanceHistory.length - 1, index));
    setHoverIdx(index);
  };

  return (
    <div id="analytics" className="space-y-8 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Investment Analytics</h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-2">Institutional Performance Metrics</p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-800/30 p-1 rounded-xl border border-gray-800/50">
          {['1M', '3M', '6M', '1Y', 'YTD'].map((period) => (
            <button
              key={period}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${period === '1Y' ? 'bg-[#4a9d7e] text-white' : 'text-gray-500 hover:text-white'
                }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Main Performance Graph */}
      <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-[2.5rem] p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#4a9d7e]" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Portfolio Value</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500/50" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Benchmark (S&P 500)</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Cumulative Performance</p>
          <h3 className="text-4xl font-bold text-white tracking-tight">
            +32.54% <span className="text-[#4a9d7e] text-sm ml-2 font-medium">↑ Outperforming Benchmark</span>
          </h3>
        </div>

        <div className="relative h-[350px] w-full">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible cursor-crosshair relative z-20"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIdx(null)}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4a9d7e" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4a9d7e" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1={padding}
                y1={padding + (i * (height - padding * 2)) / 4}
                x2={width - padding}
                y2={padding + (i * (height - padding * 2)) / 4}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}

            {/* Area Fill */}
            <polygon points={fillPoints} fill="url(#lineGradient)" />

            {/* Performance Line */}
            <polyline
              points={points}
              fill="none"
              stroke="#4a9d7e"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_10px_rgba(74,157,126,0.5)]"
            />

            {/* Data Points */}
            {performanceHistory.map((d, i) => {
              const x = (i / (performanceHistory.length - 1)) * (width - padding * 2) + padding;
              const y = height - ((d.value - minValue) / range) * (height - padding * 2) - padding;

              // Only show dot if it's currently hovered, or keep static ones visible on small screens
              const isHovered = hoverIdx === i;

              return (
                <g key={i} className="group/point">
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#4a9d7e"
                    className={`transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 md:opacity-20'}`}
                  />
                  {isHovered && (
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill="#4a9d7e"
                      fillOpacity="0.2"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip Container */}
          {hoverIdx !== null && (
            <div
              className="absolute top-0 bottom-0 w-px bg-white/20 z-30 pointer-events-none"
              style={{ left: `${(padding + (hoverIdx / (performanceHistory.length - 1)) * (width - padding * 2)) / width * 100}%` }}
            >
              <div
                className="absolute w-4 h-4 bg-[#1a1d29] border-2 border-[#4a9d7e] rounded-full shadow-[0_0_15px_#4a9d7e] -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${(height - ((performanceHistory[hoverIdx].value - minValue) / range) * (height - padding * 2) - padding) / height * 100}%`, left: '0' }}
              />
              <div className={`absolute top-[10%] bg-[#252836] border border-gray-700 py-3 px-4 rounded-xl min-w-[130px] shadow-2xl z-40 flex flex-col gap-1 -translate-x-1/2 ${hoverIdx > performanceHistory.length / 2 ? '-ml-[70px]' : 'ml-[70px]'}`}>
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{performanceHistory[hoverIdx].date}</span>
                <span className="text-white font-bold text-lg">${performanceHistory[hoverIdx].value.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* X-Axis Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-[40px] translate-y-4">
            {performanceHistory.map((d, i) => (
              <span key={i} className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                {d.date.split('-')[1]}/{d.date.split('-')[0].slice(2)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Institutional Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6">
          <p className="text-gray-500 text-[9px] uppercase tracking-[0.2em] font-bold mb-4">Risk-Adjusted Return</p>
          <div className="flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-bold text-white mb-1">{analytics.sharpeRatio}</h4>
              <p className="text-[10px] text-[#4a9d7e] font-bold uppercase tracking-widest">Sharpe Ratio</p>
            </div>
            <div className="w-12 h-12 bg-[#4a9d7e]/10 rounded-xl flex items-center justify-center border border-[#4a9d7e]/20 text-[#4a9d7e]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6">
          <p className="text-gray-500 text-[9px] uppercase tracking-[0.2em] font-bold mb-4">Market Sensitivity</p>
          <div className="flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-bold text-white mb-1">{analytics.beta}</h4>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Beta Coefficient</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 text-blue-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6">
          <p className="text-gray-500 text-[9px] uppercase tracking-[0.2em] font-bold mb-4">Annualized Growth</p>
          <div className="flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-bold text-white mb-1">{analytics.cagr}%</h4>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">CAGR</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 text-purple-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6">
          <p className="text-gray-500 text-[9px] uppercase tracking-[0.2em] font-bold mb-4">Portfolio Volatility</p>
          <div className="flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-bold text-white mb-1">{analytics.volatility}%</h4>
              <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Standard Deviation</p>
            </div>
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20 text-rose-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Projection Engine */}
      <div className="bg-gradient-to-br from-[#1a1d29] to-[#252836] border border-gray-800/50 rounded-[2.5rem] p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <span className="text-[#4a9d7e] text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">Projection Engine v4.2</span>
              <h3 className="text-3xl font-bold text-white tracking-tight">Monte Carlo Predictive Analysis</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our institutional-grade simulation engine runs 10,000+ iterations across multiple economic scenarios to project your portfolio's terminal value. This computation accounts for historical volatility, asset correlation, and macro-economic forecasting.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-1">95% Confidence Level</p>
                <p className="text-xl font-bold text-white">$184,250.00</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-1">Expected Annual Yield</p>
                <p className="text-xl font-bold text-[#4a9d7e]">+24.8%</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-[#4a9d7e] animate-pulse" />
              <span>Real-time computation active</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Asset Contribution Analysis</h4>
            {currencyProfits.map((asset) => (
              <div key={asset.symbol} className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-400">{asset.name}</span>
                  <span className="text-white">Contribution: {((asset.profit / analytics.timeWeightedReturn) * 10).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4a9d7e] to-blue-500 rounded-full"
                    style={{ width: `${(asset.profit / (currencyProfits.reduce((a, b) => a + b.profit, 0))) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
