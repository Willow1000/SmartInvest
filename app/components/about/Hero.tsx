'use client';

import { useEffect, useRef, useState } from 'react';
import { useModal } from '../auth/ModalContext';

export default function AboutHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const { openSignup } = useModal();

  const slides = [
    {
      badge: "Our Story",
      title: "Welcome to",
      titleHighlight: "SmartInvest",
      description: "For over a decade, we've been at the forefront of financial innovation. We've protected and empowered thousands of traders with institutional-grade security, advanced tools, and unwavering commitment to excellence.",
      cta1: "Explore Our Mission",
      cta1Link: "#mission",
      cta2: "Meet the Team",
      cta2Link: "#team"
    },
    {
      badge: "Our Mission",
      title: "Democratizing",
      titleHighlight: "Access to Markets",
      description: "We believe everyone deserves access to the same sophisticated trading and investment tools as the world's largest institutions. SmartInvest was built on this principle—breaking down barriers and empowering individual investors globally.",
      cta1: "Join Our Community",
      cta1Link: "/",
      cta2: "Learn More",
      cta2Link: "/about#partners"
    },
    {
      badge: "Our Values",
      title: "Built on",
      titleHighlight: "Trust & Innovation",
      description: "With international licenses, institutional-grade security, and a proven track record spanning over a decade, we've earned the trust of 50,000+ traders worldwide. Security, transparency, and innovation drive everything we do.",
      cta1: "Discover Our Values",
      cta1Link: "#values",
      cta2: "See Our Achievements",
      cta2Link: "#achievements"
    },
    {
      badge: "Global Reach",
      title: "Serving Traders",
      titleHighlight: "Across the World",
      description: "From LATAM to Asia, Europe to North America—SmartInvest is where traders of all experience levels come to invest smarter, grow their wealth, and achieve their financial goals with confidence.",
      cta1: "Start Your Journey",
      cta1Link: "/",
      cta2: "Explore Opportunities",
      cta2Link: "/#features"
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
        this.size = Math.random() * 4 + 2;
        this.speedX = (Math.random() * 0.2 - 0.1);
        this.speedY = (Math.random() * 0.2 - 0.1);
        this.color = 'rgba(74, 157, 126, ' + (Math.random() * 0.5 + 0.3) + ')';
      }

      update() {
        // Subtle continuous movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Cursor repulsion - only for nearby particles
        const dx = this.x - mousePosition.current.x;
        const dy = this.y - mousePosition.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = 150;

        if (distance < repulsionRadius && distance > 0) {
          const force = (repulsionRadius - distance) / repulsionRadius;
          const angle = Math.atan2(dy, dx);
          // Slow, elegant repulsion
          this.x += Math.cos(angle) * force * 2;
          this.y += Math.sin(angle) * force * 2;
        }

        // Wrap around edges
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
      const numberOfParticles = (canvas.width * canvas.height) / 8000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update particles with cursor position from ref
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw particle connections
      ctx.lineWidth = 0.8;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            ctx.strokeStyle = `rgba(74, 157, 126, ${0.25 * (1 - distance / 200)})`;
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
    window.addEventListener('mousemove', handleMouseMove);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1a1d29] pt-20">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-100"
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Slides Container */}
        <div className="text-center transition-transform duration-700 ease-out">
          {slides.map((s, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10 absolute inset-0'
              }`}
            >
              <div className="inline-flex items-center space-x-2 bg-[#4a9d7e]/10 border border-[#4a9d7e]/20 px-4 py-2 rounded-full mb-8 animate-fade-in-down">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4a9d7e] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4a9d7e]"></span>
                </span>
                <span className="text-[#4a9d7e] text-xs font-bold uppercase tracking-widest">{s.badge}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight animate-fade-in">
                {s.title} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9d7e] to-[#6bc99e]">
                  {s.titleHighlight}
                </span>
              </h1>
              
              <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in delay-200">
                {s.description}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in delay-300">
                {s.cta1Link ? (
                  <a
                    href={s.cta1Link}
                    className="w-full sm:w-auto bg-[#4a9d7e] hover:bg-[#3d8567] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(74,157,126,0.3)] hover:shadow-[0_0_30px_rgba(74,157,126,0.5)] text-center group inline-flex items-center justify-center"
                  >
                    {s.cta1}
                    <svg className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                ) : (
                  <button
                    onClick={openSignup}
                    className="w-full sm:w-auto bg-[#4a9d7e] hover:bg-[#3d8567] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(74,157,126,0.3)] hover:shadow-[0_0_30px_rgba(74,157,126,0.5)] text-center group"
                  >
                    {s.cta1}
                    <svg className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                )}
                {s.cta2Link ? (
                  <a
                    href={s.cta2Link}
                    className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 backdrop-blur-sm text-center"
                  >
                    {s.cta2}
                  </a>
                ) : (
                  <button
                    onClick={openSignup}
                    className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 backdrop-blur-sm text-center"
                  >
                    {s.cta2}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="mt-16 flex items-center justify-center gap-4">
          {/* Previous Button */}
          <button
            onClick={handlePrevSlide}
            className="p-3 rounded-full border border-gray-700 hover:border-[#4a9d7e] text-gray-400 hover:text-[#4a9d7e] transition-all duration-300"
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
            className="p-3 rounded-full border border-gray-700 hover:border-[#4a9d7e] text-gray-400 hover:text-[#4a9d7e] transition-all duration-300"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1d29] to-transparent z-10" />
    </section>
  );
}
