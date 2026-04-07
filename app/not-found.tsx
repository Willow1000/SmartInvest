'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Background elements matching Hero component */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4a9d7e]/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#4a9d7e]/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Interactive mouse-following elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-[#4a9d7e]/10 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
      </div>

      {/* Floating particles matching Hero component style */}
      {isClient && Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#4a9d7e]/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        />
      ))}

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo and 404 */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 flex items-center justify-center">
              <Image
                src="/smartinvest-icon.png"
                alt="SmartInvest Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </div>
          
          {/* 404 Number with SmartInvest gradient */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-white mb-4 leading-[1.1] tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9d7e] to-[#6bc99e]">
              404
            </span>
          </h1>
        </div>

        {/* Error message */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#4a9d7e]/10 border border-[#4a9d7e]/20 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-[#4a9d7e] animate-ping" />
            <span className="text-[#4a9d7e] text-xs font-bold tracking-wider uppercase">Page Not Found</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
            Lost in the Markets?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Looks like this investment opportunity doesn't exist. Even our advanced algorithms can't find what isn't there! Let's get you back to profitable territory.
          </p>
        </div>

        {/* Action buttons matching Navbar/CTA styling */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={handleGoHome}
            className="group relative inline-flex items-center justify-center bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-300 shadow-[0_0_20px_rgba(74,157,126,0.3)] hover:shadow-[0_0_30px_rgba(74,157,126,0.5)] overflow-hidden"
          >
            <span className="relative z-10">Back to Dashboard</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
          </button>
          <button
            onClick={handleGoBack}
            className="group inline-flex items-center justify-center text-gray-300 hover:text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl text-sm sm:text-base border border-gray-700 hover:border-gray-500 transition-all duration-300"
          >
            Previous Page
            <svg className="ml-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        {/* Quick navigation grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Link
            href="/portfolio"
            className="group p-4 sm:p-6 bg-[#252836] rounded-xl hover:bg-[#2d3142] transition-all duration-300 border border-gray-800 hover:border-[#4a9d7e]/50"
          >
            <div className="text-[#4a9d7e] text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
            <div className="text-sm text-gray-400 group-hover:text-white transition-colors">Portfolio</div>
          </Link>
          <Link
            href="/about"
            className="group p-4 sm:p-6 bg-[#252836] rounded-xl hover:bg-[#2d3142] transition-all duration-300 border border-gray-800 hover:border-[#4a9d7e]/50"
          >
            <div className="text-[#4a9d7e] text-3xl mb-2 group-hover:scale-110 transition-transform">ℹ️</div>
            <div className="text-sm text-gray-400 group-hover:text-white transition-colors">About</div>
          </Link>
          <Link
            href="/policies"
            className="group p-4 sm:p-6 bg-[#252836] rounded-xl hover:bg-[#2d3142] transition-all duration-300 border border-gray-800 hover:border-[#4a9d7e]/50"
          >
            <div className="text-[#4a9d7e] text-3xl mb-2 group-hover:scale-110 transition-transform">📋</div>
            <div className="text-sm text-gray-400 group-hover:text-white transition-colors">Policies</div>
          </Link>
          <Link
            href="/"
            className="group p-4 sm:p-6 bg-[#252836] rounded-xl hover:bg-[#2d3142] transition-all duration-300 border border-gray-800 hover:border-[#4a9d7e]/50"
          >
            <div className="text-[#4a9d7e] text-3xl mb-2 group-hover:scale-110 transition-transform">🏠</div>
            <div className="text-sm text-gray-400 group-hover:text-white transition-colors">Home</div>
          </Link>
        </div>

        {/* Stats section matching Hero component style */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1d29]/80 via-[#1a1d29]/60 to-[#1a1d29]/80 rounded-2xl" />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 md:p-8">
            {[
              { label: 'Uptime', value: '99.9%' },
              { label: 'Assets', value: '100+' },
              { label: 'Traders', value: '50k+' },
              { label: 'AUM', value: '$2.4B+' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                <span className="text-white text-lg sm:text-xl md:text-2xl font-bold">{stat.value}</span>
                <span className="text-gray-300 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest font-bold mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer message */}
        <div className="mt-12 text-xs text-gray-600">
          <p>Pro tip: The market rewards patience... and valid URLs! 📈</p>
        </div>
      </div>
    </div>
  );
}
