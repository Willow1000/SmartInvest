'use client';

import { useEffect, useRef, useState } from 'react';

export default function Partners() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const partners = [
    {
      name: 'TradingView',
      category: 'Charting & Analytics',
      description: 'Advanced charting tools and market analysis',
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" fill="#1a1d29" rx="12"/>
          <text x="50" y="60" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#4a9d7e" fontFamily="Arial">TV</text>
        </svg>
      ),
    },
    {
      name: 'Bybit',
      category: 'Cryptocurrency Exchange',
      description: 'Leading crypto derivatives trading platform',
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" fill="#1a1d29" rx="12"/>
          <text x="50" y="60" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#4a9d7e" fontFamily="Arial">BB</text>
        </svg>
      ),
    },
    {
      name: 'Binance',
      category: 'Cryptocurrency Exchange',
      description: 'World\'s largest crypto trading platform',
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" fill="#1a1d29" rx="12"/>
          <text x="50" y="60" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#4a9d7e" fontFamily="Arial">BN</text>
        </svg>
      ),
    },
    {
      name: 'Interactive Brokers',
      category: 'Brokerage',
      description: 'Global trading and investing platform',
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" fill="#1a1d29" rx="12"/>
          <text x="50" y="60" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#4a9d7e" fontFamily="Arial">IB</text>
        </svg>
      ),
    },
    {
      name: 'Kraken',
      category: 'Cryptocurrency Exchange',
      description: 'Secure and reliable crypto trading',
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" fill="#1a1d29" rx="12"/>
          <text x="50" y="60" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#4a9d7e" fontFamily="Arial">KR</text>
        </svg>
      ),
    },
    {
      name: 'FTX',
      category: 'Derivatives Exchange',
      description: 'Advanced crypto derivatives trading',
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" fill="#1a1d29" rx="12"/>
          <text x="50" y="60" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#4a9d7e" fontFamily="Arial">FTX</text>
        </svg>
      ),
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
    <section id="partners" ref={sectionRef} className="bg-[#1a1d29] py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4a9d7e]/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4a9d7e]/3 rounded-full blur-3xl translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#4a9d7e]/10 border border-[#4a9d7e]/20 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-[#4a9d7e] animate-pulse" />
            <span className="text-[#4a9d7e] text-xs font-bold tracking-wider uppercase">Strategic Partnerships</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9d7e] to-[#6bc99e]">
              Industry Leaders
            </span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We partner with the world's most trusted trading platforms and exchanges to provide you with seamless access to global markets.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {partners.map((partner, index) => (
            <div
              key={index}
              className={`group relative bg-[#252836]/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-[#4a9d7e]/50 transition-all duration-700 hover:-translate-y-2 overflow-hidden ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#4a9d7e]/5 rounded-full blur-3xl group-hover:bg-[#4a9d7e]/10 transition-all duration-500" />

              {/* Logo */}
              <div className="mb-6 flex items-center justify-center">
                <div className="p-4 bg-[#4a9d7e]/5 rounded-xl group-hover:bg-[#4a9d7e]/10 transition-all duration-300">
                  {partner.logo}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2 text-center group-hover:text-[#4a9d7e] transition-colors">
                {partner.name}
              </h3>
              <p className="text-[#4a9d7e] text-xs font-bold uppercase tracking-widest mb-3 text-center">
                {partner.category}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed text-center">
                {partner.description}
              </p>

              {/* Accent Line */}
              <div className="mt-6 h-1 w-0 bg-gradient-to-r from-[#4a9d7e] to-[#6bc99e] group-hover:w-full transition-all duration-500 mx-auto" />
            </div>
          ))}
        </div>

        {/* Integration Benefits */}
        <div className={`bg-gradient-to-r from-[#4a9d7e]/10 to-[#6bc99e]/5 rounded-3xl border border-[#4a9d7e]/20 p-12 md:p-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Real-Time Data',
                description: 'Access live market data and advanced analytics from our integrated partners',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                title: 'Seamless Integration',
                description: 'One-click connection to all major exchanges and trading platforms',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                ),
              },
              {
                title: 'Enhanced Security',
                description: 'Enterprise-grade security protocols with our trusted partners',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
              },
            ].map((benefit, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-[#4a9d7e]/10 rounded-2xl flex items-center justify-center text-[#4a9d7e] mx-auto mb-6 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-bold text-white mb-3">{benefit.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
