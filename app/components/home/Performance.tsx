'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

// Enhanced realistic market data generator
const generateRealisticPath = (seed: number, points: number, startY: number, endY: number, volatility: number, width: number, height: number, minMargin: number, trend: 'bullish' | 'bearish' | 'sideways' = 'bullish') => {
  let currentY = startY;
  const walk = [startY];
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Add realistic market patterns
  let momentum = 0;
  let trendStrength = trend === 'bullish' ? 0.6 : trend === 'bearish' ? -0.4 : 0;
  
  for (let i = 1; i < points; i++) {
    // Add momentum and mean reversion
    const randomWalk = (random() - 0.5) * volatility;
    momentum = momentum * 0.9 + randomWalk * 0.1; // Momentum decay
    
    // Add trend influence
    const trendInfluence = trendStrength * (1 - Math.abs(i - points/2) / (points/2)); // Stronger trend in middle
    
    // Add some volatility clustering
    const volatilityMultiplier = 0.8 + Math.abs(randomWalk) * 0.4;
    
    currentY += momentum * volatilityMultiplier + trendInfluence;
    
    // Add realistic pullbacks (especially for bullish trend)
    if (trend === 'bullish' && i % 15 === 0 && random() > 0.7) {
      currentY += volatility * 2; // Occasional pullback
    }
    
    walk.push(currentY);
  }

  // Smooth final position
  const finalDrift = walk[points - 1];
  const correctionPerStep = (endY - finalDrift) / (points - 1);

  let path = `M0,${startY}`;
  const stepX = width / (points - 1);
  const pointData = [{ x: 0, y: startY }];

  for (let i = 1; i < points; i++) {
    walk[i] += correctionPerStep * i;
    const y = Math.max(minMargin, Math.min(height - minMargin, walk[i]));
    path += ` L${(i * stepX).toFixed(1)},${y.toFixed(1)}`;
    pointData.push({ x: i * stepX, y });
  }
  
  return { path, points: pointData };
};

// Generate multiple realistic scenarios
const generateScenarios = (baseSeed: number, timeframe: string) => {
  const points = timeframe === '6M' ? 180 : timeframe === '1Y' ? 365 : timeframe === '2Y' ? 730 : 1460;
  
  return {
    smartInvest: generateRealisticPath(baseSeed, points, 350, 180, 25, 1000, 400, 10, 'bullish'),
    sp500: generateRealisticPath(baseSeed + 1000, points, 350, 280, 15, 1000, 400, 10, 'sideways'),
    nasdaq: generateRealisticPath(baseSeed + 2000, points, 350, 260, 18, 1000, 400, 10, 'bullish'),
    bonds: generateRealisticPath(baseSeed + 3000, points, 350, 320, 8, 1000, 400, 10, 'sideways'),
    endY: 180
  };
};

