'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function TradingAssets() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const assets = [
    {
      id: 1,
      name: 'Cryptocurrencies',
      description: 'Trade Bitcoin, Ethereum, and 50+ altcoins with institutional liquidity and 12ms execution.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      trend: '-0.60%',
    },
    {
      id: 2,
      name: 'Forex Markets',
      description: 'Access 60+ major, minor, and exotic currency pairs with spreads starting from 0.0 pips.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      trend: '-0.10%',
    },
    {
      id: 3,
      name: 'Precious Metals',
      description: 'Hedge your portfolio with Gold, Silver, and Platinum trading against major global currencies.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      trend: '+1.38%',
    },
    {
      id: 4,
      name: 'Global Stocks',
      description: 'Direct market access to NYSE, NASDAQ, and LSE. Trade fractional shares of top global companies.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      trend: '-0.43%',
    },
    {
      id: 5,
      name: 'Energy & Oil',
      description: 'Trade Brent Crude, Natural Gas, and WTI with low margin requirements and deep liquidity.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      trend: '+2.78%',
    },
    {
      id: 6,
      name: 'Market Indices',
      description: 'Broad exposure to global markets with S&P 500, NASDAQ 100, and DAX 40 indices.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      trend: '-0.30%',
    },
    {
      id: 7,
      name: 'ETF Portfolios',
      description: 'Diversified thematic baskets covering AI, Green Energy, and Emerging Markets.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      trend: '-0.48%',
    },
    {
      id: 8,
      name: 'Treasury Bonds',
      description: 'Institutional access to US Treasuries and European Government Bonds with fixed yields.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      trend: '-1.37%',
    },
  ];

  // Double the assets for a seamless marquee loop
  const marqueeAssets = [...assets, ...assets];

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

  return (
    <section id="assets" ref={sectionRef} className="bg-[#1a1d29] py-16 sm:py-24 md:py-32 overflow-hidden">
      {/* Embedded Animation Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @media (max-width: 640px) {
          .marquee-track {
            animation: marquee 30s linear infinite;
          }
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-[#4a9d7e] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4">Diversified Exposure</h2>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Global Investment Options</h3>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            One platform, infinite possibilities. Access 8+ asset classes with institutional-grade execution and deep liquidity.
          </p>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative mt-8 sm:mt-10 group">
        <div className="marquee-track py-3 sm:py-4">
          {marqueeAssets.map((asset, index) => (
            <div
              key={`${asset.id}-${index}`}
              className="w-[280px] sm:w-[320px] md:w-[350px] lg:w-[400px] mx-2 sm:mx-3 md:mx-4 flex-shrink-0 group/card bg-[#252836]/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-gray-800 hover:border-[#4a9d7e]/60 hover:bg-[#252836]/50 transition-all duration-500 cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-14 md:w-16 bg-[#4a9d7e]/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 md:mb-8 text-[#4a9d7e] group-hover/card:scale-110 group-hover/card:bg-[#4a9d7e]/20 transition-all duration-500 shadow-[0_0_15px_rgba(74,157,126,0)] group-hover/card:shadow-[0_0_15px_rgba(74,157,126,0.2)]">
                {asset.icon}
              </div>
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-white group-hover/card:text-[#4a9d7e] transition-colors duration-300 line-clamp-2">{asset.name}</h4>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap ml-2 flex-shrink-0 ${asset.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {asset.trend}
                </span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 line-clamp-3">
                {asset.description}
              </p>
              <Link href="#" className="text-[#4a9d7e] text-xs font-bold uppercase tracking-widest flex items-center group/link">
                Trade Now
                <svg className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* Gradient Fades for Smooth Edge Transitions */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-[#1a1d29] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-[#1a1d29] to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}
