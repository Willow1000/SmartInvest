'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

const generatePath = (seed: number, points: number, startY: number, endY: number, volatility: number, width: number, height: number, minMargin: number) => {
  let currentY = startY;
  const walk = [startY];

  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 1; i < points; i++) {
    currentY += (random() - 0.5) * volatility;
    walk.push(currentY);
  }

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

export default function Performance() {
  const [activeTab, setActiveTab] = useState('6M');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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

  const chartData = useMemo(() => ({
    '6M': {
      smartInvest: generatePath(1, 100, 350, 180, 20, 1000, 400, 10),
      sp500: generatePath(2, 100, 350, 280, 10, 1000, 400, 10),
      endY: 180,
      stats: [
        { label: 'Total Return', value: '+34.2%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Annualized ROI', value: '78.5%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Max Drawdown', value: '4.2%', color: 'text-rose-500', trend: 'down' },
        { label: 'Sharpe Ratio', value: '2.45', color: 'text-blue-400', trend: 'neutral' },
      ],
    },
    '1Y': {
      smartInvest: generatePath(3, 100, 350, 120, 25, 1000, 400, 10),
      sp500: generatePath(4, 100, 350, 240, 12, 1000, 400, 10),
      endY: 120,
      stats: [
        { label: 'Total Return', value: '+85.4%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Annualized ROI', value: '85.4%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Max Drawdown', value: '6.8%', color: 'text-rose-500', trend: 'down' },
        { label: 'Sharpe Ratio', value: '2.68', color: 'text-blue-400', trend: 'neutral' },
      ],
    },
    '2Y': {
      smartInvest: generatePath(5, 100, 350, 80, 35, 1000, 400, 10),
      sp500: generatePath(6, 100, 350, 200, 15, 1000, 400, 10),
      endY: 80,
      stats: [
        { label: 'Total Return', value: '+142.8%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Annualized ROI', value: '55.8%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Max Drawdown', value: '8.6%', color: 'text-rose-500', trend: 'down' },
        { label: 'Sharpe Ratio', value: '2.84', color: 'text-blue-400', trend: 'neutral' },
      ],
    },
    'All': {
      smartInvest: generatePath(7, 100, 350, 40, 40, 1000, 400, 10),
      sp500: generatePath(8, 100, 350, 160, 20, 1000, 400, 10),
      endY: 40,
      stats: [
        { label: 'Total Return', value: '+215.1%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Annualized ROI', value: '46.2%', color: 'text-[#4a9d7e]', trend: 'up' },
        { label: 'Max Drawdown', value: '11.4%', color: 'text-rose-500', trend: 'down' },
        { label: 'Sharpe Ratio', value: '2.92', color: 'text-blue-400', trend: 'neutral' },
      ],
    }
  }), []);

  const currentData = chartData[activeTab as keyof typeof chartData];
  const smartArea = `${currentData.smartInvest.path} L1000,400 L0,400 Z`;
  const stats = currentData.stats;

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    const idx = Math.min(99, Math.max(0, Math.round(ratio * 99)));
    setHoverIdx(idx);
  };

  return (
    <section id="performance" ref={sectionRef} className="bg-[#1a1d29] py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4a9d7e]/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-2xl mb-6 sm:mb-8 lg:mb-0">
            <h2 className="text-[#4a9d7e] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-2 sm:mb-4">Real Results</h2>
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Unrivaled Market Performance</h3>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
              Our algorithms consistently outperform benchmark indices while maintaining rigorous risk parameters.
            </p>
          </div>

          <div className="flex bg-[#252836]/50 backdrop-blur-md p-1.5 rounded-2xl border border-gray-800 self-start">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === tab
                  ? 'bg-[#4a9d7e] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-[#252836]/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-800 hover:border-gray-700 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <p className="text-gray-500 text-xs sm:text-sm font-medium mb-2 sm:mb-3 tracking-wide">{stat.label}</p>
              <div className="flex items-end space-x-2">
                <span className={`text-xl sm:text-2xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</span>
                {stat.trend === 'up' && (
                  <svg className="w-6 h-6 text-[#4a9d7e] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chart Visualization */}
        <div className={`bg-[#252836]/60 backdrop-blur-md rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-12 border border-gray-800 relative group transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
          <div className="absolute top-4 sm:top-8 right-4 sm:right-8 md:right-12 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6 text-[8px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#4a9d7e]" />
              <span>SmartInvest Strategy</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-gray-600" />
              <span>S&P 500 Index</span>
            </div>
          </div>

          <div className="h-[250px] sm:h-[300px] md:h-[400px] w-full mt-6 sm:mt-8 relative group">
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
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <line x1="0" y1="100" x2="1000" y2="100" stroke="#333" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="200" x2="1000" y2="200" stroke="#333" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="300" x2="1000" y2="300" stroke="#333" strokeWidth="1" strokeDasharray="5,5" />

              <path
                d={currentData.sp500.path}
                fill="none"
                stroke="#444"
                strokeWidth="3"
                strokeLinejoin="round"
                style={{ transition: 'all 1s ease-in-out' }}
              />

              <path
                d={smartArea}
                fill="url(#chartGradient)"
                style={{ transition: 'all 1s ease-in-out' }}
              />

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

              {isVisible && (
                <>
                  <circle cx="1000" cy={currentData.endY} r="8" fill="#4a9d7e" style={{ transition: 'all 1s ease-in-out' }} />
                  <circle cx="1000" cy={currentData.endY} r="15" fill="#4a9d7e" fillOpacity="0.2" className="animate-ping" style={{ transition: 'all 1s ease-in-out' }} />
                </>
              )}
            </svg>

            {/* Interactive Hover Tooltip */}
            {hoverIdx !== null && (
              <div
                className="absolute top-0 bottom-0 w-px bg-white/30 z-30 pointer-events-none"
                style={{ left: `${(hoverIdx / 99) * 100}%` }}
              >
                {/* S&P 500 Dot */}
                <div
                  className="absolute w-3 h-3 bg-[#1a1d29] border-2 border-[#444] rounded-full"
                  style={{ top: `${(currentData.sp500.points[hoverIdx].y / 400) * 100}%`, left: '0', transform: 'translate(-50%, -50%)' }}
                />
                {/* SmartInvest Dot */}
                <div
                  className="absolute w-4 h-4 bg-[#1a1d29] border-2 border-[#4a9d7e] rounded-full shadow-[0_0_15px_#4a9d7e]"
                  style={{ top: `${(currentData.smartInvest.points[hoverIdx].y / 400) * 100}%`, left: '0', transform: 'translate(-50%, -50%)' }}
                />

                {/* Tooltip Box */}
                <div className={`absolute top-[10%] bg-[#252836] border border-gray-700 p-4 rounded-xl pointer-events-none min-w-[150px] shadow-2xl z-40 flex flex-col gap-2 ${hoverIdx > 70 ? 'right-full mr-4' : 'left-full ml-4'}`}>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4a9d7e]" />
                      <span className="text-gray-400 text-xs font-bold uppercase">SmartInvest</span>
                    </div>
                    <span className="text-white font-bold">${(10000 * (1 + (350 - currentData.smartInvest.points[hoverIdx].y) / 100)).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#444]" />
                      <span className="text-gray-400 text-xs font-bold uppercase">S&P 500</span>
                    </div>
                    <span className="text-white font-bold">${(10000 * (1 + (350 - currentData.sp500.points[hoverIdx].y) / 200)).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
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
          </div>
        </div>
      </div>
    </section>
  );
}
