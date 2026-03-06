'use client';

import { useEffect, useState, useRef } from 'react';
import { useModal } from '../auth/ModalContext';

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const { openSignup } = useModal();

  const slides = [
    {
      title: "Discover what your",
      titleHighlight: "money is capable of",
      subtitle: "Invest in stocks, cryptocurrencies, and global assets. One app, every opportunity to build your financial future. Start with just $10.",
      cta1: "Open Your Account",
      cta1Action: "modal",
      cta1Link: null,
      cta2: "View Our Assets",
      cta2Link: "#trading-assets",
      badge: "Trusted by 50k+ Traders"
    },
    {
      title: "Invest in",
      titleHighlight: "100+ Cryptocurrencies",
      subtitle: "Explore our selection of digital assets including Bitcoin, Ethereum, and emerging altcoins. Find your favorite crypto and start building your portfolio.",
      cta1: "Start Investing",
      cta1Action: "modal",
      cta1Link: null,
      cta2: "View Partners",
      cta2Link: "#partners",
      badge: "Crypto Made Easy"
    },
    {
      title: "Trade",
      titleHighlight: "Forex & Commodities",
      subtitle: "Access major/minor currency pairs, precious metals, and energy commodities. Trade with advanced tools and real-time market data on a secure platform.",
      cta1: "Start Trading",
      cta1Action: "modal",
      cta1Link: null,
      cta2: "See Performance",
      cta2Link: "#performance",
      badge: "Global Markets Access"
    },
    {
      title: "Build Your",
      titleHighlight: "Investment Portfolio",
      subtitle: "Diversify across stocks, ETFs, and bonds. Create a balanced portfolio tailored to your financial goals with our intelligent investment tools.",
      cta1: "Create Portfolio",
      cta1Action: "modal",
      cta1Link: null,
      cta2: "Read FAQs",
      cta2Link: "#faq",
      badge: "Smart Investing"
    }
  ];

  useEffect(() => {
    setIsMounted(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement!.offsetHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 3 + 1; 
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = 'rgba(74, 157, 126, ' + (Math.random() * 0.3 + 0.1) + ')';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        const rect = canvas!.getBoundingClientRect();
        const mouseX = mousePosition.current.x - rect.left;
        const mouseY = mousePosition.current.y - rect.top;

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          this.x -= dx * force * 0.03;
          this.y -= dy * force * 0.03;
        }

        if (this.x > canvas!.width) this.x = 0;
        else if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        else if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 20000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      ctx.lineWidth = 0.5;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) { 
            ctx.strokeStyle = `rgba(74, 157, 126, ${0.12 * (1 - distance / 150)})`; 
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', handleMouseMove);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Auto-play slideshow
  useEffect(() => {
    if (!autoPlay) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Change slide every 6 seconds

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, slides.length]);

  const handlePrevSlide = () => {
    setAutoPlay(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setAutoPlay(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleDotClick = (index: number) => {
    setAutoPlay(false);
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-[#1a1d29] pt-20 pb-16 sm:pt-24 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src="/Financial_Video_Generation_Request.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Fallback Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4a9d7e]/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#4a9d7e]/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto w-full">
        {/* Slides Container */}
        <div className="relative overflow-hidden">
          {slides.map((s, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10 absolute inset-0'
              }`}
            >
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#4a9d7e]/10 border border-[#4a9d7e]/20 mb-4 sm:mb-6 md:mb-8">
                  <span className="flex h-2 w-2 rounded-full bg-[#4a9d7e] animate-ping" />
                  <span className="text-[#4a9d7e] text-xs font-bold tracking-wider uppercase">{s.badge}</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 sm:mb-6 md:mb-8 leading-[1.1] tracking-tight">
                  {s.title} <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9d7e] to-[#6bc99e]">
                    {s.titleHighlight}
                  </span>
                </h1>
                
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
                  {s.subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  {s.cta1Action === "modal" ? (
                    <button
                      onClick={openSignup}
                      className="group relative inline-flex items-center justify-center bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-300 shadow-[0_0_20px_rgba(74,157,126,0.3)] hover:shadow-[0_0_30px_rgba(74,157,126,0.5)] overflow-hidden"
                    >
                      <span className="relative z-10">{s.cta1}</span>
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
                    </button>
                  ) : s.cta1Link ? (
                    <a
                      href={s.cta1Link}
                      className="group relative inline-flex items-center justify-center bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-300 shadow-[0_0_20px_rgba(74,157,126,0.3)] hover:shadow-[0_0_30px_rgba(74,157,126,0.5)] overflow-hidden"
                    >
                      <span className="relative z-10">{s.cta1}</span>
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
                    </a>
                  ) : null}
                  
                  {s.cta2Link && (
                    <a
                      href={s.cta2Link}
                      className="group inline-flex items-center justify-center text-gray-300 hover:text-white font-semibold py-3 sm:py-4 px-6 sm:px-10 rounded-lg sm:rounded-xl text-sm sm:text-base border border-gray-700 hover:border-gray-500 transition-all duration-300"
                    >
                      {s.cta2}
                      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="mt-10 sm:mt-12 md:mt-16 flex items-center justify-center gap-3 sm:gap-4">
          {/* Previous Button */}
          <button
            onClick={handlePrevSlide}
            className="p-2 sm:p-3 rounded-full border border-gray-700 hover:border-[#4a9d7e] text-gray-400 hover:text-[#4a9d7e] transition-all duration-300"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-[#4a9d7e] w-8'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextSlide}
            className="p-2 sm:p-3 rounded-full border border-gray-700 hover:border-[#4a9d7e] text-gray-400 hover:text-[#4a9d7e] transition-all duration-300"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Stats Section with Enhanced Visibility */}
        <div className="mt-12 sm:mt-16 md:mt-20 relative">
          {/* Backdrop for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1d29]/80 via-[#1a1d29]/60 to-[#1a1d29]/80 rounded-2xl" />
          
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 md:p-8 lg:p-12 opacity-100 grayscale-0 transition-all duration-700">
            {[
              { label: 'AUM', value: '$2.4B+' },
              { label: 'Uptime', value: '99.9%' },
              { label: 'Active Traders', value: '50k+' },
              { label: 'Assets', value: '100+' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                <span className="text-white text-lg sm:text-2xl md:text-3xl font-bold">{stat.value}</span>
                <span className="text-gray-300 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest font-bold mt-1 sm:mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
