'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    {
      name: 'Overview',
      id: 'overview',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      name: 'Wallet',
      id: 'wallet',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      name: 'Analytics',
      id: 'analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      name: 'Market Insights',
      id: 'market-insights',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      name: 'Automations',
      id: 'automations',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#1a1d29] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64 sm:w-72 border-r border-gray-800/50' : 'w-0 border-r-0'
          } bg-[#1a1d29] overflow-hidden flex flex-col whitespace-nowrap`}
      >
        <div className="p-4 sm:p-6 md:p-8 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/smartinvest-icon.png"
                alt="SmartInvest Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-lg sm:text-xl font-extrabold tracking-tight leading-none">SmartInvest</span>
              <span className="text-[#4a9d7e] text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Terminal</span>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-2 sm:px-4 py-4 sm:py-6 space-y-1">
          <p className="px-2 sm:px-4 text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 sm:mb-4">Main Menu</p>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 group ${isActive
                  ? 'bg-[#4a9d7e]/10 text-white border border-[#4a9d7e]/20 shadow-[0_0_15px_rgba(74,157,126,0.1)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
              >
                <span className={`transition-colors duration-300 ${isActive ? 'text-[#4a9d7e]' : 'text-gray-500 group-hover:text-white'}`}>
                  {item.icon}
                </span>
                <span className="font-bold uppercase tracking-widest text-[9px] sm:text-[11px]">{item.name}</span>
              </button>
            );
          })}
        </div>

        <div className="p-3 sm:p-4 md:p-6 border-t border-gray-800/50">
          <div className="bg-[#252836]/50 border border-gray-800 rounded-lg sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#4a9d7e] animate-pulse" />
              <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Network Status</span>
            </div>
            <p className="text-[9px] sm:text-[11px] text-gray-500 leading-relaxed">
              Connected to Institutional Node <span className="text-white">#0482</span>
            </p>
          </div>
          <button className="w-full flex items-center justify-center space-x-1 sm:space-x-2 bg-gray-800/50 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 border border-transparent text-gray-400 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-bold uppercase tracking-widest text-[9px] sm:text-[11px] transition-all duration-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#1a1d29] w-full">
        <header className="bg-[#1a1d29] border-b border-gray-800/50 px-3 sm:px-4 md:px-8 py-3 sm:py-4 md:py-5 flex items-center justify-between z-30">
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 sm:p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden sm:block h-4 sm:h-6 w-px bg-gray-800" />
            <div className="hidden sm:flex items-center space-x-1.5 sm:space-x-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#4a9d7e]" />
              <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest">Market Open</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
            <div className="hidden lg:flex flex-col text-right">
              <p className="text-white font-bold text-xs sm:text-sm">James Wilson</p>
              <p className="text-[#4a9d7e] text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">Premium Tier</p>
            </div>
            <div className="relative group cursor-pointer">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#4a9d7e] to-[#2d5d4b] rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-white text-xs sm:text-sm shadow-lg group-hover:shadow-[#4a9d7e]/20 transition-all duration-300">
                JW
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 custom-scrollbar space-y-12">
          {children}
        </main>
      </div>
    </div>
  );
}
