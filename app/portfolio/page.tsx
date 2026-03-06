import DashboardLayout from '../components/portfolio/DashboardLayout';
import PortfolioOverview from '../components/portfolio/PortfolioOverview';
import MarketOverview from '../components/portfolio/MarketOverview';
import MarketInsightsFeed from '../components/portfolio/MarketInsightsFeed';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-2 sm:p-3 md:p-4 lg:p-6 space-y-4 sm:space-y-6 md:space-y-8 w-full">
        {/* Portfolio Overview */}
        <PortfolioOverview />

        {/* Market Overview & Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full">
          <div className="md:col-span-2 lg:col-span-2 w-full">
            <MarketOverview />
          </div>
          <div className="w-full">
            <MarketInsightsFeed />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
