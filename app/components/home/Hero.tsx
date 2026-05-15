'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const [metrics, setMetrics] = useState({
    aum: 2.40,
    uptime: 99.90,
    traders: 50431,
    assets: 104
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        aum: prev.aum + (Math.random() * 0.005),
        uptime: 99.90 + (Math.random() * 0.09),
        traders: prev.traders + Math.floor(Math.random() * 3),
        assets: prev.assets + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
      cta1: "",
      cta1Action: "",
      cta1Link: null,
      cta2: "",
      cta2Link: null,
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
    <section className="relative overflow-hidden bg-[#1a1d29] pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-32 px-3 sm:px-4 lg:px-8 min-h-screen flex items-center max-w-full">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full min-h-screen object-cover opacity-40"
      >
        <source src="/Financial_Video_Generation_Request.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Fallback Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full min-h-screen pointer-events-none opacity-50"
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4a9d7e]/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#4a9d7e]/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto w-full responsive-container">
        {/* Slides Container */}
        <div className="relative overflow-hidden">
          {slides.map((s, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ease-in-out ${index === currentSlide
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10 absolute inset-0'
                }`}
            >
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#4a9d7e]/10 border border-[#4a9d7e]/20 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
                  <span className="flex h-2 w-2 rounded-full bg-[#4a9d7e] animate-ping" />
                  <span className="text-[#4a9d7e] text-xs font-bold tracking-wider uppercase">{s.badge}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-4 sm:mb-6 md:mb-8 leading-[1.1] tracking-tight">
                  {s.title} <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9d7e] to-[#6bc99e]">
                    {s.titleHighlight}
                  </span>
                </h1>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                  {s.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          {/* Previous Button */}
          <button
            onClick={handlePrevSlide}
            className="p-2 sm:p-3 rounded-full border border-gray-700 hover:border-[#4a9d7e] text-gray-400 hover:text-[#4a9d7e] transition-all duration-300 touch-target"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

              {/* Dot Indicators */}
          <div className="flex gap-1.5 sm:gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-[#4a9d7e] w-6'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextSlide}
            className="p-2 sm:p-3 rounded-full border border-gray-700 hover:border-[#4a9d7e] text-gray-400 hover:text-[#4a9d7e] transition-all duration-300 touch-target"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Stats Section with Enhanced Visibility */}
        <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 relative">
          {/* Backdrop for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1d29]/80 via-[#1a1d29]/60 to-[#1a1d29]/80 rounded-2xl" />

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-6 lg:p-8 opacity-100 grayscale-0 transition-all duration-700">
            {[
              { label: 'AUM', value: `$${metrics.aum.toFixed(2)}B+` },
              { label: 'Uptime', value: `${metrics.uptime.toFixed(2)}%` },
              { label: 'Active Traders', value: `${(metrics.traders / 1000).toFixed(1)}k+` },
              { label: 'Assets', value: `${metrics.assets}+` },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                <span className="text-white text-base sm:text-lg md:text-2xl lg:text-3xl font-bold">{stat.value}</span>
                <span className="text-gray-300 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs uppercase tracking-widest font-bold mt-1 sm:mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
