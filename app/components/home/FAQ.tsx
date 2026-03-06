'use client';

import { useState, useEffect, useRef } from 'react';

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
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

  const faqs = [
    {
      question: "How do the AI trading signals work?",
      answer: "Our AI engine analyzes millions of data points across multiple markets in real-time. It uses deep learning algorithms to identify high-probability trading setups based on historical patterns, sentiment analysis, and volatility indicators.",
    },
    {
      question: "What is the minimum deposit to get started?",
      answer: "We offer different account tiers to accommodate various investment levels. Our standard account starts with a minimum deposit of $1,000, while institutional-grade features are available for higher-tier accounts.",
    },
    {
      question: "Is my capital safe with SmartInvest?",
      answer: "Security is our top priority. We use institutional-grade encryption, cold storage for crypto assets, and segregated accounts for fiat funds. We are also fully compliant with global financial regulations and undergo regular audits.",
    },
    {
      question: "Can I use my own trading strategy?",
      answer: "Yes, our platform supports custom strategy implementation. You can integrate your own algorithms via our robust API or use our visual strategy builder to automate your trading logic.",
    },
    {
      question: "What markets can I trade on the platform?",
      answer: "SmartInvest provides access to over 200+ markets, including major/minor Forex pairs, Cryptocurrencies, Global Stocks (NYSE, NASDAQ), Commodities (Gold, Oil), and Market Indices.",
    },
  ];

  return (
    <section id="faq" ref={sectionRef} className="bg-[#1a1d29] py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Left Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#4a9d7e] to-[#6bc99e] bg-clip-text text-transparent">A wealth of</span>
              <br />
              <span className="bg-gradient-to-r from-[#4a9d7e] to-[#6bc99e] bg-clip-text text-transparent">knowledge</span>
              <br />
              <span className="bg-gradient-to-r from-[#4a9d7e] to-[#6bc99e] bg-clip-text text-transparent">to get started</span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Explore expert insights and simple guides designed to help you understand the future of money and invest smarter.
            </p>
            
            <button className="inline-flex items-center justify-center bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(74,157,126,0.3)] hover:shadow-[0_0_30px_rgba(74,157,126,0.5)]">
              Start learning
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Right Cards Grid - Five Questions */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  expandedIndex === index ? 'md:col-span-2' : ''
                }`}
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="relative bg-gradient-to-br from-[#4a9d7e] to-[#2d6a5c] rounded-2xl p-6 h-full min-h-[200px] flex flex-col justify-between overflow-hidden group-hover:shadow-[0_0_30px_rgba(74,157,126,0.4)] transition-all duration-300">
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4a9d7e]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <h3 className="text-white font-bold text-lg mb-4 leading-tight">
                      {faq.question}
                    </h3>
                    
                    {expandedIndex === index && (
                      <p className="text-white/90 text-sm leading-relaxed mb-4 animate-fade-in">
                        {faq.answer}
                      </p>
                    )}
                  </div>

                  <div className="relative z-10 flex items-center justify-between mt-auto">
                    <button className="text-white font-semibold text-sm flex items-center hover:translate-x-1 transition-transform">
                      Read more
                      <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className={`mt-20 bg-gradient-to-r from-[#4a9d7e]/10 to-[#6bc99e]/5 border border-[#4a9d7e]/20 rounded-2xl p-12 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Can't find what you're looking for?</h3>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Our dedicated support team is available 24/7 to assist you with any questions or concerns. We're committed to ensuring your success on SmartInvest.
          </p>
          <button className="inline-flex items-center justify-center bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-3 px-10 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(74,157,126,0.3)] hover:shadow-[0_0_30px_rgba(74,157,126,0.5)]">
            Contact Support
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
