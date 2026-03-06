'use client';

import { useEffect, useRef, useState } from 'react';
import { useModal } from '../auth/ModalContext';

export default function CTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { openSignup } = useModal();

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

  const trustIndicators = [
    {
      label: 'Assured Risk Mitigation',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Instant Access to Returns',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Live Trading in Minutes',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      ),
    },
    {
      label: '24/7 Support',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="cta" ref={sectionRef} className="bg-[#1a1d29] py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[35%] h-[35%] rounded-full bg-[#4a9d7e]/8 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-[#4a9d7e]/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#4a9d7e]/10 border border-[#4a9d7e]/20 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-[#4a9d7e] animate-pulse" />
            <span className="text-[#4a9d7e] text-xs font-bold tracking-wider uppercase">Ready to Get Started?</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9d7e] to-[#6bc99e]">50,000+ Traders</span> <br className="hidden md:block" />
            Transforming Their Portfolio
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200">
            Start your journey to professional-grade trading today. Get instant access to AI-powered signals, 
            advanced risk management, and 24/7 market access across 200+ global markets.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-300">
            <button
              onClick={openSignup}
              className="group relative inline-flex items-center justify-center bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(74,157,126,0.3)] hover:shadow-[0_0_30px_rgba(74,157,126,0.5)] overflow-hidden"
            >
              <span className="relative z-10">Create Free Account</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
            </button>

            <button
              onClick={openSignup}
              className="group inline-flex items-center justify-center text-gray-300 hover:text-white font-semibold py-4 px-12 rounded-xl border border-gray-700 hover:border-[#4a9d7e] transition-all duration-300"
            >
              Schedule Demo
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className={`mt-16 pt-12 border-t border-gray-800 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-8">
              Trusted by leading investors worldwide
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {trustIndicators.map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-3">
                  <div className="w-14 h-14 bg-[#4a9d7e]/10 rounded-xl flex items-center justify-center text-[#4a9d7e] group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className="text-gray-400 text-xs font-semibold text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Disclaimer */}
          <div className={`mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-gray-500 text-xs leading-relaxed max-w-2xl mx-auto">
              Trading and investing involve substantial risk of loss. Past performance does not guarantee future results. 
              All investments carry risk, including potential loss of principal. Please read our risk disclosure before trading.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
