'use client';

import { useEffect, useRef, useState } from 'react';

export default function Features() {
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

  const features = [
    {
      id: 1,
      title: 'Automated Smart ignals',
      description: 'Cutting-edge AI-driven trading signals, for optimal entries and exits. Real-time processing for instant decision making.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      id: 2,
      title: 'Risk Management',
      description: 'Robust risk controls to protect your investments. Advanced hedging algorithms and stop-loss automation.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 20.944a11.955 11.955 0 01-8.618-3.04m17.236 0a11.955 11.955 0 01-8.618 3.04" />
        </svg>
      ),
      color: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      id: 3,
      title: 'Global Markets',
      description: 'Access to diverse markets worldwide, 24/7. Equities, Forex, Crypto, and Commodities in one unified platform.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      color: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
    },
    {
      id: 4,
      title: 'Market Insight',
      description: 'Deep, data-driven analysis of market trends and macroeconomic indicators. Stay ahead with real-time intelligence and actionable research.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
    },
    {
      id: 5,
      title: 'Account Management',
      description: 'Comprehensive portfolio oversight with intuitive controls. Monitor performance, manage allocations, and track every position from a single dashboard.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
    },
    {
      id: 6,
      title: 'Expert Advice',
      description: 'Direct access to seasoned financial professionals and curated strategy recommendations. Personalised guidance tailored to your investment goals.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      color: 'bg-rose-500/10',
      iconColor: 'text-rose-400',
    },
  ];

  return (
    <section id="features" ref={sectionRef} className="bg-[#1a1d29] py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-2xl">
            <h2 className="text-[#4a9d7e] text-sm font-bold tracking-[0.2em] uppercase mb-4">Unmatched Capability</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Built for the most <br />demanding investors</h3>
          </div>
          <div className="mt-6 md:mt-0">
            <p className="text-gray-400 max-w-sm">Our platform combines cutting-edge technology with intuitive design to give you the ultimate edge.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`group relative bg-[#252836]/40 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-gray-800 hover:border-[#4a9d7e]/50 transition-all duration-1000 hover:-translate-y-2 overflow-hidden ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Card background glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4a9d7e]/5 rounded-full blur-[60px] group-hover:bg-[#4a9d7e]/10 transition-all duration-500" />
              
              <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <div className={`${feature.iconColor}`}>
                  {feature.icon}
                </div>
              </div>
              
              <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-[#4a9d7e] transition-colors duration-300">
                {feature.title}
              </h4>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="mt-8 pt-8 border-t border-gray-800 flex items-center text-[#4a9d7e] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Learn more</span>
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
