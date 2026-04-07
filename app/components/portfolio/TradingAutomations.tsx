'use client';

import { useState, useEffect } from 'react';

interface TradingBot {
  id: string;
  name: string;
  apy: string;
  risk: 'Conservative' | 'Balanced' | 'Aggressive';
  description: string;
  isActive: boolean;
  performance: number;
  trades: number;
  subscriptionPlan: {
    name: string;
    price: string;
    period: string;
    features: string[];
    limits: {
      maxTrades: number;
      maxAssets: number;
      customizationLevel: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
      supportLevel: 'Email' | 'Priority' | '24/7' | 'Dedicated';
      reportingFrequency: 'Monthly' | 'Weekly' | 'Daily' | 'Real-time';
    };
  };
  minInvestment: number;
  successRate: string;
  avgMonthlyReturn: string;
}

interface AlgorithmConfig {
  targetAssets: string[];
  riskTolerance: number;
  stopLoss: number;
  takeProfit: number;
  maxDrawdown: number;
  rebalanceFrequency: string;
  minOrderSize: number;
  maxOrderSize: number;
}

export default function TradingAutomations() {
  const [activeBot, setActiveBot] = useState<string | null>('grid');
  const [bots, setBots] = useState<TradingBot[]>([
    { 
      id: 'grid', 
      name: 'Grid Trading', 
      apy: '12.4%', 
      risk: 'Conservative', 
      description: 'Automatically buy low and sell high within a set price range for steady returns.', 
      isActive: false, 
      performance: 0, 
      trades: 0,
      subscriptionPlan: {
        name: 'Starter',
        price: '$49',
        period: '/month',
        features: [
          'Up to $10,000 investment',
          'Basic grid strategies',
          'Email support',
          'Monthly reports',
          'Max 50 trades per month',
          'Up to 5 assets',
          'Pre-set algorithms only'
        ],
        limits: {
          maxTrades: 50,
          maxAssets: 5,
          customizationLevel: 'Basic',
          supportLevel: 'Email',
          reportingFrequency: 'Monthly'
        }
      },
      minInvestment: 1000,
      successRate: '78.5%',
      avgMonthlyReturn: '8.2%'
    },
    { 
      id: 'dca', 
      name: 'Smart DCA', 
      apy: '15.8%', 
      risk: 'Conservative', 
      description: 'Dollar Cost Averaging with market timing for optimal entry points and consistent growth.', 
      isActive: false, 
      performance: 0, 
      trades: 0,
      subscriptionPlan: {
        name: 'Growth',
        price: '$99',
        period: '/month',
        features: [
          'Up to $50,000 investment',
          'Advanced DCA strategies',
          'Priority support',
          'Weekly reports',
          'AI optimization',
          'Max 200 trades per month',
          'Up to 10 assets',
          'Basic parameter adjustments'
        ],
        limits: {
          maxTrades: 200,
          maxAssets: 10,
          customizationLevel: 'Intermediate',
          supportLevel: 'Priority',
          reportingFrequency: 'Weekly'
        }
      },
      minInvestment: 2500,
      successRate: '82.3%',
      avgMonthlyReturn: '10.1%'
    },
    { 
      id: 'arbitrage', 
      name: 'Arbitrage Pro', 
      apy: '22.7%', 
      risk: 'Balanced', 
      description: 'Exploit price differences across multiple exchanges for consistent profit opportunities.', 
      isActive: false, 
      performance: 0, 
      trades: 0,
      subscriptionPlan: {
        name: 'Professional',
        price: '$199',
        period: '/month',
        features: [
          'Up to $100,000 investment',
          'Multi-exchange arbitrage',
          '24/7 support',
          'Daily reports',
          'Advanced analytics',
          'Custom strategies',
          'Unlimited trades',
          'Up to 25 assets',
          'Full algorithm customization'
        ],
        limits: {
          maxTrades: 999999,
          maxAssets: 25,
          customizationLevel: 'Advanced',
          supportLevel: '24/7',
          reportingFrequency: 'Daily'
        }
      },
      minInvestment: 5000,
      successRate: '87.9%',
      avgMonthlyReturn: '15.6%'
    },
    { 
      id: 'momentum', 
      name: 'Momentum Master', 
      apy: '28.4%', 
      risk: 'Aggressive', 
      description: 'Follow strong market trends using advanced indicators for maximum profit potential.', 
      isActive: false, 
      performance: 0, 
      trades: 0,
      subscriptionPlan: {
        name: 'Enterprise',
        price: '$399',
        period: '/month',
        features: [
          'Unlimited investment',
          'All strategies included',
          'Dedicated account manager',
          'Real-time alerts',
          'Custom algorithms',
          'API access',
          'White-glove service',
          'Unlimited trades',
          'Unlimited assets',
          'Complete algorithm control',
          'Strategy builder tools'
        ],
        limits: {
          maxTrades: 999999,
          maxAssets: 999999,
          customizationLevel: 'Expert',
          supportLevel: 'Dedicated',
          reportingFrequency: 'Real-time'
        }
      },
      minInvestment: 10000,
      successRate: '91.2%',
      avgMonthlyReturn: '19.8%'
    },
  ]);
  
  const [config, setConfig] = useState<AlgorithmConfig>({
    targetAssets: ['BTC/USD', 'ETH/USD'],
    riskTolerance: 50,
    stopLoss: 5.0,
    takeProfit: 12.0,
    maxDrawdown: 15.0,
    rebalanceFrequency: '1h',
    minOrderSize: 100,
    maxOrderSize: 10000
  });

  // Comprehensive asset pairs
  const availableAssetPairs = {
    'Crypto': [
      'BTC/USD', 'ETH/USD', 'SOL/USD', 'ADA/USD', 'DOT/USD', 'MATIC/USD',
      'AVAX/USD', 'LINK/USD', 'UNI/USD', 'AAVE/USD', 'COMP/USD', 'MKR/USD',
      'SUSHI/USD', 'CRV/USD', 'YFI/USD', 'SNX/USD', 'LUNA/USD', 'FTM/USD'
    ],
    'Forex': [
      'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'NZD/USD',
      'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'EUR/CHF', 'GBP/CHF', 'USD/CAD',
      'AUD/JPY', 'NZD/JPY', 'EUR/AUD', 'EUR/NZD', 'GBP/AUD', 'GBP/NZD'
    ],
    'Commodities': [
      'XAU/USD', 'XAG/USD', 'OIL/USD', 'GAS/USD', 'COPPER/USD',
      'WHEAT/USD', 'CORN/USD', 'SOYBEAN/USD', 'SUGAR/USD', 'COFFEE/USD'
    ],
    'Stocks': [
      'SPY/USD', 'QQQ/USD', 'IWM/USD', 'DIA/USD', 'VTI/USD', 'VOO/USD',
      'AAPL/USD', 'GOOGL/USD', 'MSFT/USD', 'AMZN/USD', 'TSLA/USD', 'META/USD'
    ]
  };
  
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedBot, setSelectedBot] = useState<TradingBot | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<TradingBot | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'online' | 'offline' | 'deploying'>('online');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [tradingHistory, setTradingHistory] = useState([
    {
      id: '1',
      timestamp: new Date('2026-04-05T10:30:00'),
      asset: 'BTC/USD',
      type: 'buy',
      amount: 0.05,
      price: 65432.50,
      total: 3271.63,
      status: 'completed',
      profit: 0,
      algorithm: 'Grid Trading'
    },
    {
      id: '2',
      timestamp: new Date('2026-04-05T11:45:00'),
      asset: 'BTC/USD',
      type: 'sell',
      amount: 0.05,
      price: 66123.80,
      total: 3306.19,
      status: 'completed',
      profit: 34.56,
      algorithm: 'Grid Trading'
    },
    {
      id: '3',
      timestamp: new Date('2026-04-05T12:15:00'),
      asset: 'ETH/USD',
      type: 'buy',
      amount: 1.2,
      price: 3456.78,
      total: 4148.14,
      status: 'completed',
      profit: 0,
      algorithm: 'Grid Trading'
    },
    {
      id: '4',
      timestamp: new Date('2026-04-05T13:30:00'),
      asset: 'ETH/USD',
      type: 'sell',
      amount: 1.2,
      price: 3521.45,
      total: 4225.74,
      profit: 77.60,
      algorithm: 'Grid Trading'
    },
    {
      id: '5',
      timestamp: new Date('2026-04-05T14:20:00'),
      asset: 'SOL/USD',
      type: 'buy',
      amount: 15,
      price: 142.35,
      total: 2135.25,
      status: 'pending',
      profit: 0,
      algorithm: 'Grid Trading'
    }
  ]);

  // Simulate real-time bot performance
  useEffect(() => {
    const interval = setInterval(() => {
      setBots(prevBots => 
        prevBots.map(bot => {
          if (bot.isActive) {
            const performanceChange = (Math.random() - 0.3) * 2; // Slight positive bias
            const newPerformance = Math.max(-10, Math.min(50, bot.performance + performanceChange));
            const newTrades = bot.trades + Math.floor(Math.random() * 3);
            return { ...bot, performance: newPerformance, trades: newTrades };
          }
          return bot;
        })
      );
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleBot = (botId: string) => {
    setBots(prevBots => 
      prevBots.map(bot => 
        bot.id === botId ? { ...bot, isActive: !bot.isActive, performance: bot.isActive ? bot.performance : 0, trades: bot.isActive ? bot.trades : 0 } : bot
      )
    );
  };

  const selectBot = (bot: TradingBot) => {
    setSelectedBot(bot);
  };

  const subscribeToAlgorithm = () => {
    if (selectedBot) {
      setSystemStatus('deploying');
      setTimeout(() => {
        setIsSubscribed(true);
        setCurrentSubscription(selectedBot);
        setSystemStatus('online');
        // Activate the selected bot
        toggleBot(selectedBot.id);
        
        // Update config to match new plan limits
        if (selectedBot.subscriptionPlan.limits.maxAssets < config.targetAssets.length) {
          // Remove excess assets if new plan has lower limit
          const newAssets = config.targetAssets.slice(0, selectedBot.subscriptionPlan.limits.maxAssets);
          setConfig(prev => ({ ...prev, targetAssets: newAssets }));
        }
      }, 2000);
    }
  };

  const upgradeSubscription = (newBot: TradingBot) => {
    setSystemStatus('deploying');
    setTimeout(() => {
      setCurrentSubscription(newBot);
      setSelectedBot(newBot);
      setSystemStatus('online');
      
      // Update config to match new plan limits
      if (newBot.subscriptionPlan.limits.maxAssets < config.targetAssets.length) {
        // Remove excess assets if new plan has lower limit
        const newAssets = config.targetAssets.slice(0, newBot.subscriptionPlan.limits.maxAssets);
        setConfig(prev => ({ ...prev, targetAssets: newAssets }));
      }
      
      setShowUpgradeModal(false);
    }, 2000);
  };

  const canUpgrade = (bot: TradingBot) => {
    if (!currentSubscription) return true;
    
    const planOrder = ['Starter', 'Growth', 'Professional', 'Enterprise'];
    const currentIndex = planOrder.indexOf(currentSubscription.subscriptionPlan.name);
    const botIndex = planOrder.indexOf(bot.subscriptionPlan.name);
    
    return botIndex > currentIndex;
  };

  const addAsset = (asset: string) => {
    if (!config.targetAssets.includes(asset) && selectedBot && config.targetAssets.length < selectedBot.subscriptionPlan.limits.maxAssets) {
      setConfig(prev => ({ ...prev, targetAssets: [...prev.targetAssets, asset] }));
    }
  };

  const removeAsset = (asset: string) => {
    setConfig(prev => ({ ...prev, targetAssets: prev.targetAssets.filter(a => a !== asset) }));
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('Crypto');
  const [showAssetSelector, setShowAssetSelector] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Trading <span className="text-[#4a9d7e]">Automations</span></h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Select a standard algorithmic trading bot or build your custom algorithm to trade on your behalf 24/7.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Available Bots */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-2xl font-bold text-white mb-6">Choose Your Algorithm</h3>
          <div className="space-y-4">
            {bots.map(bot => (
              <div
                key={bot.id}
                onClick={() => selectBot(bot)}
                className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                  selectedBot?.id === bot.id
                    ? 'bg-[#4a9d7e]/10 border-[#4a9d7e] shadow-[0_0_30px_rgba(74,157,126,0.1)]'
                    : currentSubscription?.id === bot.id
                    ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
                    : 'bg-[#252836]/40 border-gray-800/50 hover:border-[#4a9d7e]/50'
                }`}
              >
                {selectedBot?.id === bot.id && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#4a9d7e]/20 rounded-full blur-[40px] pointer-events-none" />
                )}
                {currentSubscription?.id === bot.id && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[40px] pointer-events-none" />
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-white group-hover:text-[#4a9d7e] transition-colors">{bot.name}</h4>
                      <span className="text-[#4a9d7e] font-bold text-sm bg-[#4a9d7e]/10 px-3 py-1 rounded-full">{bot.apy} APY</span>
                      {currentSubscription?.id === bot.id && (
                        <span className="text-emerald-500 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {bot.successRate} Success Rate
                      </span>
                      <span className="text-blue-500 font-bold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {bot.avgMonthlyReturn} Avg Monthly
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">{bot.subscriptionPlan.price}</div>
                    <div className="text-gray-400 text-xs">{bot.subscriptionPlan.period}</div>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{bot.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#1a1d29]/40 rounded-lg p-3">
                    <div className="text-gray-500 text-xs mb-1">Min Investment</div>
                    <div className="text-white font-bold">${bot.minInvestment.toLocaleString()}</div>
                  </div>
                  <div className="bg-[#1a1d29]/40 rounded-lg p-3">
                    <div className="text-gray-500 text-xs mb-1">Strategy Type</div>
                    <div className={`text-xs font-bold ${
                      bot.risk === 'Conservative' ? 'text-emerald-500' : 
                      bot.risk === 'Balanced' ? 'text-blue-500' : 'text-purple-500'
                    }`}>
                      {bot.risk}
                    </div>
                  </div>
                </div>
                
                {bot.isActive && (
                  <div className="space-y-3 pt-4 border-t border-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">Performance Today</span>
                      <span className={`font-bold text-sm ${
                        bot.performance >= 0 ? 'text-emerald-500' : 'text-rose-500'
                      }`}>
                        {bot.performance >= 0 ? '+' : ''}{bot.performance.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">Total Trades</span>
                      <span className="text-white font-bold text-sm">{bot.trades}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    {selectedBot?.id === bot.id && (
                      <span className="text-[#4a9d7e] text-xs font-bold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {currentSubscription?.id === bot.id ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowUpgradeModal(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Upgrade
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentSubscription && canUpgrade(bot)) {
                              upgradeSubscription(bot);
                            } else if (!currentSubscription) {
                              selectBot(bot);
                            }
                          }}
                          disabled={currentSubscription && !canUpgrade(bot)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                            currentSubscription && !canUpgrade(bot)
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : currentSubscription && canUpgrade(bot)
                              ? 'bg-[#4a9d7e] text-white hover:bg-[#4a9d7e]/90'
                              : 'bg-[#4a9d7e] text-white hover:bg-[#4a9d7e]/90'
                          }`}
                        >
                          {currentSubscription && canUpgrade(bot) ? (
                            <>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                              Upgrade
                            </>
                          ) : currentSubscription ? (
                            'Downgrade'
                          ) : (
                            'Select'
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectBot(bot);
                          }}
                          className={`w-6 h-6 rounded-full border-2 transition-colors flex items-center justify-center ${
                            selectedBot?.id === bot.id ? 'border-[#4a9d7e] bg-[#4a9d7e]' : 'border-gray-600 bg-transparent'
                          }`}
                        >
                          {selectedBot?.id === bot.id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Details */}
        <div className="lg:col-span-7 bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 flex flex-col relative overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#4a9d7e]/5 rounded-full blur-[60px] pointer-events-none" />

          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-2xl font-bold text-white">Subscription Details</h3>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-2 ${
                systemStatus === 'online' ? 'text-emerald-500 bg-emerald-500/10' :
                systemStatus === 'deploying' ? 'text-yellow-500 bg-yellow-500/10' :
                'text-rose-500 bg-rose-500/10'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  systemStatus === 'online' ? 'bg-emerald-500 animate-pulse' :
                  systemStatus === 'deploying' ? 'bg-yellow-500 animate-spin' :
                  'bg-rose-500'
                }`} />
                {systemStatus === 'online' ? 'System Online' :
                 systemStatus === 'deploying' ? 'Processing...' :
                 'System Offline'}
              </span>
              {isSubscribed && (
                <span className="text-gray-400 text-xs">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-6 relative z-10">
            {isSubscribed && currentSubscription ? (
              <>
                {/* Current Subscription Status */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg">{currentSubscription.name} Plan</h4>
                        <p className="text-emerald-500 text-sm font-bold">Active Subscription</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-500 font-bold text-2xl">{currentSubscription.subscriptionPlan.price}</div>
                      <div className="text-gray-400 text-xs">{currentSubscription.subscriptionPlan.period}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-gray-500 text-xs">Trades/Month</div>
                      <div className="text-emerald-500 font-bold text-sm">
                        {currentSubscription.subscriptionPlan.limits.maxTrades >= 999999 ? '∞' : currentSubscription.subscriptionPlan.limits.maxTrades.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs">Max Assets</div>
                      <div className="text-emerald-500 font-bold text-sm">
                        {currentSubscription.subscriptionPlan.limits.maxAssets >= 999999 ? '∞' : currentSubscription.subscriptionPlan.limits.maxAssets}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs">Customization</div>
                      <div className="text-emerald-500 font-bold text-sm">{currentSubscription.subscriptionPlan.limits.customizationLevel}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs">Support</div>
                      <div className="text-emerald-500 font-bold text-sm">{currentSubscription.subscriptionPlan.limits.supportLevel}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-4 py-3 bg-[#4a9d7e] text-white rounded-xl font-bold hover:bg-[#4a9d7e]/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Upgrade Plan
                  </button>
                  <button 
                    onClick={() => setShowSettingsModal(true)}
                    className="px-4 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage Settings
                  </button>
                </div>
              </>
            ) : selectedBot ? (
              <>
                {/* Selected Bot Info */}
                <div className="bg-[#1a1d29]/40 rounded-xl p-4 border border-gray-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-white">{selectedBot.name}</h4>
                      <p className="text-gray-400 text-sm">{selectedBot.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[#4a9d7e] font-bold text-2xl">{selectedBot.subscriptionPlan.price}</div>
                      <div className="text-gray-400 text-xs">{selectedBot.subscriptionPlan.period}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-gray-500 text-xs">Expected APY</div>
                      <div className="text-[#4a9d7e] font-bold">{selectedBot.apy}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs">Success Rate</div>
                      <div className="text-blue-500 font-bold">{selectedBot.successRate}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs">Monthly Return</div>
                      <div className="text-purple-500 font-bold">{selectedBot.avgMonthlyReturn}</div>
                    </div>
                  </div>
                  
                  {/* Plan Limits Display */}
                  <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-[#1a1d29]/40 rounded-lg border border-gray-800/50">
                    <div className="text-center">
                      <div className="text-gray-500 text-xs mb-1">Monthly Trades</div>
                      <div className="text-white font-bold text-sm">
                        {selectedBot.subscriptionPlan.limits.maxTrades >= 999999 ? 'Unlimited' : selectedBot.subscriptionPlan.limits.maxTrades.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs mb-1">Max Assets</div>
                      <div className="text-white font-bold text-sm">
                        {selectedBot.subscriptionPlan.limits.maxAssets >= 999999 ? 'Unlimited' : selectedBot.subscriptionPlan.limits.maxAssets}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs mb-1">Customization</div>
                      <div className={`text-xs font-bold ${
                        selectedBot.subscriptionPlan.limits.customizationLevel === 'Expert' ? 'text-purple-500' :
                        selectedBot.subscriptionPlan.limits.customizationLevel === 'Advanced' ? 'text-blue-500' :
                        selectedBot.subscriptionPlan.limits.customizationLevel === 'Intermediate' ? 'text-yellow-500' :
                        'text-emerald-500'
                      }`}>
                        {selectedBot.subscriptionPlan.limits.customizationLevel}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-white font-bold text-sm">Subscription Features:</h5>
                    <ul className="space-y-1">
                      {selectedBot.subscriptionPlan.features.map((feature, index) => (
                        <li key={index} className="text-gray-300 text-xs flex items-center gap-2">
                          <svg className="w-3 h-3 text-[#4a9d7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Asset Pairs */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Target Assets ({config.targetAssets.length}/{selectedBot ? (selectedBot.subscriptionPlan.limits.maxAssets >= 999999 ? '∞' : selectedBot.subscriptionPlan.limits.maxAssets) : '10'})
                    </label>
                    <button
                      onClick={() => setShowAssetSelector(!showAssetSelector)}
                      disabled={selectedBot && config.targetAssets.length >= selectedBot.subscriptionPlan.limits.maxAssets}
                      className="px-3 py-1 bg-[#4a9d7e]/10 border border-[#4a9d7e]/30 rounded-lg text-xs text-[#4a9d7e] hover:bg-[#4a9d7e]/20 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Browse Assets
                    </button>
                  </div>
                  
                  {/* Selected Assets */}
                  <div className="flex flex-wrap gap-2">
                    {config.targetAssets.map(asset => (
                      <button 
                        key={asset} 
                        onClick={() => removeAsset(asset)}
                        className="px-3 py-1.5 bg-[#4a9d7e]/10 border border-[#4a9d7e]/30 rounded-lg text-xs text-[#4a9d7e] hover:bg-[#4a9d7e]/20 transition-colors flex items-center gap-2"
                      >
                        {asset}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ))}
                    {selectedBot && config.targetAssets.length < selectedBot.subscriptionPlan.limits.maxAssets && (
                      <button 
                        onClick={() => setShowAssetSelector(true)}
                        className="px-3 py-1.5 bg-[#4a9d7e]/10 border border-[#4a9d7e]/30 rounded-lg text-xs text-[#4a9d7e] font-bold hover:bg-[#4a9d7e]/20 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Asset
                      </button>
                    )}
                  </div>
                  
                  {/* Asset Limit Warning */}
                  {selectedBot && config.targetAssets.length >= selectedBot.subscriptionPlan.limits.maxAssets && (
                    <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-yellow-500 text-xs">
                        Asset limit reached. Upgrade to {selectedBot.subscriptionPlan.limits.maxAssets >= 25 ? 'Enterprise' : 'Professional'} plan for more assets.
                      </p>
                    </div>
                  )}
                </div>

                {/* Algorithm Customization */}
                {selectedBot && selectedBot.subscriptionPlan.limits.customizationLevel !== 'Basic' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Algorithm Customization</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        selectedBot.subscriptionPlan.limits.customizationLevel === 'Expert' ? 'bg-purple-500/10 text-purple-500' :
                        selectedBot.subscriptionPlan.limits.customizationLevel === 'Advanced' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {selectedBot.subscriptionPlan.limits.customizationLevel}
                      </span>
                    </div>
                    
                    {selectedBot.subscriptionPlan.limits.customizationLevel === 'Intermediate' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#1a1d29]/40 rounded-lg p-3 border border-gray-800/50">
                          <div className="text-gray-500 text-xs mb-2">Strategy Sensitivity</div>
                          <select className="w-full bg-[#252836]/60 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4a9d7e]">
                            <option>Conservative</option>
                            <option>Balanced</option>
                            <option>Aggressive</option>
                          </select>
                        </div>
                        <div className="bg-[#1a1d29]/40 rounded-lg p-3 border border-gray-800/50">
                          <div className="text-gray-500 text-xs mb-2">Trade Frequency</div>
                          <select className="w-full bg-[#252836]/60 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4a9d7e]">
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                          </select>
                        </div>
                      </div>
                    )}
                    
                    {(selectedBot.subscriptionPlan.limits.customizationLevel === 'Advanced' || selectedBot.subscriptionPlan.limits.customizationLevel === 'Expert') && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-[#1a1d29]/40 rounded-lg p-3 border border-gray-800/50">
                            <div className="text-gray-500 text-xs mb-2">Strategy Type</div>
                            <select className="w-full bg-[#252836]/60 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4a9d7e]">
                              <option>Grid Trading</option>
                              <option>DCA Strategy</option>
                              <option>Mean Reversion</option>
                              <option>Trend Following</option>
                              <option>Custom</option>
                            </select>
                          </div>
                          <div className="bg-[#1a1d29]/40 rounded-lg p-3 border border-gray-800/50">
                            <div className="text-gray-500 text-xs mb-2">Execution Speed</div>
                            <select className="w-full bg-[#252836]/60 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4a9d7e]">
                              <option>Standard</option>
                              <option>Fast</option>
                              <option>Ultra Fast</option>
                            </select>
                          </div>
                        </div>
                        <div className="bg-[#1a1d29]/40 rounded-lg p-3 border border-gray-800/50">
                          <div className="text-gray-500 text-xs mb-2">Advanced Parameters</div>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="number" placeholder="RSI Threshold" className="bg-[#252836]/60 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4a9d7e]" />
                            <input type="number" placeholder="Volume Filter" className="bg-[#252836]/60 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4a9d7e]" />
                            <input type="number" placeholder="Spread Threshold" className="bg-[#252836]/60 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4a9d7e]" />
                            <input type="number" placeholder="Time Window" className="bg-[#252836]/60 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4a9d7e]" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedBot.subscriptionPlan.limits.customizationLevel === 'Expert' && (
                      <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="text-purple-500 font-bold text-sm">Expert Features</span>
                        </div>
                        <ul className="text-gray-300 text-xs space-y-1">
                          <li>• Custom algorithm builder</li>
                          <li>• Backtesting environment</li>
                          <li>• Strategy sharing marketplace</li>
                          <li>• API access for external tools</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Strategy Profile */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Strategy Profile</label>
                    <span className="text-white font-bold text-sm">
                      {config.riskTolerance < 30 ? 'Conservative' : 
                       config.riskTolerance < 70 ? 'Balanced' : 'Aggressive'} ({config.riskTolerance}%)
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={config.riskTolerance}
                    onChange={(e) => setConfig(prev => ({ ...prev, riskTolerance: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#4a9d7e]" 
                  />
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <span>Conservative</span>
                    <span>Aggressive</span>
                  </div>
                </div>

                {/* Stop Loss / Take Profit */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stop Loss</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={config.stopLoss}
                        onChange={(e) => setConfig(prev => ({ ...prev, stopLoss: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-[#1a1d29]/60 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e] transition-colors" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Take Profit</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={config.takeProfit}
                        onChange={(e) => setConfig(prev => ({ ...prev, takeProfit: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-[#1a1d29]/60 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e] transition-colors" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                    </div>
                  </div>
                </div>

                {/* Subscribe Button */}
                <div className="pt-4 border-t border-gray-800">
                  <button
                    onClick={subscribeToAlgorithm}
                    disabled={isSubscribed || systemStatus === 'deploying'}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                      isSubscribed 
                        ? 'bg-emerald-500 cursor-not-allowed'
                        : systemStatus === 'deploying'
                        ? 'bg-yellow-500 cursor-not-allowed'
                        : 'bg-[#4a9d7e] hover:bg-[#4a9d7e]/90 hover:shadow-lg hover:shadow-[#4a9d7e]/20'
                    }`}
                  >
                    {isSubscribed ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Subscribed Successfully
                      </>
                    ) : systemStatus === 'deploying' ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Processing Subscription...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Subscribe to {selectedBot.name}
                      </>
                    )}
                  </button>
                  
                  {!isSubscribed && (
                    <div className="mt-3 text-center">
                      <p className="text-gray-400 text-xs">
                        You will be charged {selectedBot.subscriptionPlan.price}{selectedBot.subscriptionPlan.period}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Cancel anytime • No hidden fees
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#4a9d7e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#4a9d7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Select an Algorithm</h4>
                <p className="text-gray-400 text-sm">Choose from our proven trading algorithms to start your investment journey</p>
              </div>
            )}
          </div>
        </div>

        {/* Asset Selector Modal */}
        {showAssetSelector && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1d29] border border-gray-800/50 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Select Asset Pairs</h3>
                <button
                  onClick={() => setShowAssetSelector(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Category Tabs */}
              <div className="flex space-x-1 mb-6 bg-[#252836]/50 p-1 rounded-xl">
                {Object.keys(availableAssetPairs).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-[#4a9d7e] text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              {/* Asset Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableAssetPairs[selectedCategory as keyof typeof availableAssetPairs].map(pair => (
                  <button
                    key={pair}
                    onClick={() => {
                      addAsset(pair);
                      if (selectedBot && config.targetAssets.length >= selectedBot.subscriptionPlan.limits.maxAssets - 1) {
                        setShowAssetSelector(false);
                      }
                    }}
                    disabled={config.targetAssets.includes(pair) || (selectedBot && config.targetAssets.length >= selectedBot.subscriptionPlan.limits.maxAssets)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      config.targetAssets.includes(pair)
                        ? 'bg-[#4a9d7e]/10 border-[#4a9d7e]/30 text-[#4a9d7e] cursor-not-allowed'
                        : selectedBot && config.targetAssets.length >= selectedBot.subscriptionPlan.limits.maxAssets
                        ? 'bg-gray-800/50 border-gray-700/50 text-gray-600 cursor-not-allowed'
                        : 'bg-[#252836]/40 border-gray-700/50 text-gray-300 hover:border-[#4a9d7e]/50 hover:text-white hover:bg-[#4a9d7e]/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{pair}</span>
                      {config.targetAssets.includes(pair) && (
                        <svg className="w-4 h-4 text-[#4a9d7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">
                    Selected: {config.targetAssets.length}/{selectedBot ? (selectedBot.subscriptionPlan.limits.maxAssets >= 999999 ? '∞' : selectedBot.subscriptionPlan.limits.maxAssets) : '10'}
                  </span>
                  <button
                    onClick={() => setShowAssetSelector(false)}
                    className="px-4 py-2 bg-[#4a9d7e] text-white rounded-lg hover:bg-[#4a9d7e]/90 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trading History Section */}
        {isSubscribed && currentSubscription && (
          <div className="lg:col-span-12 bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 flex flex-col relative overflow-hidden">
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#4a9d7e]/5 rounded-full blur-[60px] pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-2xl font-bold text-white">Trading History</h3>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-gray-500 text-xs">Total Profit</div>
                  <div className="text-emerald-500 font-bold text-lg">
                    ${tradingHistory.reduce((sum, trade) => sum + trade.profit, 0).toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-xs">Total Trades</div>
                  <div className="text-white font-bold text-lg">{tradingHistory.length}</div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative z-10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800/50">
                      <th className="text-left py-3 px-4 text-gray-500 text-xs font-bold uppercase tracking-widest">Time</th>
                      <th className="text-left py-3 px-4 text-gray-500 text-xs font-bold uppercase tracking-widest">Asset</th>
                      <th className="text-left py-3 px-4 text-gray-500 text-xs font-bold uppercase tracking-widest">Type</th>
                      <th className="text-right py-3 px-4 text-gray-500 text-xs font-bold uppercase tracking-widest">Amount</th>
                      <th className="text-right py-3 px-4 text-gray-500 text-xs font-bold uppercase tracking-widest">Price</th>
                      <th className="text-right py-3 px-4 text-gray-500 text-xs font-bold uppercase tracking-widest">Total</th>
                      <th className="text-right py-3 px-4 text-gray-500 text-xs font-bold uppercase tracking-widest">Profit</th>
                      <th className="text-center py-3 px-4 text-gray-500 text-xs font-bold uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradingHistory.map((trade) => (
                      <tr key={trade.id} className="border-b border-gray-800/30 hover:bg-[#4a9d7e]/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="text-white text-sm">
                            {trade.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {trade.timestamp.toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white font-bold text-sm">{trade.asset}</div>
                          <div className="text-gray-500 text-xs">{trade.algorithm}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            trade.type === 'buy' 
                              ? 'bg-emerald-500/10 text-emerald-500' 
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                            {trade.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-white font-bold text-sm">{trade.amount}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-white font-bold text-sm">
                            ${trade.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-white font-bold text-sm">
                            ${trade.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className={`font-bold text-sm ${
                            trade.profit > 0 
                              ? 'text-emerald-500' 
                              : trade.profit < 0 
                              ? 'text-red-500' 
                              : 'text-gray-500'
                          }`}>
                            {trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(2)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            trade.status === 'completed' 
                              ? 'bg-emerald-500/10 text-emerald-500' 
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {trade.status === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-[#1a1d29]/40 rounded-xl p-4 border border-gray-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-xs">Win Rate</span>
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="text-emerald-500 font-bold text-2xl">
                    {((tradingHistory.filter(t => t.profit > 0).length / tradingHistory.filter(t => t.status === 'completed').length) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-[#1a1d29]/40 rounded-xl p-4 border border-gray-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-xs">Avg Profit</span>
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 00-2-2h2a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <div className="text-blue-500 font-bold text-2xl">
                    ${(tradingHistory.reduce((sum, trade) => sum + trade.profit, 0) / tradingHistory.filter(t => t.profit > 0).length || 0).toFixed(2)}
                  </div>
                </div>
                <div className="bg-[#1a1d29]/40 rounded-xl p-4 border border-gray-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-xs">Best Trade</span>
                    <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="text-purple-500 font-bold text-2xl">
                    ${Math.max(...tradingHistory.map(t => t.profit)).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1d29] border border-gray-800/50 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Upgrade Your Plan</h3>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Current Plan: {currentSubscription?.name}</h4>
                      <p className="text-emerald-500 text-sm">{currentSubscription?.subscriptionPlan.price}{currentSubscription?.subscriptionPlan.period}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bots.filter(bot => canUpgrade(bot)).map(bot => (
                  <div
                    key={bot.id}
                    onClick={() => upgradeSubscription(bot)}
                    className="p-4 rounded-xl border border-gray-700/50 hover:border-[#4a9d7e]/50 hover:bg-[#4a9d7e]/5 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-bold">{bot.name}</h4>
                        <p className="text-[#4a9d7e] font-bold text-lg">{bot.subscriptionPlan.price}{bot.subscriptionPlan.period}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-500 font-bold text-sm">+{bot.apy} APY</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center">
                        <div className="text-gray-500 text-xs">Trades</div>
                        <div className="text-white font-bold text-sm">
                          {bot.subscriptionPlan.limits.maxTrades >= 999999 ? '∞' : bot.subscriptionPlan.limits.maxTrades.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500 text-xs">Assets</div>
                        <div className="text-white font-bold text-sm">
                          {bot.subscriptionPlan.limits.maxAssets >= 999999 ? '∞' : bot.subscriptionPlan.limits.maxAssets}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500 text-xs">Custom</div>
                        <div className="text-white font-bold text-xs">{bot.subscriptionPlan.limits.customizationLevel}</div>
                      </div>
                    </div>
                    
                    <button className="w-full py-2 bg-[#4a9d7e] text-white rounded-lg font-bold hover:bg-[#4a9d7e]/90 transition-colors">
                      Upgrade Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettingsModal && currentSubscription && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1d29] border border-gray-800/50 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Algorithm Settings</h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Trading Parameters */}
                <div className="bg-[#252836]/50 rounded-xl p-6 space-y-4">
                  <h4 className="text-lg font-bold text-white mb-4">Trading Parameters</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Max Daily Trades</label>
                      <input 
                        type="number" 
                        defaultValue={currentSubscription.subscriptionPlan.limits.maxTrades >= 999999 ? 100 : currentSubscription.subscriptionPlan.limits.maxTrades}
                        max={1000}
                        className="w-full bg-[#1a1d29]/60 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e] transition-colors" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Max Position Size</label>
                      <input 
                        type="number" 
                        defaultValue={10000}
                        max={100000}
                        step={1000}
                        className="w-full bg-[#1a1d29]/60 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e] transition-colors" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Stop Loss %</label>
                      <input 
                        type="number" 
                        defaultValue={config.stopLoss}
                        max={100}
                        step={0.1}
                        onChange={(e) => setConfig(prev => ({ ...prev, stopLoss: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-[#1a1d29]/60 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e] transition-colors" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Take Profit %</label>
                      <input 
                        type="number" 
                        defaultValue={config.takeProfit}
                        max={1000}
                        step={0.1}
                        onChange={(e) => setConfig(prev => ({ ...prev, takeProfit: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-[#1a1d29]/60 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e] transition-colors" 
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-[#252836]/50 rounded-xl p-6 space-y-4">
                  <h4 className="text-lg font-bold text-white mb-4">Notifications</h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Email Notifications</span>
                      <button
                        onClick={() => {}}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4a9d7e] focus:ring-offset-2"
                      >
                        <span className="sr-only">Toggle email notifications</span>
                        <span className={`transform transition-transform ${
                          true ? 'translate-x-5' : 'translate-x-0'
                        }`}>
                          <span className="inline-block h-4 w-5 rounded-full bg-gray-400 shadow-lg transform ring-0 transition duration-200 ease-in-out"></span>
                        </span>
                      </button>
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Push Notifications</span>
                      <button
                        onClick={() => {}}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4a9d7e] focus:ring-offset-2"
                      >
                        <span className="sr-only">Toggle push notifications</span>
                        <span className={`transform transition-transform ${
                          false ? 'translate-x-5' : 'translate-x-0'
                        }`}>
                          <span className="inline-block h-4 w-5 rounded-full bg-gray-400 shadow-lg transform ring-0 transition duration-200 ease-in-out"></span>
                        </span>
                      </button>
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">SMS Alerts</span>
                      <button
                        onClick={() => {}}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4a9d7e] focus:ring-offset-2"
                      >
                        <span className="sr-only">Toggle SMS alerts</span>
                        <span className={`transform transition-transform ${
                          false ? 'translate-x-5' : 'translate-x-0'
                        }`}>
                          <span className="inline-block h-4 w-5 rounded-full bg-gray-400 shadow-lg transform ring-0 transition duration-200 ease-in-out"></span>
                        </span>
                      </button>
                    </label>
                  </div>
                </div>

                {/* Risk Management */}
                <div className="bg-[#252836]/50 rounded-xl p-6 space-y-4">
                  <h4 className="text-lg font-bold text-white mb-4">Risk Management</h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Daily Loss Limit</span>
                      <input 
                        type="number" 
                        defaultValue={1000}
                        max={10000}
                        step={100}
                        className="w-32 bg-[#1a1d29]/60 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e] transition-colors" 
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Auto-Stop Trading</span>
                      <button
                        onClick={() => {}}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4a9d7e] focus:ring-offset-2"
                      >
                        <span className="sr-only">Toggle auto-stop trading</span>
                        <span className={`transform transition-transform ${
                          false ? 'translate-x-5' : 'translate-x-0'
                        }`}>
                          <span className="inline-block h-4 w-5 rounded-full bg-gray-400 shadow-lg transform ring-0 transition duration-200 ease-in-out"></span>
                        </span>
                      </button>
                    </label>
                  </div>
                </div>

                {/* Advanced Settings */}
                {(currentSubscription.subscriptionPlan.limits.customizationLevel === 'Advanced' || currentSubscription.subscriptionPlan.limits.customizationLevel === 'Expert') && (
                  <div className="bg-[#252836]/50 rounded-xl p-6 space-y-4">
                    <h4 className="text-lg font-bold text-white mb-4">Advanced Settings</h4>
                    
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">API Access</span>
                        <button
                          onClick={() => {}}
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4a9d7e] focus:ring-offset-2"
                        >
                          <span className="sr-only">Toggle API access</span>
                          <span className={`transform transition-transform ${
                            false ? 'translate-x-5' : 'translate-x-0'
                          }`}>
                            <span className="inline-block h-4 w-5 rounded-full bg-gray-400 shadow-lg transform ring-0 transition duration-200 ease-in-out"></span>
                          </span>
                        </button>
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Webhook URLs</span>
                        <input 
                          type="url" 
                          placeholder="https://your-webhook-url.com"
                          className="w-full bg-[#1a1d29]/60 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4a9d7e] transition-colors" 
                        />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Custom Strategy</span>
                        <select className="w-full bg-[#1a1d29]/60 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e] transition-colors">
                          <option>Default Grid Strategy</option>
                          <option>Aggressive DCA</option>
                          <option>Conservative Arbitrage</option>
                          <option>Custom</option>
                        </select>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-6 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save settings logic here
                    setShowSettingsModal(false);
                  }}
                  className="px-6 py-3 bg-[#4a9d7e] text-white rounded-xl font-bold hover:bg-[#4a9d7e]/90 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}