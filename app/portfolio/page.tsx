
import DashboardLayout from '../components/portfolio/DashboardLayout';
import PortfolioOverview from '../components/portfolio/PortfolioOverview';
import MarketOverview from '../components/portfolio/MarketOverview';
import MarketInsightsFeed from '../components/portfolio/MarketInsightsFeed';
import InvestmentAnalytics from '../components/portfolio/InvestmentAnalytics';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-12">
        <div id="overview" className="scroll-mt-24">
          <PortfolioOverview />
        </div>

        <div id="analytics" className="scroll-mt-24">
          <InvestmentAnalytics />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2">
            <MarketOverview />
          </div>
          <div id="market-insights" className="xl:col-span-1 scroll-mt-24">
            <MarketInsightsFeed />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
