'use client';

import { useEffect, useRef, useState } from 'react';
import { useModal } from '../auth/ModalContext';

export default function AboutCTA() {
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

  const values = [
    {
      title: 'Innovation',
      description: 'Continuously pushing the boundaries of what\'s possible in financial technology.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: 'Integrity',
      description: 'Maintaining the highest standards of transparency and ethical conduct in all operations.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Excellence',
      description: 'Delivering world-class products and services that exceed investor expectations.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Community',
      description: 'Building a global network of empowered traders and long-term partners.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3.623a1 1 0 01-.986-1.164l1.423-5.356a6 6 0 016.15-5.986h3.586a6 6 0 016.15 5.986l1.423 5.356a1 1 0 01-.986 1.164z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="about-cta" ref={sectionRef} className="bg-[#1a1d29] py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#4a9d7e]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4a9d7e]/3 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#4a9d7e]/10 border border-[#4a9d7e]/20 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-[#4a9d7e] animate-pulse" />
            <span className="text-[#4a9d7e] text-xs font-bold tracking-wider uppercase">Our Core Values</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Built on Principles That <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9d7e] to-[#6bc99e]">
              Drive Our Mission
            </span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Every decision we make is guided by our commitment to innovation, integrity, excellence, and community.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((value, index) => (
            <div
              key={index}
              className={`group relative bg-[#252836]/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-[#4a9d7e]/50 transition-all duration-700 hover:-translate-y-1 overflow-hidden ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#4a9d7e]/5 rounded-full blur-3xl group-hover:bg-[#4a9d7e]/10 transition-all duration-500" />

              {/* Icon */}
              <div className="w-12 h-12 bg-[#4a9d7e]/10 rounded-lg flex items-center justify-center mb-6 text-[#4a9d7e] group-hover:scale-110 group-hover:bg-[#4a9d7e]/20 transition-all duration-300">
                {value.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#4a9d7e] transition-colors">
                {value.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {value.description}
              </p>

              {/* Accent Line */}
              <div className="mt-6 h-1 w-0 bg-gradient-to-r from-[#4a9d7e] to-[#6bc99e] group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className={`bg-gradient-to-r from-[#4a9d7e]/10 to-[#6bc99e]/5 rounded-3xl border border-[#4a9d7e]/20 p-12 md:p-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Join Our <span className="text-[#4a9d7e]">Movement?</span>
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Experience the future of institutional-grade trading. Join thousands of investors who trust 
                SmartInvest to manage their portfolios with precision and transparency.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { number: '50K+', label: 'Active Traders' },
                  { number: '$2.4B', label: 'AUM' },
                  { number: '99.9%', label: 'Uptime' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-[#4a9d7e] mb-1">{stat.number}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right CTA */}
            <div className="flex flex-col space-y-4">
              <button
                onClick={openSignup}
                className="group relative inline-flex items-center justify-center bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(74,157,126,0.3)] hover:shadow-[0_0_30px_rgba(74,157,126,0.5)] overflow-hidden"
              >
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
              </button>

              <button
                onClick={openSignup}
                className="group inline-flex items-center justify-center text-gray-300 hover:text-white font-semibold py-5 px-8 rounded-xl border border-gray-700 hover:border-[#4a9d7e] transition-all duration-300"
              >
                Learn More About Us
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <p className="text-gray-500 text-xs pt-4">
                No credit card required. Instant verification. Start trading in minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

