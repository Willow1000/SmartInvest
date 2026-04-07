
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

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 lg:space-y-12 responsive-padding">
        {/* 1. Hero Section - Portfolio Overview */}
        <div id="overview" className="scroll-mt-20 sm:scroll-mt-24">
          <PortfolioOverview />
        </div>

        {/* 2. Market Intelligence Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">Market Intelligence</h2>
              <p className="text-gray-500 text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest font-bold mt-1">Real-time Market Analysis</p>
            </div>
          </div>
          
          {/* Responsive 3-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Market Intelligence - Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:border-[#4a9d7e]/20 transition-all duration-500 h-full responsive-card">
                <MarketOverview />
              </div>
            </div>
            
            {/* Market Insights - Sidebar */}
            <div className="lg:col-span-1">
              <div id="market-insights" className="scroll-mt-8">
                <MarketInsightsFeed />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Trading Automations Section */}
        <div id="trading" className="scroll-mt-20 sm:scroll-mt-24">
          <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:border-[#4a9d7e]/20 transition-all duration-500 responsive-card">
            <TradingAutomations />
          </div>
        </div>

        {/* 4. Wallet Section */}
        <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:border-[#4a9d7e]/20 transition-all duration-500 responsive-card">
          <Wallet />
        </div>

        {/* 5. Analytics Section */}
        <div id="analytics" className="scroll-mt-20 sm:scroll-mt-24">
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
