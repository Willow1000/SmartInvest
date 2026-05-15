'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [user, setUser] = useState<any>(null);
  const [marketStatus, setMarketStatus] = useState({
    crypto: true,
    stocks: false,
    forex: false,
    commodities: false,
    metals: false
  });

  useEffect(() => {
    // Get user info from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Simulate logout API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect on error
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/';
    }
  };

  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday, 6 = Saturday
      const hours = now.getUTCHours(); // Use UTC
      const minutes = now.getUTCMinutes();
      const currentTime = hours * 60 + minutes;
      
      // Stock Market: Monday-Friday, varies by exchange (typical 00:00-21:00 UTC)
      // Using NYSE as reference: 14:30-21:00 UTC (9:30 AM - 4:00 PM EST)
      const stockMarketOpen = 14 * 60 + 30; // 14:30 UTC (9:30 AM EST)
      const stockMarketClose = 21 * 60; // 21:00 UTC (4:00 PM EST)
      
      // Forex Market: Sunday 22:00 UTC - Friday 22:00 UTC (24h weekdays)
      const forexOpenDay = 0; // Sunday
      const forexOpenTime = 22 * 60; // 22:00 UTC
      const forexCloseDay = 5; // Friday
      const forexCloseTime = 22 * 60; // 22:00 UTC
      
      // Commodities: Sunday 22:00 UTC - Friday 21:00 UTC (with daily break 21:00-22:00 UTC)
      const commoditiesOpenDay = 0; // Sunday
      const commoditiesOpenTime = 22 * 60; // 22:00 UTC
      const commoditiesCloseDay = 5; // Friday
      const commoditiesCloseTime = 21 * 60; // 21:00 UTC
      const dailyBreakStart = 21 * 60; // 21:00 UTC
      const dailyBreakEnd = 22 * 60; // 22:00 UTC
      
      // Metals: Same as commodities
      const metalsOpenDay = 0; // Sunday
      const metalsOpenTime = 22 * 60; // 22:00 UTC
      const metalsCloseDay = 5; // Friday
      const metalsCloseTime = 21 * 60; // 21:00 UTC
      
      // Check if it's a weekday for stocks
      const isWeekday = day >= 1 && day <= 5; // Monday = 1, Friday = 5
      const isWithinStockHours = currentTime >= stockMarketOpen && currentTime < stockMarketClose;
      
      // Check forex market status (Sunday 22:00 UTC - Friday 22:00 UTC)
      let isForexOpen = false;
      if (day === forexOpenDay && currentTime >= forexOpenTime) {
        isForexOpen = true; // Sunday after 22:00 UTC
      } else if (day > forexOpenDay && day < forexCloseDay) {
        isForexOpen = true; // Monday - Thursday
      } else if (day === forexCloseDay && currentTime < forexCloseTime) {
        isForexOpen = true; // Friday before 22:00 UTC
      }
      
      // Check commodities market status (Sunday 22:00 UTC - Friday 21:00 UTC, with daily break)
      let isCommoditiesOpen = false;
      if (day === commoditiesOpenDay && currentTime >= commoditiesOpenTime) {
        isCommoditiesOpen = currentTime < dailyBreakStart || currentTime >= dailyBreakEnd; // Sunday with break
      } else if (day > commoditiesOpenDay && day < commoditiesCloseDay) {
        isCommoditiesOpen = currentTime < dailyBreakStart || currentTime >= dailyBreakEnd; // Mon-Thu with break
      } else if (day === commoditiesCloseDay && currentTime < commoditiesCloseTime) {
        isCommoditiesOpen = currentTime < dailyBreakStart || currentTime >= dailyBreakEnd; // Friday with break
      }
      
      // Check metals market status (same as commodities)
      let isMetalsOpen = false;
      if (day === metalsOpenDay && currentTime >= metalsOpenTime) {
        isMetalsOpen = currentTime < dailyBreakStart || currentTime >= dailyBreakEnd; // Sunday with break
      } else if (day > metalsOpenDay && day < metalsCloseDay) {
        isMetalsOpen = currentTime < dailyBreakStart || currentTime >= dailyBreakEnd; // Mon-Thu with break
      } else if (day === metalsCloseDay && currentTime < metalsCloseTime) {
        isMetalsOpen = currentTime < dailyBreakStart || currentTime >= dailyBreakEnd; // Friday with break
      }
      
      setMarketStatus({
        crypto: true, // Crypto never closes - 24/7
        stocks: isWeekday && isWithinStockHours,
        forex: isForexOpen,
        commodities: isCommoditiesOpen,
        metals: isMetalsOpen
      });
    };

    // Check immediately
    checkMarketStatus();
    
    // Update every minute
    const interval = setInterval(checkMarketStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

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
    <div className="flex flex-col md:flex-row min-h-screen bg-[#1a1d29] text-white font-sans overflow-x-hidden">
      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64 sm:w-72 border-r border-gray-800/50' : 'w-0 border-r-0'
          } bg-[#1a1d29]/95 overflow-y-auto flex flex-col h-full md:h-auto md:w-64 lg:w-72`}
      >
        <div className="p-4 sm:p-5 md:p-6 flex items-center justify-between sticky top-0 bg-[#1a1d29]/95 z-10 border-b border-gray-800/30">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0">
              <Image
                src="/smartinvest-icon.png"
                alt="SmartInvest Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs sm:text-sm md:text-base font-extrabold tracking-tight leading-none">SmartInvest</span>
              <span className="text-[#4a9d7e] text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-widest mt-0.5">Terminal</span>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 flex-shrink-0 md:hidden"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-3 sm:px-4 text-[7px] sm:text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 sm:mb-3 md:mb-4">Main Menu</p>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-lg md:rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-[#4a9d7e]/10 text-white border border-[#4a9d7e]/20 shadow-[0_0_15px_rgba(74,157,126,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
              >
                <span className={`transition-colors duration-300 flex-shrink-0 ${
                  isActive ? 'text-[#4a9d7e]' : 'text-gray-500 group-hover:text-white'
                }`}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {item.icon.props.children}
                  </svg>
                </span>
                <span className="font-semibold text-xs sm:text-sm md:text-base tracking-wide truncate">{item.name}</span>
              </button>
            );
          })}
        </div>

        <div className="p-3 sm:p-4 md:p-6 border-t border-gray-800/50 bg-[#1a1d29]/95 sticky bottom-0">
          <div className="bg-[#252836]/50 border border-gray-800 rounded-lg sm:rounded-lg md:rounded-xl p-2.5 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <div className="w-2 h-2 rounded-full bg-[#4a9d7e] animate-pulse flex-shrink-0" />
              <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">Network Status</span>
            </div>
            <p className="text-[7px] sm:text-[8px] md:text-[10px] text-gray-500 leading-relaxed">
              Connected to Node <span className="text-white font-semibold">#0482</span>
            </p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-1.5 sm:space-x-2 bg-gray-800/50 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 border border-transparent text-gray-400 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-lg md:rounded-xl font-semibold text-xs sm:text-sm md:text-base tracking-wide transition-all duration-300">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#1a1d29] w-full min-h-screen">
        <header className="bg-[#1a1d29]/80 backdrop-blur-lg border-b border-gray-800/50 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between z-30 sticky top-0">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 sm:p-2.5 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="h-5 w-px bg-gray-800 hidden sm:block flex-shrink-0" />
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide flex-wrap gap-2">
              {/* Crypto Market - Always Open 24/7 */}
              <div className="flex items-center space-x-1 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#4a9d7e] animate-pulse" />
                <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Crypto</span>
              </div>
              
              {/* Stock Market - Exchange-specific hours */}
              <div className="flex items-center space-x-1">
                <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                  marketStatus.stocks ? 'bg-[#4a9d7e] animate-pulse' : 'bg-gray-600'
                }`} />
                <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                  {marketStatus.stocks ? 'Stocks' : 'Stocks'}
                </span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest block sm:hidden">
                  {marketStatus.stocks ? 'S' : 's'}
                </span>
              </div>
              
              {/* Forex Market - Sunday 22:00 UTC - Friday 22:00 UTC */}
              <div className="flex items-center space-x-1">
                <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                  marketStatus.forex ? 'bg-[#4a9d7e] animate-pulse' : 'bg-gray-600'
                }`} />
                <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                  {marketStatus.forex ? 'Forex' : 'Forex'}
                </span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest block sm:hidden">
                  {marketStatus.forex ? 'F' : 'f'}
                </span>
              </div>
              
              {/* Commodities - Sunday 22:00 UTC - Friday 21:00 UTC (with daily break) */}
              <div className="flex items-center space-x-1">
                <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                  marketStatus.commodities ? 'bg-[#4a9d7e] animate-pulse' : 'bg-gray-600'
                }`} />
                <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                  {marketStatus.commodities ? 'Commodities' : 'Commodities'}
                </span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest block sm:hidden">
                  {marketStatus.commodities ? 'C' : 'c'}
                </span>
              </div>
              
              {/* Metals - Same as commodities */}
              <div className="flex items-center space-x-1">
                <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                  marketStatus.metals ? 'bg-[#4a9d7e] animate-pulse' : 'bg-gray-600'
                }`} />
                <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                  {marketStatus.metals ? 'Metals' : 'Metals'}
                </span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest block sm:hidden">
                  {marketStatus.metals ? 'M' : 'm'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6">
            <div className="hidden lg:flex flex-col text-right">
              <p className="text-white font-bold text-xs sm:text-sm">
                {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
              </p>
              <p className="text-[#4a9d7e] text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                {user ? 'Institutional Tier' : 'Loading...'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative group cursor-pointer">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-[#4a9d7e] to-[#2d5d4b] rounded-lg sm:rounded-lg md:rounded-xl flex items-center justify-center font-bold text-white text-xs sm:text-sm shadow-lg group-hover:shadow-[#4a9d7e]/30 transition-all duration-300">
                  {user ? `${user.firstName?.[0] || 'U'}${user.lastName?.[0] || ''}` : 'U'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 sm:p-2.5 rounded-lg bg-red-600/20 text-red-400 hover:text-white hover:bg-red-600 transition-all duration-200"
                title="Logout"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 custom-scrollbar">
          <div className="max-w-full responsive-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
