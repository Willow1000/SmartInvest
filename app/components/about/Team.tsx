'use client';

import { useEffect, useRef, useState } from 'react';

export default function Team() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const team = [
    {
      name: 'Alexander Sterling',
      role: 'Chief Executive Officer',
      bio: 'Former VP at Goldman Sachs with 15+ years in algorithmic trading and digital asset management.',
      initials: 'AS'
    },
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief Technology Officer',
      bio: 'PhD in Quantum Computing. Pioneer in AI-driven market prediction models and high-frequency systems.',
      initials: 'SC'
    },
    {
      name: 'Marcus Vane',
      role: 'Head of Risk Management',
      bio: 'Expert in multi-regulated financial frameworks and institutional-grade security protocols.',
      initials: 'MV'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Head of Global Markets',
      bio: 'Strategic lead for expansion across 4 continents, specializing in emerging digital economies.',
      initials: 'ER'
    }
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
    <section id="team" ref={sectionRef} className="bg-[#1a1d29] py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-[#4a9d7e] text-sm font-bold tracking-[0.2em] uppercase mb-4">The Leadership</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Expertise Behind the Engine</h3>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our team brings together decades of experience from the world's leading financial institutions 
            and technology laboratories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div 
              key={i} 
              className={`group relative bg-[#252836]/30 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 hover:border-[#4a9d7e]/40 transition-all duration-700 hover:-translate-y-2 overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Background Glow */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#4a9d7e]/5 rounded-full blur-2xl group-hover:bg-[#4a9d7e]/10 transition-all duration-500" />
              
              <div className="w-20 h-20 bg-[#4a9d7e]/10 rounded-2xl flex items-center justify-center text-[#4a9d7e] text-2xl font-bold mb-6 group-hover:scale-110 group-hover:bg-[#4a9d7e]/20 transition-all duration-500 shadow-lg">
                {member.initials}
              </div>
              
              <h4 className="text-white text-xl font-bold mb-2 group-hover:text-[#4a9d7e] transition-colors">{member.name}</h4>
              <p className="text-[#4a9d7e] text-xs font-bold uppercase tracking-widest mb-4">{member.role}</p>
              
              <div className="relative overflow-hidden">
                <p className="text-gray-500 text-sm leading-relaxed transform translate-y-0 transition-all duration-500">
                  {member.bio}
                </p>
              </div>

              {/* Decorative Arrow */}
              <div className="mt-6 flex items-center text-[#4a9d7e] text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span>View Profile</span>
                <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
