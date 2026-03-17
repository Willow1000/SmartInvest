
'use client';

import { useModal } from '../auth/ModalContext';

export default function PortfolioOverview() {
  const { openDeposit, openWithdraw, balance, currencyProfits, transactions } = useModal();

  const totalEarnings = currencyProfits.reduce((acc, curr) => acc + curr.profit, 0);
  const totalInvestment = currencyProfits.reduce((acc, curr) => acc + curr.investment, 0);
  const totalProjection = currencyProfits.reduce((acc, curr) => acc + curr.projection, 0);
  const earningsPercent = totalInvestment > 0 ? (totalEarnings / totalInvestment) * 100 : 0;

  const scrollToInsights = () => {
    const element = document.getElementById('market-insights');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">Portfolio Intelligence</h1>
        <button 
          onClick={scrollToInsights}
          className="text-[#4a9d7e] hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center space-x-2 bg-[#4a9d7e]/10 px-4 py-2 rounded-lg border border-[#4a9d7e]/20"
        >
          <span>Market Insights</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Main Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-[#4a9d7e]/30 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-[60px] pointer-events-none" />
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-3 relative z-10">Total Equity</p>
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight relative z-10">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
          <div className="flex items-center space-x-4 relative z-10">
            <button
              onClick={openDeposit}
              className="flex-1 bg-[#4a9d7e] hover:bg-[#3d8567] text-white px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 shadow-lg shadow-[#4a9d7e]/10"
            >
              Deposit
            </button>
            <button
              onClick={openWithdraw}
              className="flex-1 bg-gray-800/50 hover:bg-gray-800 text-white px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 border border-gray-700/50"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-[#4a9d7e]/15 to-[#4a9d7e]/5 border border-[#4a9d7e]/20 rounded-3xl p-8 hover:border-[#4a9d7e]/40 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4a9d7e]/10 rounded-full blur-[60px] pointer-events-none" />
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-3 relative z-10">Accumulated Profit</p>
          <h2 className="text-4xl font-bold text-[#4a9d7e] mb-6 tracking-tight relative z-10">
            +${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
          <div className="flex items-center space-x-2 relative z-10">
            <div className="flex items-center px-2 py-1 bg-[#4a9d7e]/10 rounded-lg border border-[#4a9d7e]/20">
              <span className="text-[#4a9d7e] font-bold text-sm">+{earningsPercent.toFixed(2)}%</span>
            </div>
            <span className="text-gray-500 text-[11px] font-medium">Net ROI</span>
          </div>
        </div>

        {/* Projections */}
        <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-[#4a9d7e]/30 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-[60px] pointer-events-none" />
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-3 relative z-10">12M Projection</p>
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight relative z-10">
            +${totalProjection.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
          <div className="flex items-center space-x-2 relative z-10">
            <span className="text-[#4a9d7e] font-bold text-sm">Target Alpha</span>
            <span className="text-gray-500 text-[11px] font-medium">AI-Driven Forecast</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Currency Profit Breakdown */}
        <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Asset Profit Analysis</h3>
          <div className="space-y-4">
            {currencyProfits.map((asset) => (
              <div key={asset.symbol} className="p-4 bg-[#1a1d29]/40 border border-gray-800/50 rounded-2xl hover:border-[#4a9d7e]/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-[10px] font-bold text-[#4a9d7e] border border-gray-700">
                      {asset.symbol}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{asset.name}</p>
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">${asset.investment.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#4a9d7e] font-bold text-sm">+${asset.profit.toLocaleString()}</p>
                    <p className="text-gray-500 text-[10px] font-bold">+{asset.profitPercent}%</p>
                  </div>
                </div>
                {/* Progress Bar for Projection */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-gray-600">
                    <span>Current Yield</span>
                    <span>Projected: ${asset.projection.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#4a9d7e] rounded-full shadow-[0_0_8px_rgba(74,157,126,0.4)]"
                      style={{ width: `${(asset.profit / asset.projection) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Transaction Ledger</h3>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[480px] pr-2 custom-scrollbar">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-[#1a1d29]/40 border border-gray-800/30 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      tx.type === 'deposit' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    }`}>
                      {tx.type === 'deposit' ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm capitalize">{tx.type}</p>
                      <p className="text-gray-500 text-[10px] font-medium">{tx.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${tx.type === 'deposit' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600 px-2 py-0.5 bg-gray-800/50 rounded-md">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                No transactions yet
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-3 border border-gray-800 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all text-[10px] font-bold uppercase tracking-widest">
            Export Full Ledger
          </button>
        </div>
      </div>
    </div>
  );
}