export default function Performance() {
  const [activeTab, setActiveTab] = useState('6M');
  const [isVisible, setIsVisible] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 2000);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const tabs = ['6M', '1Y', '2Y', 'All'];
  const metrics = ['all', 'returns', 'risk', 'volatility'];

  const chartData = useMemo(() => ({
    '6M': {
      ...generateScenarios(1, '6M'),
      stats: [
        { label: 'Total Return', value: '+34.2%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Annualized ROI', value: '78.5%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Max Drawdown', value: '4.2%', color: 'text-rose-500', trend: 'down' },
        { label: 'Sharpe Ratio', value: '2.45', color: 'text-blue-400', trend: 'neutral' },
        { label: 'Win Rate', value: '68.4%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Volatility', value: '12.3%', color: 'text-yellow-500', trend: 'neutral' },
      ],
    },
    '1Y': {
      ...generateScenarios(2, '1Y'),
      stats: [
        { label: 'Total Return', value: '+85.4%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Annualized ROI', value: '85.4%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Max Drawdown', value: '6.8%', color: 'text-rose-500', trend: 'down' },
        { label: 'Sharpe Ratio', value: '2.68', color: 'text-blue-400', trend: 'neutral' },
        { label: 'Win Rate', value: '72.1%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Volatility', value: '15.7%', color: 'text-yellow-500', trend: 'neutral' },
      ],
    },
    '2Y': {
      ...generateScenarios(3, '2Y'),
      stats: [
        { label: 'Total Return', value: '+142.8%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Annualized ROI', value: '55.8%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Max Drawdown', value: '8.6%', color: 'text-rose-500', trend: 'down' },
        { label: 'Sharpe Ratio', value: '2.84', color: 'text-blue-400', trend: 'neutral' },
        { label: 'Win Rate', value: '69.8%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Volatility', value: '18.2%', color: 'text-yellow-500', trend: 'neutral' },
      ],
    },
    'All': {
      ...generateScenarios(4, 'All'),
      stats: [
        { label: 'Total Return', value: '+215.1%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Annualized ROI', value: '46.2%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Max Drawdown', value: '11.4%', color: 'text-rose-500', trend: 'down' },
        { label: 'Sharpe Ratio', value: '2.92', color: 'text-blue-400', trend: 'neutral' },
        { label: 'Win Rate', value: '71.3%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Volatility', value: '21.4%', color: 'text-yellow-500', trend: 'neutral' },
      ],
    }
  }), []);

  const currentData = chartData[activeTab as keyof typeof chartData];
  const stats = currentData.stats;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isVisible) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    const idx = Math.min(currentData.smartInvest.points.length - 1, Math.max(0, Math.round(ratio * (currentData.smartInvest.points.length - 1))));
    setHoverIdx(idx);
  };

  const handleTabChange = (tab: string) => {
    setIsAnimating(true);
    setActiveTab(tab);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <section id="performance" ref={sectionRef} className="bg-[#1a1d29] py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background with animated gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4a9d7e]/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-2xl mb-6 sm:mb-8 lg:mb-0">
            <h2 className="text-[#4a9d7e] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-2 sm:mb-4">Real Results</h2>
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Unrivaled Market Performance</h3>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
              Our algorithms consistently outperform benchmark indices while maintaining rigorous risk parameters across all market conditions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Time Period Tabs */}
            <div className="flex bg-[#252836]/50 backdrop-blur-md p-1.5 rounded-2xl border border-gray-800">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === tab
                    ? 'bg-[#4a9d7e] text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Metric Filter */}
            <div className="flex bg-[#252836]/50 backdrop-blur-md p-1.5 rounded-2xl border border-gray-800">
              {metrics.map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-4 py-3 text-xs font-bold rounded-xl transition-all duration-300 ${selectedMetric === metric
                    ? 'bg-[#4a9d7e] text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {metric === 'all' ? 'All' : metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-[#252836]/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800 hover:border-gray-700 transition-all duration-1000 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <p className="text-gray-500 text-xs sm:text-sm font-medium mb-2 sm:mb-3 tracking-wide">{stat.label}</p>
              <div className="flex items-end space-x-2">
                <span className={`text-xl sm:text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                {stat.trend === 'up' && (
                  <svg className="w-5 h-5 text-[#4a9d7e] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )}
                {stat.trend === 'down' && (
                  <svg className="w-5 h-5 text-rose-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Chart Visualization */}
        <div className={`bg-[#252836]/60 backdrop-blur-md rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-12 border border-gray-800 relative group transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${isAnimating ? 'animate-pulse' : ''}`}>
          <div className="absolute top-4 sm:top-8 right-4 sm:right-8 md:right-12 flex flex-wrap gap-2 sm:gap-4 text-[8px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#4a9d7e]" />
              <span>SmartInvest</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-gray-600" />
              <span>S&P 500</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>NASDAQ</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-yellow-600" />
              <span>Bonds</span>
            </div>
          </div>

          <div className="h-[300px] sm:h-[350px] md:h-[450px] w-full mt-6 sm:mt-8 relative group">
            <svg
              className="w-full h-full overflow-visible cursor-crosshair relative z-20"
              viewBox="0 0 1000 400"
              preserveAspectRatio="none"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverIdx(null)}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a9d7e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#4a9d7e" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="nasdaqGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                </filter>
              </defs>

              {/* Grid lines */}
              {[100, 200, 300].map((y) => (
                <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#333" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
              ))}

              {/* Bond Line */}
              <path
                d={currentData.bonds.path}
                fill="none"
                stroke="#ca8a04"
                strokeWidth="2"
                strokeLinejoin="round"
                opacity="0.7"
                style={{ transition: 'all 1s ease-in-out' }}
              />

              {/* NASDAQ Line */}
              <path
                d={currentData.nasdaq.path}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinejoin="round"
                opacity="0.8"
                style={{ transition: 'all 1s ease-in-out' }}
              />

              {/* S&P 500 Line */}
              <path
                d={currentData.sp500.path}
                fill="none"
                stroke="#666"
                strokeWidth="3"
                strokeLinejoin="round"
                style={{ transition: 'all 1s ease-in-out' }}
              />

              {/* SmartInvest Area */}
              <path
                d={`${currentData.smartInvest.path} L1000,400 L0,400 Z`}
                fill="url(#chartGradient)"
                style={{ transition: 'all 1s ease-in-out' }}
              />

              {/* SmartInvest Line */}
              <path
                d={currentData.smartInvest.path}
                fill="none"
                stroke="#4a9d7e"
                strokeWidth="4"
                strokeLinejoin="round"
                filter="url(#glow)"
                style={{ transition: 'all 1s ease-in-out' }}
                className={isVisible ? 'animate-draw' : ''}
              />

              {/* End point indicators */}
              {isVisible && (
                <>
                  <circle cx="1000" cy={currentData.endY} r="8" fill="#4a9d7e" style={{ transition: 'all 1s ease-in-out' }} />
                  <circle cx="1000" cy={currentData.endY} r="15" fill="#4a9d7e" fillOpacity="0.2" className="animate-ping" style={{ transition: 'all 1s ease-in-out' }} />
                </>
              )}
            </svg>

            {/* Enhanced Interactive Hover Tooltip */}
            {hoverIdx !== null && (
              <div
                className="absolute top-0 bottom-0 w-px bg-white/30 z-30 pointer-events-none"
                style={{ left: `${(hoverIdx / (currentData.smartInvest.points.length - 1)) * 100}%` }}
              >
                {/* Multiple data points */}
                <div
                  className="absolute w-3 h-3 bg-[#1a1d29] border-2 border-[#666] rounded-full"
                  style={{ top: `${(currentData.sp500.points[hoverIdx].y / 400) * 100}%`, left: '0', transform: 'translate(-50%, -50%)' }}
                />
                <div
                  className="absolute w-3 h-3 bg-[#1a1d29] border-2 border-[#3b82f6] rounded-full"
                  style={{ top: `${(currentData.nasdaq.points[hoverIdx].y / 400) * 100}%`, left: '0', transform: 'translate(-50%, -50%)' }}
                />
                <div
                  className="absolute w-3 h-3 bg-[#1a1d29] border-2 border-[#ca8a04] rounded-full"
                  style={{ top: `${(currentData.bonds.points[hoverIdx].y / 400) * 100}%`, left: '0', transform: 'translate(-50%, -50%)' }}
                />
                <div
                  className="absolute w-4 h-4 bg-[#1a1d29] border-2 border-[#4a9d7e] rounded-full shadow-[0_0_15px_#4a9d7e]"
                  style={{ top: `${(currentData.smartInvest.points[hoverIdx].y / 400) * 100}%`, left: '0', transform: 'translate(-50%, -50%)' }}
                />

                {/* Enhanced Tooltip Box */}
                <div className={`absolute top-[10%] bg-[#252836] border border-gray-700 p-4 rounded-xl pointer-events-none min-w-[180px] shadow-2xl z-40 flex flex-col gap-2 ${hoverIdx > currentData.smartInvest.points.length * 0.7 ? 'right-full mr-4' : 'left-full ml-4'}`}>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4a9d7e]" />
                      <span className="text-gray-400 text-xs font-bold uppercase">SmartInvest</span>
                    </div>
                    <span className="text-white font-bold text-sm">${(10000 * (1 + (350 - currentData.smartInvest.points[hoverIdx].y) / 100)).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#666]" />
                      <span className="text-gray-400 text-xs font-bold uppercase">S&P 500</span>
                    </div>
                    <span className="text-white font-bold text-sm">${(10000 * (1 + (350 - currentData.sp500.points[hoverIdx].y) / 200)).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                      <span className="text-gray-400 text-xs font-bold uppercase">NASDAQ</span>
                    </div>
                    <span className="text-white font-bold text-sm">${(10000 * (1 + (350 - currentData.nasdaq.points[hoverIdx].y) / 180)).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ca8a04]" />
                      <span className="text-gray-400 text-xs font-bold uppercase">Bonds</span>
                    </div>
                    <span className="text-white font-bold text-sm">${(10000 * (1 + (350 - currentData.bonds.points[hoverIdx].y) / 250)).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8 flex justify-between text-gray-500 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest overflow-x-auto">
            <span>Oct 2024</span>
            <span>Nov 2024</span>
            <span>Dec 2024</span>
            <span>Jan 2025</span>
            <span>Feb 2025</span>
            <span>Mar 2025</span>
            <span>Apr 2025</span>
          </div>
        </div>
      </div>
    </section>
  );
}
