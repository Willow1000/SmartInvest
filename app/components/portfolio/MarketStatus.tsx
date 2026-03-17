'use client';

import { useState, useEffect } from 'react';

export interface MarketStatusInfo {
  assetClass: string;
  status: 'open' | 'closed' | 'opening-soon' | 'closing-soon';
  hours: string;
  nextEvent: string;
  icon: React.ReactNode;
}

export default function MarketStatus() {
  const [marketInfo, setMarketInfo] = useState<MarketStatusInfo[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [overallStatus, setOverallStatus] = useState<'open' | 'closed'>('closed');

  useEffect(() => {
    const updateMarketStatus = () => {
      const now = new Date();
      
      // Get NY time
      const nyTimeStr = now.toLocaleString("en-US", { timeZone: "America/New_York" });
      const nyDate = new Date(nyTimeStr);
      
      const day = nyDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const hours = nyDate.getHours();
      const minutes = nyDate.getMinutes();
      const timeInMinutes = hours * 60 + minutes;

      // Format current time
      const timeStr = nyDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/New_York'
      });
      setCurrentTime(timeStr);

      // --- STOCKS (NYSE) ---
      const isStockWeekday = day >= 1 && day <= 5;
      const stockOpen = 9 * 60 + 30; // 9:30 AM
      const stockClose = 16 * 60;    // 4:00 PM
      
      let stockStatus: 'open' | 'closed' | 'opening-soon' | 'closing-soon' = 'closed';
      let stockHours = 'Closed';
      let stockNextEvent = '';

      if (isStockWeekday) {
        if (timeInMinutes >= stockOpen && timeInMinutes < stockClose) {
          stockStatus = 'open';
          stockHours = '9:30 AM - 4:00 PM EST';
          const minutesUntilClose = stockClose - timeInMinutes;
          stockNextEvent = `Closes in ${Math.floor(minutesUntilClose / 60)}h ${minutesUntilClose % 60}m`;
          if (minutesUntilClose <= 30) stockStatus = 'closing-soon';
        } else if (timeInMinutes < stockOpen && stockOpen - timeInMinutes <= 30) {
          stockStatus = 'opening-soon';
          stockHours = '9:30 AM - 4:00 PM EST';
          const minutesUntilOpen = stockOpen - timeInMinutes;
          stockNextEvent = `Opens in ${Math.floor(minutesUntilOpen / 60)}h ${minutesUntilOpen % 60}m`;
        } else {
          stockHours = '9:30 AM - 4:00 PM EST';
          if (timeInMinutes < stockOpen) {
            const minutesUntilOpen = stockOpen - timeInMinutes;
            stockNextEvent = `Opens in ${Math.floor(minutesUntilOpen / 60)}h ${minutesUntilOpen % 60}m`;
          } else {
            stockNextEvent = 'Opens tomorrow at 9:30 AM';
          }
        }
      } else {
        stockHours = '9:30 AM - 4:00 PM EST';
        if (day === 0) {
          const minutesUntilMonday = (24 - hours) * 60 - minutes;
          stockNextEvent = `Opens Monday in ${Math.floor(minutesUntilMonday / 60)}h`;
        } else if (day === 6) {
          const minutesUntilMonday = (24 - hours) * 60 - minutes;
          stockNextEvent = `Opens Monday in ${Math.floor(minutesUntilMonday / 60)}h`;
        }
      }

      // --- FOREX ---
      // Sun 5:00 PM to Fri 5:00 PM EST
      const isForexClosed = (day === 5 && timeInMinutes >= 17 * 60) || // Friday after 5 PM
                            (day === 6) ||                            // Saturday
                            (day === 0 && timeInMinutes < 17 * 60);    // Sunday before 5 PM
      
      let forexStatus: 'open' | 'closed' | 'opening-soon' | 'closing-soon' = isForexClosed ? 'closed' : 'open';
      let forexHours = 'Sun 5:00 PM - Fri 5:00 PM EST';
      let forexNextEvent = '';

      if (isForexClosed) {
        if (day === 0 && timeInMinutes < 17 * 60) {
          const minutesUntilOpen = (17 * 60) - timeInMinutes;
          forexNextEvent = `Opens in ${Math.floor(minutesUntilOpen / 60)}h ${minutesUntilOpen % 60}m`;
        } else {
          forexNextEvent = 'Opens Sunday at 5:00 PM';
        }
      } else {
        if (day === 5) {
          const minutesUntilClose = (17 * 60) - timeInMinutes;
          forexNextEvent = `Closes in ${Math.floor(minutesUntilClose / 60)}h ${minutesUntilClose % 60}m`;
          if (minutesUntilClose <= 30) forexStatus = 'closing-soon';
        } else {
          forexNextEvent = 'Closes Friday at 5:00 PM';
        }
      }

      // --- CRYPTO ---
      const cryptoStatus: 'open' | 'closed' | 'opening-soon' | 'closing-soon' = 'open';
      const cryptoHours = '24/7/365';
      const cryptoNextEvent = 'Always Open';

      const info: MarketStatusInfo[] = [
        {
          assetClass: 'Stocks (NYSE)',
          status: stockStatus,
          hours: stockHours,
          nextEvent: stockNextEvent,
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )
        },
        {
          assetClass: 'Forex',
          status: forexStatus,
          hours: forexHours,
          nextEvent: forexNextEvent,
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20H7m6-4h.01M15 12h.01" />
            </svg>
          )
        },
        {
          assetClass: 'Crypto',
          status: cryptoStatus,
          hours: cryptoHours,
          nextEvent: cryptoNextEvent,
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      ];

      setMarketInfo(info);
      setOverallStatus(stockStatus === 'open' ? 'open' : 'closed');
    };

    updateMarketStatus();
    const interval = setInterval(updateMarketStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${overallStatus === 'open' ? 'bg-[#4a9d7e] animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Market Status</span>
          <span className="text-[10px] font-bold text-gray-500">{currentTime}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {marketInfo.map((market) => (
          <div
            key={market.assetClass}
            className={`p-4 rounded-xl border transition-all ${
              market.status === 'open'
                ? 'bg-[#4a9d7e]/10 border-[#4a9d7e]/30'
                : market.status === 'closing-soon'
                ? 'bg-yellow-500/10 border-yellow-500/30'
                : market.status === 'opening-soon'
                ? 'bg-blue-500/10 border-blue-500/30'
                : 'bg-gray-800/30 border-gray-800/50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-lg ${
                  market.status === 'open'
                    ? 'bg-[#4a9d7e]/20 text-[#4a9d7e]'
                    : market.status === 'closing-soon'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : market.status === 'opening-soon'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-800/50 text-gray-500'
                }`}>
                  {market.icon}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{market.assetClass}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{market.hours}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest ${
                market.status === 'open'
                  ? 'bg-[#4a9d7e]/20 text-[#4a9d7e]'
                  : market.status === 'closing-soon'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : market.status === 'opening-soon'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-gray-800/50 text-gray-500'
              }`}>
                {market.status === 'open' ? 'Open' : market.status === 'closing-soon' ? 'Closing' : market.status === 'opening-soon' ? 'Opening' : 'Closed'}
              </div>
            </div>
            {market.nextEvent && (
              <p className="text-[9px] text-gray-400 font-medium">{market.nextEvent}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
