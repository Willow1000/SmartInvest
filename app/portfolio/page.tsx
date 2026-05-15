
'use client'

import { useState } from 'react';
import DashboardLayout from '../components/portfolio/DashboardLayout';
import PortfolioOverview from '../components/portfolio/PortfolioOverview';
import MarketOverview from '../components/portfolio/MarketOverview';
import MarketInsightsFeed from '../components/portfolio/MarketInsightsFeed';
import TradingAutomations from '../components/portfolio/TradingAutomations';
import InvestmentAnalytics from '../components/portfolio/InvestmentAnalytics';
import Wallet from '../components/portfolio/Wallet';
import DepositModal from '../components/portfolio/DepositModal';
import WithdrawModal from '../components/portfolio/WithdrawModal';
import NewsModal from '../components/portfolio/NewsModal';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
}

export default function DashboardPage() {
  const [user] = useState<User>({
    id: '1',
    email: 'user@example.com',
    firstName: 'User',
    lastName: 'Account',
    balance: 50000,
  });

  return (
    <DashboardLayout>
      <div className="space-y-12 md:space-y-16 lg:space-y-20 w-full">
        {/* User Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm">
            <span className="block md:inline">Email: {user.email}</span>
            <span className="hidden md:inline"> | </span>
            <span className="block md:inline">Account Balance: ${user.balance.toLocaleString()}</span>
          </p>
        </div>

        {/* 1. Hero Section - Portfolio Overview */}
        <div id="overview" className="scroll-mt-20 md:scroll-mt-24 w-full">
          <PortfolioOverview />
        </div>

        {/* 2. Market Intelligence Section */}
        <div className="space-y-4 md:space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">Market Intelligence</h2>
                <p className="text-gray-500 text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest font-bold mt-1">Real-time Market Analysis</p>
            </div>
          </div>
          
          {/* Responsive 3-column layout: Mobile stacked, Desktop side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full">
            {/* Market Intelligence - Main Content */}
            <div className="lg:col-span-2 w-full">
              <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 hover:border-[#4a9d7e]/20 transition-all duration-500 min-h-full">
                  <MarketOverview />
                </div>
              </div>
              
              {/* Market Insights - Sidebar */}
              <div className="lg:col-span-1 w-full">
                <div id="market-insights" className="scroll-mt-8">
                  <MarketInsightsFeed />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Trading Automations Section */}
          <div id="trading" className="scroll-mt-20 md:scroll-mt-24 w-full">
            <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 hover:border-[#4a9d7e]/20 transition-all duration-500">
              <TradingAutomations />
            </div>
          </div>

          {/* 4. Wallet Section */}
          <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 hover:border-[#4a9d7e]/20 transition-all duration-500 w-full">
            <Wallet />
          </div>

          {/* 5. Analytics Section */}
          <div id="analytics" className="scroll-mt-20 md:scroll-mt-24 w-full">
            <InvestmentAnalytics />
          </div>
        </div>
        
        {/* Modals */}
        <DepositModal />
        <WithdrawModal />
        <NewsModal />
      </DashboardLayout>
  );
}
