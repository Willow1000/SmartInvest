'use client';

import { useEffect, useRef, useState } from 'react';

export default function Achievements() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const stats = [
    { label: 'AUM', value: '$2.4B+' },
    { label: 'Uptime', value: '99.9%' },
    { label: 'Execution', value: '12ms' },
    { label: 'Traders', value: '50k+' },
    { label: 'Awards', value: '15+' },
    { label: 'Global Offices', value: '12' }
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
    <section id="achievements" ref={sectionRef} className="bg-[#1a1d29] py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-[#4a9d7e] text-sm font-bold tracking-[0.2em] uppercase mb-4">Our Progress</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">A History of Excellence</h3>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From our founding to our global presence today, we've consistently 
            set new standards in digital asset management.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 mb-24">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center group transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-white text-3xl md:text-4xl font-extrabold mb-2 group-hover:text-[#4a9d7e] group-hover:scale-110 transition-all duration-500 cursor-default">
                {stat.value}
              </div>
              <div className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold text-center group-hover:text-gray-300 transition-colors">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { year: '2018', title: 'Founded', desc: 'Established in London with a focus on AI-driven crypto trading.' },
            { year: '2020', title: 'Global Expansion', desc: 'Opened offices in Singapore and New York to serve institutional clients.' },
            { year: '2024', title: 'Market Leader', desc: 'Ranked #1 for execution speed and algorithmic transparency.' }
          ].map((milestone, i) => (
            <div 
              key={i} 
              className={`group relative bg-[#252836]/30 backdrop-blur-sm border border-gray-800 p-10 rounded-3xl transition-all duration-1000 hover:border-[#4a9d7e]/40 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 300}ms` }}
            >
              {/* Animated Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a9d7e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
              
              <div className="text-[#4a9d7e] text-2xl font-bold mb-4 transform group-hover:scale-110 transition-transform duration-500">{milestone.year}</div>
              <h4 className="text-white text-xl font-bold mb-4 group-hover:text-white transition-colors">{milestone.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed relative z-10">{milestone.desc}</p>
              
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all duration-700">
                <div className="text-6xl font-extrabold text-white">0{i+1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
