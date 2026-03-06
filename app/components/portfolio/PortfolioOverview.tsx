'use client';

import { useState } from 'react';

export default function PortfolioOverview() {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  const portfolioData = {
    totalBalance: 125430.50,
    totalEarnings: 28540.75,
    earningsPercent: 28.5,
    monthlyReturn: 4.2,
    dayChange: 1250.30,
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Deposit of $${depositAmount} initiated!`);
    setDepositAmount('');
    setShowDepositModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Portfolio Overview</h1>

      {/* Main Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Balance */}
        <div className="bg-[#252836] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-8 hover:border-[#4a9d7e]/30 transition-all duration-300 group">
          <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest font-bold mb-2">Total Balance</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">${portfolioData.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDepositModal(true)}
              className="flex-1 bg-[#4a9d7e] hover:bg-[#3d8567] text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs transition-all duration-300"
            >
              Deposit
            </button>
            <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs transition-all duration-300">
              Withdraw
            </button>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-[#4a9d7e]/20 to-[#4a9d7e]/5 border border-[#4a9d7e]/30 rounded-2xl p-8 hover:border-[#4a9d7e]/50 transition-all duration-300">
          <p className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-2">Total Earnings</p>
          <h2 className="text-4xl font-bold text-[#4a9d7e] mb-4">${portfolioData.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-[#4a9d7e] font-bold text-lg">+{portfolioData.earningsPercent}%</span>
            <span className="text-gray-500 text-sm">Return on Investment</span>
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="bg-[#252836] border border-gray-800 rounded-2xl p-8 hover:border-[#4a9d7e]/30 transition-all duration-300">
          <p className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-2">This Month</p>
          <h2 className="text-4xl font-bold text-white mb-4">+{portfolioData.monthlyReturn}%</h2>
          <div className="flex items-center space-x-2">
            <span className="text-[#4a9d7e] font-bold">+${portfolioData.dayChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span className="text-gray-500 text-sm">Today</span>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-[#252836] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white">Portfolio Performance</h3>
          <div className="flex space-x-2">
            {['1W', '1M', '3M', '1Y', 'ALL'].map((period) => (
              <button
                key={period}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  period === '1M'
                    ? 'bg-[#4a9d7e] text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Chart */}
        <svg viewBox="0 0 600 200" className="w-full h-32 sm:h-40 md:h-48">
          {/* Grid */}
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a9d7e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#4a9d7e" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Chart Line */}
          <polyline
            points="0,150 75,120 150,100 225,110 300,80 375,90 450,60 525,70 600,40"
            fill="none"
            stroke="#4a9d7e"
            strokeWidth="2"
          />

          {/* Chart Fill */}
          <polygon
            points="0,150 75,120 150,100 225,110 300,80 375,90 450,60 525,70 600,40 600,200 0,200"
            fill="url(#chartGradient)"
          />
        </svg>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-500">Last 30 days performance</span>
          <span className="text-[#4a9d7e] font-bold">↑ +$28,540.75</span>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#252836] border border-gray-800 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Deposit Funds</h3>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-2 block">Amount (USD)</label>
                <input
                  required
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50"
                />
              </div>
              <div className="bg-gray-800/30 border border-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <span className="font-bold">Processing Fee:</span> 0% (First deposit)
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#4a9d7e] hover:bg-[#3d8567] text-white px-4 py-3 rounded-lg font-bold uppercase tracking-widest transition-all"
                >
                  Confirm Deposit
                </button>
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-bold uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
