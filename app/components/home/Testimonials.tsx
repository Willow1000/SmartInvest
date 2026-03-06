'use client';

import { useEffect, useRef, useState } from 'react';

export default function Testimonials() {
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

  const testimonials = [
    {
      id: 1,
      name: 'Alex Thompson',
      role: 'Private Investor',
      text: "SmartInvest's AI signals have completely transformed my trading strategy. The execution speed is unmatched, and the risk management tools give me peace of mind.",
      avatar: 'AT',
      rating: 5,
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Hedge Fund Manager',
      text: "The institutional-grade tools provided here are comparable to what we use at the fund level. A truly professional platform for serious market participants.",
      avatar: 'SC',
      rating: 5,
    },
    {
      id: 3,
      name: 'Michael Roberts',
      role: 'Forex Trader',
      text: "The tight spreads and deep liquidity on the major pairs are incredible. I've been trading for 10 years and this is by far the most reliable platform I've used.",
      avatar: 'MR',
      rating: 4,
    },
  ];

  return (
    <section id="testimonials" ref={sectionRef} className="bg-[#1a1d29] py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] rounded-full bg-[#4a9d7e]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-[#4a9d7e] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-2 sm:mb-4">Social Proof</h2>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Trusted by 50k+ Traders</h3>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Join a community of sophisticated investors who rely on SmartInvest for 
            their daily market operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-[#252836]/40 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-gray-800 relative transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-10 text-[#4a9d7e]/10">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.851h5v10h-11zm-14 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.851h5v10h-11z" />
                </svg>
              </div>

              <div className="flex items-center space-x-1 mb-4 sm:mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-[#4a9d7e]' : 'text-gray-700'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-300 text-sm sm:text-base md:text-lg italic leading-relaxed mb-6 sm:mb-8 md:mb-10 relative z-10">
                "{testimonial.text}"
              </p>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4a9d7e] rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-[0_0_15px_rgba(74,157,126,0.3)]">
                  {testimonial.avatar}
                </div>
                <div>
                  <h5 className="text-white font-bold text-sm sm:text-base">{testimonial.name}</h5>
                  <p className="text-[#4a9d7e] text-[8px] sm:text-xs font-bold uppercase tracking-widest">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
