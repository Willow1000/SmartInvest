'use client';

import { useEffect, useRef, useState } from 'react';
import { EconomicCalendar, type EconomicEvent } from '@/components/ui/economic-calendar';

export default function TradingAssets() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const assets: EconomicEvent[] = [
    {
      countryCode: 'US',
      time: 'Live',
      eventName: 'Cryptocurrencies',
      actual: '-0.60%',
      forecast: 'Neutral',
      prior: 'High Vol',
      impact: 'high',
      imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=200&q=80',
    },
    {
      countryCode: 'GB',
      time: 'Live',
      eventName: 'Forex Markets',
      actual: '-0.10%',
      forecast: 'Mixed',
      prior: 'Liquid',
      impact: 'medium',
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=80',
    },
    {
      countryCode: 'ZA',
      time: 'Live',
      eventName: 'Precious Metals',
      actual: '+1.38%',
      forecast: 'Bullish',
      prior: 'Safe Haven',
      impact: 'high',
      imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=200&q=80',
    },
    {
      countryCode: 'US',
      time: 'Live',
      eventName: 'Global Stocks',
      actual: '-0.43%',
      forecast: 'Range',
      prior: 'Earnings',
      impact: 'medium',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=200&q=80',
    },
    {
      countryCode: 'NO',
      time: 'Live',
      eventName: 'Energy & Oil',
      actual: '+2.78%',
      forecast: 'Strong',
      prior: 'Tight Supply',
      impact: 'high',
      imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=200&q=80',
    },
    {
      countryCode: 'DE',
      time: 'Live',
      eventName: 'Market Indices',
      actual: '-0.30%',
      forecast: 'Neutral',
      prior: 'Macro-Led',
      impact: 'medium',
      imageUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=200&q=80',
    },
    {
      countryCode: 'SG',
      time: 'Live',
      eventName: 'ETF Portfolios',
      actual: '-0.48%',
      forecast: 'Accumulation',
      prior: 'Balanced',
      impact: 'low',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=200&q=80',
    },
    {
      countryCode: 'CH',
      time: 'Live',
      eventName: 'Treasury Bonds',
      actual: '-1.37%',
      forecast: 'Defensive',
      prior: 'Yield Watch',
      impact: 'low',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=200&q=80',
    },
  ];

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-[#4a9d7e] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4">Diversified Exposure</h2>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Global Investment Options</h3>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            One platform, infinite possibilities. Access 8+ asset classes with institutional-grade execution and deep liquidity.
          </p>
        </div>
      </div>

      <EconomicCalendar title="Global Investment Options" events={assets} className="mt-4 sm:mt-6" />
    </section>
  );
}
