'use client';

import { useState, useEffect, useRef } from 'react';

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
  const stats = [
    { label: 'Total Return', value: '+128.5%', color: 'text-[#4a9d7e]', trend: 'up' },
    { label: 'Annualized ROI', value: '32.4%', color: 'text-[#4a9d7e]', trend: 'up' },
    { label: 'Max Drawdown', value: '8.6%', color: 'text-rose-500', trend: 'down' },
    { label: 'Sharpe Ratio', value: '2.84', color: 'text-blue-400', trend: 'neutral' },
  ];

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
                className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  activeTab === tab
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
              className={`bg-[#252836]/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-800 hover:border-gray-700 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
        <div className={`bg-[#252836]/60 backdrop-blur-md rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-12 border border-gray-800 relative group transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
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
          
          <div className="h-[250px] sm:h-[300px] md:h-[400px] w-full mt-6 sm:mt-8 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 400" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a9d7e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#4a9d7e" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <line x1="0" y1="100" x2="1000" y2="100" stroke="#333" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="200" x2="1000" y2="200" stroke="#333" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="300" x2="1000" y2="300" stroke="#333" strokeWidth="1" strokeDasharray="5,5" />
              
              <path 
                d="M0,350 L100,340 L200,345 L300,330 L400,335 L500,320 L600,325 L700,310 L800,315 L900,300 L1000,305" 
                fill="none" 
                stroke="#444" 
                strokeWidth="3" 
              />
              
              <path 
                d="M0,350 L100,320 L200,280 L300,290 L400,230 L500,180 L600,200 L700,140 L800,110 L900,130 L1000,50 L1000,400 L0,400 Z" 
                fill="url(#chartGradient)" 
              />
              
              <path 
                d="M0,350 L100,320 L200,280 L300,290 L400,230 L500,180 L600,200 L700,140 L800,110 L900,130 L1000,50" 
                fill="none" 
                stroke="#4a9d7e" 
                strokeWidth="5" 
                filter="url(#glow)"
                className={isVisible ? 'animate-draw' : ''}
              />
              
              {isVisible && (
                <>
                  <circle cx="1000" cy="50" r="8" fill="#4a9d7e" />
                  <circle cx="1000" cy="50" r="15" fill="#4a9d7e" fillOpacity="0.2" className="animate-ping" />
                </>
              )}
            </svg>
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
