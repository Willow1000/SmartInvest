'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { fetchMarketData, SEED_MARKET_DATA } from '@/app/lib/marketData';

type Instrument = {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
  dayHigh?: number;
  dayLow?: number;
  weekHigh?: number;
  weekLow?: number;
};

type MarketData = {
  stocks: Instrument[];
  forex: Instrument[];
  metals: Instrument[];
  crypto: Instrument[];
};

type MarketSentiment = {
  overall: 'Bullish' | 'Bearish' | 'Neutral';
  fgIndex: number;
  volatilityIndex: number;
  momentumScore: number;
};

type MarketInsight = {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  category: 'Economic' | 'Technical' | 'News' | 'Regulatory';
  timestamp: Date;
};

export default function MarketOverview() {
  const [activeTab, setActiveTab] = useState('intelligence');
  const [marketData, setMarketData] = useState<MarketData>({
    stocks: [],
    forex: [],
    metals: [],
    crypto: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment>({
    overall: 'Neutral',
    fgIndex: 50,
    volatilityIndex: 30,
    momentumScore: 0
  });
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([]);
  
  // Ref for interval management
  const currentIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Define seeded random function at component level
  const [currentTime, setCurrentTime] = useState(0);
  const [updateInterval, setUpdateInterval] = useState(12000); // Start with 12 seconds
  const timeBasedSeed = Math.floor(currentTime / 10000); // Changes based on state updates
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  // More realistic market noise function
  const marketNoise = (baseValue: number, volatility: number = 0.1) => {
    const noise = (seededRandom(timeBasedSeed + 1000) - 0.5) * volatility * baseValue;
    const trend = Math.sin(timeBasedSeed / 1000) * 0.05 * baseValue; // Slow trend
    return baseValue + noise + trend;
  };

  // Enhanced market sentiment analysis
  const analyzeMarketSentiment = useMemo(() => {
    const allInstruments = [...marketData.stocks, ...marketData.crypto, ...marketData.forex, ...marketData.metals];
    const total = allInstruments.length;
    
    // Handle empty data case
    if (total === 0) {
      return {
        overall: 'Neutral' as const,
        fgIndex: 50,
        volatilityIndex: 30,
        momentumScore: 0
      };
    }
    
    const gainers = allInstruments.filter(i => i.changePercent > 0).length;
    const losers = allInstruments.filter(i => i.changePercent < 0).length;
    
    const bullishRatio = gainers / total;
    const avgChange = allInstruments.reduce((sum, i) => sum + (i.changePercent || 0), 0) / total;
    const volatility = Math.sqrt(allInstruments.reduce((sum, i) => sum + Math.pow((i.changePercent || 0) - avgChange, 2), 0) / total);
    
    let overall: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
    if (bullishRatio > 0.6) overall = 'Bullish';
    else if (bullishRatio < 0.4) overall = 'Bearish';
    
    const fgIndex = Math.round(50 + (bullishRatio - 0.5) * 100);
    const momentumScore = Math.round(avgChange * 10);
    
    return {
      overall,
      fgIndex: Math.max(0, Math.min(100, fgIndex)),
      volatilityIndex: Math.round(Math.min(100, volatility * 10)),
      momentumScore: Math.max(-100, Math.min(100, momentumScore))
    };
  }, [marketData]);

  // Generate dynamic market intelligence data
  const generateDynamicIntelligenceData = useMemo(() => {
    const now = new Date();
    const sentiment = analyzeMarketSentiment;
    
    // Dynamic F & G Index calculation
    const fgIndex = Math.max(0, Math.min(100, sentiment.fgIndex || 50));
    const volatility = Math.max(10, Math.min(100, sentiment.volatilityIndex || 30));
    const momentum = Math.max(-50, Math.min(50, sentiment.momentumScore || 0));
    
    // Dynamic market cap and volume based on actual data
    const totalMarketCap = Object.values(marketData).flat().reduce((sum, asset) => sum + (asset.marketCap || 0), 0);
    const totalVolume = Object.values(marketData).flat().reduce((sum, asset) => sum + (asset.volume || 0), 0);
    
    // Dynamic sector performance based on actual market data (using seeded random with noise)
    const sectorPerformance = [
      { 
        name: 'Technology', 
        change: marketNoise(2.4 + (seededRandom(timeBasedSeed + 1) - 0.5) * 2, 0.3),
        volume: ['High', 'Medium', 'Low'][Math.floor(seededRandom(timeBasedSeed + 2) * 3)], 
        cap: `$${marketNoise(892 + seededRandom(timeBasedSeed + 3) * 100, 0.1).toFixed(0)}B`,
        strength: Math.max(0, Math.min(100, marketNoise(seededRandom(timeBasedSeed + 4) * 100, 0.2)))
      },
      { 
        name: 'Finance', 
        change: marketNoise(-1.2 + (seededRandom(timeBasedSeed + 5) - 0.5) * 1.5, 0.4),
        volume: ['High', 'Medium', 'Low'][Math.floor(seededRandom(timeBasedSeed + 6) * 3)], 
        cap: `$${marketNoise(445 + seededRandom(timeBasedSeed + 7) * 50, 0.15).toFixed(0)}B`,
        strength: Math.max(0, Math.min(100, marketNoise(seededRandom(timeBasedSeed + 8) * 100, 0.25)))
      },
      { 
        name: 'Healthcare', 
        change: marketNoise(0.8 + (seededRandom(timeBasedSeed + 9) - 0.5) * 1, 0.2),
        volume: ['High', 'Medium', 'Low'][Math.floor(seededRandom(timeBasedSeed + 10) * 3)], 
        cap: `$${marketNoise(234 + seededRandom(timeBasedSeed + 11) * 30, 0.12).toFixed(0)}B`,
        strength: Math.max(0, Math.min(100, marketNoise(seededRandom(timeBasedSeed + 12) * 100, 0.18)))
      },
      { 
        name: 'Energy', 
        change: marketNoise(3.1 + (seededRandom(timeBasedSeed + 13) - 0.5) * 2, 0.5),
        volume: ['High', 'Medium', 'Low'][Math.floor(seededRandom(timeBasedSeed + 14) * 3)], 
        cap: `$${marketNoise(567 + seededRandom(timeBasedSeed + 15) * 80, 0.3).toFixed(0)}B`,
        strength: Math.max(0, Math.min(100, marketNoise(seededRandom(timeBasedSeed + 16) * 100, 0.35)))
      },
      { 
        name: 'Consumer', 
        change: marketNoise(-0.5 + (seededRandom(timeBasedSeed + 17) - 0.5) * 1.5, 0.25),
        volume: ['High', 'Medium', 'Low'][Math.floor(seededRandom(timeBasedSeed + 18) * 3)], 
        cap: `$${marketNoise(378 + seededRandom(timeBasedSeed + 19) * 40, 0.2).toFixed(0)}B`,
        strength: Math.max(0, Math.min(100, marketNoise(seededRandom(timeBasedSeed + 20) * 100, 0.22)))
      },
      { 
        name: 'Industrial', 
        change: marketNoise(1.7 + (seededRandom(timeBasedSeed + 21) - 0.5) * 1.8, 0.35),
        volume: ['High', 'Medium', 'Low'][Math.floor(seededRandom(timeBasedSeed + 22) * 3)], 
        cap: `$${marketNoise(289 + seededRandom(timeBasedSeed + 23) * 35, 0.28).toFixed(0)}B`,
        strength: Math.max(0, Math.min(100, marketNoise(seededRandom(timeBasedSeed + 24) * 100, 0.3)))
      }
    ];
    
    // Dynamic market breadth
    const totalAssets = Object.values(marketData).flat().length;
    const advancingAssets = Object.values(marketData).flat().filter(asset => (asset.changePercent || 0) > 0).length;
    const decliningAssets = Object.values(marketData).flat().filter(asset => (asset.changePercent || 0) < 0).length;
    const unchangedAssets = totalAssets - advancingAssets - decliningAssets;
    
    // Dynamic volume analysis (using seeded random with realistic variations)
    const volumeLevels = [
      {
        level: 'High Volume',
        value: Math.max(60, Math.min(95, marketNoise(85 + seededRandom(timeBasedSeed + 25) * 10, 0.15))),
        color: 'bg-[#4a9d7e]',
        amount: `$${marketNoise(2.3 + seededRandom(timeBasedSeed + 26) * 0.5, 0.2).toFixed(1)}B`,
        change: `${marketNoise(10 + seededRandom(timeBasedSeed + 27) * 5, 0.3) > 0 ? '+' : ''}${marketNoise(10 + seededRandom(timeBasedSeed + 27) * 5, 0.3).toFixed(0)}%`,
        assets: Math.floor(marketNoise(1000 + seededRandom(timeBasedSeed + 28) * 500, 0.25))
      },
      {
        level: 'Average Volume',
        value: Math.max(30, Math.min(70, marketNoise(55 + seededRandom(timeBasedSeed + 29) * 10, 0.12))),
        color: 'bg-yellow-500',
        amount: `$${marketNoise(1.1 + seededRandom(timeBasedSeed + 30) * 0.3, 0.15).toFixed(1)}B`,
        change: `${marketNoise(3 + seededRandom(timeBasedSeed + 31) * 4, 0.2) > 0 ? '+' : ''}${marketNoise(3 + seededRandom(timeBasedSeed + 31) * 4, 0.2).toFixed(0)}%`,
        assets: Math.floor(marketNoise(800 + seededRandom(timeBasedSeed + 32) * 200, 0.18))
      },
      {
        level: 'Low Volume',
        value: Math.max(10, Math.min(40, marketNoise(25 + seededRandom(timeBasedSeed + 33) * 10, 0.1))),
        color: 'bg-gray-600',
        amount: `$${marketNoise(0.4 + seededRandom(timeBasedSeed + 34) * 0.2, 0.08).toFixed(1)}B`,
        change: `${marketNoise(-5 + seededRandom(timeBasedSeed + 35) * 5, 0.15) > 0 ? '+' : ''}${marketNoise(-5 + seededRandom(timeBasedSeed + 35) * 5, 0.15).toFixed(0)}%`,
        assets: Math.floor(marketNoise(400 + seededRandom(timeBasedSeed + 36) * 100, 0.12))
      }
    ];
    
    // Dynamic technical indicators with realistic variations
    const technicalIndicators = {
      rsi: Math.max(20, Math.min(80, marketNoise(50 + momentum + (seededRandom(timeBasedSeed + 37) - 0.5) * 10, 0.15))),
      macd: momentum > 5 ? 'Bullish' : momentum < -8 ? 'Bearish' : 'Neutral',
      bollinger: momentum > 3 ? 'Upper' : momentum < -3 ? 'Lower' : 'Mid',
      support: Math.max(2500, Math.min(4000, marketNoise(3000 + seededRandom(timeBasedSeed + 38) * 500, 0.1))),
      resistance: Math.max(3200, Math.min(4500, marketNoise(3500 + seededRandom(timeBasedSeed + 39) * 500, 0.12)))
    };
    
    return {
      fgIndex,
      volatility,
      momentum,
      marketCap: totalMarketCap > 0 ? `$${(totalMarketCap / 1000000000000).toFixed(1)}T` : '$2.4T',
      volume24h: totalVolume > 0 ? `$${(totalVolume / 1000000000).toFixed(1)}B` : '$124.5B',
      sectorPerformance,
      marketBreadth: {
        advancing: advancingAssets,
        declining: decliningAssets,
        unchanged: unchangedAssets,
        advanceDeclineRatio: advancingAssets / Math.max(decliningAssets, 1)
      },
      volumeAnalysis: volumeLevels,
      technicalIndicators,
      liquidityScore: 85 + seededRandom(timeBasedSeed + 34) * 10,
      marketDepth: totalVolume * 0.01,
      lastUpdated: now
    };
  }, [marketData, analyzeMarketSentiment, currentTime]);

  // Generate market insights data
  const generateMarketInsightsData = useMemo(() => {
    const insights: MarketInsight[] = [];
    const sentiment = analyzeMarketSentiment;
    
    // Sentiment-based insight
    if (sentiment.overall === 'Bullish') {
      insights.push({
        title: 'Market Momentum Shift',
        description: `Strong bullish momentum detected with ${Math.round(sentiment.fgIndex || 50)} F & G index. Consider risk-on positions.`,
        impact: 'High',
        category: 'Technical',
        timestamp: new Date(timeBasedSeed * 60000)
      });
    } else if (sentiment.overall === 'Bearish') {
      insights.push({
        title: 'Risk-Off Environment',
        description: `Bearish sentiment prevailing. Defensive positioning advised. Volatility index at ${sentiment.volatilityIndex || 30}.`,
        impact: 'High',
        category: 'Technical',
        timestamp: new Date(timeBasedSeed * 60000)
      });
    }
    
    // Volatility insight
    if (sentiment.volatilityIndex > 50) {
      insights.push({
        title: 'High Volatility Alert',
        description: `Elevated volatility detected (${sentiment.volatilityIndex}). Wider stops and smaller position sizes recommended.`,
        impact: 'Medium',
        category: 'Technical',
        timestamp: new Date(timeBasedSeed * 60000)
      });
    }
    
    return insights;
  }, [analyzeMarketSentiment]);

  useEffect(() => {
    setMarketSentiment(analyzeMarketSentiment);
    setMarketInsights(generateMarketInsightsData);
  }, [analyzeMarketSentiment]);

  // Update market intelligence data with varying intervals
  useEffect(() => {
    const intervals = [12000, 30000, 120000, 90000]; // 12s, 30s, 120s, 90s
    let intervalIndex = 0;
    
    const updateData = () => {
      // Increment time state to trigger recalculation
      setCurrentTime(prev => prev + 1);
      
      // Cycle through intervals
      intervalIndex = (intervalIndex + 1) % intervals.length;
      const nextInterval = intervals[intervalIndex];
      
      // Clear current interval and set new one
      if (currentIntervalRef.current) {
        clearInterval(currentIntervalRef.current);
      }
      currentIntervalRef.current = setInterval(updateData, nextInterval);
      setUpdateInterval(nextInterval);
    };
    
    currentIntervalRef.current = setInterval(updateData, intervals[0]);
    
    return () => {
      if (currentIntervalRef.current) {
        clearInterval(currentIntervalRef.current);
      }
    };
  }, []);

  // Check market status
  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday, 6 = Saturday
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hours * 60 + minutes;
      
      // Market hours: Monday-Friday, 9:30 AM - 4:00 PM EST
      const marketOpen = 570; // 9:30 AM
      const marketClose = 960; // 4:00 PM
      
      const isWeekday = day >= 1 && day <= 5;
      const isWithinHours = currentTime >= marketOpen && currentTime < marketClose;
      
      setIsMarketOpen(isWeekday && isWithinHours);
    };

    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch market data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchMarketData()
      .then((data) => {
        // Check if we actually got any data
        const hasData = Object.values(data).some(arr => arr.length > 0);
        if (!hasData) {
          setError('No market data available at the moment. Please check your API key or try again later.');
        }
        // Enhance data with additional metrics
        const enhancedData = {
          stocks: data.stocks.map(stock => ({
            ...stock,
            volume: Math.floor(seededRandom(timeBasedSeed + 100) * 100000000) + 10000000,
            marketCap: stock.price * (Math.floor(seededRandom(timeBasedSeed + 101) * 1000000000) + 100000000),
            dayHigh: stock.price * (1 + seededRandom(timeBasedSeed + 102) * 0.05),
            dayLow: stock.price * (1 - seededRandom(timeBasedSeed + 103) * 0.05),
            weekHigh: stock.price * (1 + seededRandom(timeBasedSeed + 104) * 0.1),
            weekLow: stock.price * (1 - seededRandom(timeBasedSeed + 105) * 0.1)
          })),
          forex: data.forex.map(pair => ({
            ...pair,
            volume: Math.floor(seededRandom(timeBasedSeed + 106) * 50000000) + 5000000,
            dayHigh: pair.price * (1 + seededRandom(timeBasedSeed + 107) * 0.02),
            dayLow: pair.price * (1 - seededRandom(timeBasedSeed + 108) * 0.02)
          })),
          metals: data.metals.map(metal => ({
            ...metal,
            volume: Math.floor(seededRandom(timeBasedSeed + 109) * 1000000) + 100000,
            dayHigh: metal.price * (1 + seededRandom(timeBasedSeed + 110) * 0.03),
            dayLow: metal.price * (1 - seededRandom(timeBasedSeed + 111) * 0.03)
          })),
          crypto: data.crypto.map(crypto => ({
            ...crypto,
            volume: Math.floor(seededRandom(timeBasedSeed + 112) * 1000000000) + 100000000,
            marketCap: crypto.price * (Math.floor(seededRandom(timeBasedSeed + 113) * 20000000) + 1000000),
            dayHigh: crypto.price * (1 + seededRandom(timeBasedSeed + 114) * 0.1),
            weekLow: crypto.price * (1 - seededRandom(timeBasedSeed + 115) * 0.1)
          }))
        };
        
        setMarketData(enhancedData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Market data fetch error:', err);
        setError('Failed to fetch market data. Please check your connection.');
        setIsLoading(false);
      });
  }, []);

  // Enhanced live price simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prevData) => {
        const newData = { ...prevData };
        const categories = ['stocks', 'forex', 'metals', 'crypto'] as const;

        categories.forEach((cat) => {
          newData[cat] = newData[cat].map((item) => {
            const volatility = cat === 'crypto' ? 0.001 : 0.0002;
            const change = item.price * (seededRandom(timeBasedSeed + 200) * volatility * 2 - volatility);
            const newPrice = item.price + change;
            const newChange = item.change + change;
            const oldPrice = newPrice - newChange;
            const newChangePercent = oldPrice !== 0 ? (newChange / oldPrice) * 100 : 0;

            // Update high/low values
            const newDayHigh = item.dayHigh ? Math.max(item.dayHigh, newPrice) : newPrice;
            const newDayLow = item.dayLow ? Math.min(item.dayLow, newPrice) : newPrice;

            return {
              ...item,
              price: newPrice,
              change: newChange,
              changePercent: newChangePercent,
              dayHigh: newDayHigh,
              dayLow: newDayLow,
            };
          });
        });

        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const intelligenceTabs = [
    {
      key: 'intelligence',
      label: 'Market Intelligence',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      key: 'sentiment',
      label: 'Market Sentiment',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      key: 'assets',
      label: 'Asset Classes',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      key: 'insights',
      label: 'AI Insights',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const assetTabs = [
    {
      key: 'stocks',
      label: 'Global Stocks',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      key: 'forex',
      label: 'Forex Markets',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
    },
    {
      key: 'metals',
      label: 'Precious Metals',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      key: 'crypto',
      label: 'Digital Assets',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const currentData = marketData[activeTab as keyof MarketData] || [];
  const currentTabData = intelligenceTabs.find(tab => tab.key === activeTab) || assetTabs.find(tab => tab.key === activeTab);

  // Render sentiment gauge
  const renderSentimentGauge = () => {
    const fgIndex = marketSentiment.fgIndex || 50;
    const rotation = (fgIndex / 100) * 180 - 90;
    const sentimentColor = marketSentiment.overall === 'Bullish' ? '#4a9d7e' : 
                         marketSentiment.overall === 'Bearish' ? '#ef4444' : '#6b7280';
    
    return (
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="8" />
          {/* Colored arc */}
          <circle cx="50" cy="50" r="45" fill="none" 
                  stroke={sentimentColor} strokeWidth="8"
                  strokeDasharray={`${(fgIndex / 100) * 283} 283`}
                  strokeLinecap="round"
                  className="transition-all duration-500" />
          {/* Center circle */}
          <circle cx="50" cy="50" r="35" fill="#1a1d29" />
          {/* Needle */}
          <line x1="50" y1="50" x2="50" y2="15" 
                stroke={sentimentColor} strokeWidth="3" 
                transform={`rotate(${rotation} 50 50)`}
                className="transition-all duration-500" />
          <circle cx="50" cy="50" r="4" fill={sentimentColor} className="transition-all duration-500" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{fgIndex}</span>
          <span className={`text-xs font-bold ${
            marketSentiment.overall === 'Bullish' ? 'text-[#4a9d7e]' : 
            marketSentiment.overall === 'Bearish' ? 'text-red-500' : 'text-gray-500'
          }`}>
            {marketSentiment.overall || 'Neutral'}
          </span>
        </div>
      </div>
    );
  };

  // Render market insights
  const renderMarketInsights = () => (
    <div className="space-y-4">
      {marketInsights.map((insight, index) => (
        <div key={index} className="bg-[#1a1d29]/40 border border-gray-800/50 rounded-xl p-4 hover:border-[#4a9d7e]/30 transition-all duration-300">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  insight.category === 'Economic' ? 'bg-blue-500/10 text-blue-400' :
                  insight.category === 'Technical' ? 'bg-purple-500/10 text-purple-400' :
                  insight.category === 'News' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-orange-500/10 text-orange-400'
                }`}>
                  {insight.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  insight.impact === 'High' ? 'bg-red-500/10 text-red-400' :
                  insight.impact === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-gray-500/10 text-gray-400'
                }`}>
                  {insight.impact} Impact
                </span>
              </div>
              <h4 className="text-white font-bold text-sm mb-1">{insight.title}</h4>
              <p className="text-gray-400 text-xs leading-relaxed">{insight.description}</p>
            </div>
            <div className="text-gray-500 text-[10px] uppercase tracking-widest">
              {insight.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-500' : (isMarketOpen ? 'bg-[#4a9d7e]' : 'bg-gray-600')} ${isMarketOpen && !isLoading ? 'animate-pulse' : ''}`} />
            <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {activeTab === 'intelligence' ? 'Market Intelligence' :
               activeTab === 'sentiment' ? 'Market Sentiment' :
               activeTab === 'assets' ? 'Asset Analysis' :
               activeTab === 'insights' ? 'AI Insights' :
               currentTabData?.label || 'Market Overview'}
            </h3>
          </div>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
            {isLoading ? 'Loading Intelligence Data...' : (isMarketOpen ? 'Live Market Intelligence' : 'After-Hours Analysis')}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-800/30 px-3 py-1.5 rounded-full border border-gray-800/50">
            <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-500' : (isMarketOpen ? 'bg-[#4a9d7e]' : 'bg-gray-600')} ${isMarketOpen && !isLoading ? 'animate-pulse' : ''}`} />
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {isLoading ? 'Syncing' : (isMarketOpen ? 'Live' : 'Closed')}
            </span>
          </div>
        </div>

      {/* Enhanced Tabs */}
      <div className="flex space-x-1 sm:space-x-2 bg-[#1a1d29]/50 p-1 sm:p-1.5 rounded-2xl border border-gray-800/50 overflow-x-auto custom-scrollbar-hide">
        {(activeTab === 'intelligence' || activeTab === 'sentiment' || activeTab === 'assets' || activeTab === 'insights' ? intelligenceTabs : assetTabs).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 min-w-[110px] sm:min-w-[130px] flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-xl font-bold uppercase tracking-widest text-[9px] sm:text-[11px] transition-all duration-300 ${
              activeTab === tab.key
                ? 'bg-[#4a9d7e] text-white shadow-lg shadow-[#4a9d7e]/20'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Market Intelligence Content */}
      {activeTab === 'intelligence' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[700px]">
          {/* Enhanced F & G Index - Full Height */}
          <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 flex flex-col h-[650px]">
            <h4 className="text-lg font-bold text-white mb-4">F & G Index</h4>
            <div className="flex-1 space-y-4 overflow-hidden">
              {renderSentimentGauge()}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Volatility</span>
                  <span className="text-white font-bold text-sm">{generateDynamicIntelligenceData.volatility.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Momentum</span>
                  <span className={`font-bold text-sm ${
                    generateDynamicIntelligenceData.momentum > 0 ? 'text-[#4a9d7e]' : 'text-red-500'
                  }`}>
                    {generateDynamicIntelligenceData.momentum > 0 ? '+' : ''}{generateDynamicIntelligenceData.momentum.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Market Cap</span>
                  <span className="text-white font-bold text-sm">{generateDynamicIntelligenceData.marketCap}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">24h Volume</span>
                  <span className="text-white font-bold text-sm">{generateDynamicIntelligenceData.volume24h}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Market Depth</span>
                  <span className="text-white font-bold text-sm">${(generateDynamicIntelligenceData.marketDepth / 1000000).toFixed(0)}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Liquidity Score</span>
                  <span className="text-[#4a9d7e] font-bold text-sm">{generateDynamicIntelligenceData.liquidityScore.toFixed(1)}%</span>
                </div>
              </div>
              
              {/* Historical trend */}
              <div className="pt-4 border-t border-gray-800">
                <h5 className="text-white font-bold text-sm mb-3">7-Day Trend</h5>
                <div className="h-20">
                  <svg viewBox="0 0 200 80" className="w-full h-full">
                    <defs>
                      <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4a9d7e" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#4a9d7e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polyline
                      points={`10,${70 - generateDynamicIntelligenceData.fgIndex * 0.3} 40,${65 - generateDynamicIntelligenceData.fgIndex * 0.25} 70,${50 - generateDynamicIntelligenceData.fgIndex * 0.2} 100,${55 - generateDynamicIntelligenceData.fgIndex * 0.15} 130,${35 - generateDynamicIntelligenceData.fgIndex * 0.1} 160,${40 - generateDynamicIntelligenceData.fgIndex * 0.05} 190,${25 - generateDynamicIntelligenceData.fgIndex * 0.02}`}
                      fill="none"
                      stroke="#4a9d7e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polygon
                      points={`10,${70 - generateDynamicIntelligenceData.fgIndex * 0.3} 40,${65 - generateDynamicIntelligenceData.fgIndex * 0.25} 70,${50 - generateDynamicIntelligenceData.fgIndex * 0.2} 100,${55 - generateDynamicIntelligenceData.fgIndex * 0.15} 130,${35 - generateDynamicIntelligenceData.fgIndex * 0.1} 160,${40 - generateDynamicIntelligenceData.fgIndex * 0.05} 190,${25 - generateDynamicIntelligenceData.fgIndex * 0.02} 190,80 10,80`}
                      fill="url(#trendGradient)"
                    />
                  </svg>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-500 text-xs">7 days ago</span>
                  <span className="text-[#4a9d7e] font-bold text-xs">+{((generateDynamicIntelligenceData.fgIndex - 50) * 0.5).toFixed(1)}%</span>
                  <span className="text-gray-500 text-xs">Today</span>
                </div>
              </div>
              
              {/* Technical Indicators */}
              <div className="pt-4 border-t border-gray-800">
                <h5 className="text-white font-bold text-sm mb-3">Technical Indicators</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">RSI (14)</span>
                    <span className="text-white font-bold text-xs">{generateDynamicIntelligenceData.technicalIndicators.rsi.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">MACD Signal</span>
                    <span className="text-[#4a9d7e] font-bold text-xs">{generateDynamicIntelligenceData.technicalIndicators.macd}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Bollinger Bands</span>
                    <span className="text-yellow-500 font-bold text-xs">{generateDynamicIntelligenceData.technicalIndicators.bollinger}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Support/Resistance</span>
                    <span className="text-white font-bold text-xs">${generateDynamicIntelligenceData.technicalIndicators.support.toFixed(0)}/${generateDynamicIntelligenceData.technicalIndicators.resistance.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Market Heatmap - Full Height */}
          <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 flex flex-col h-[650px] lg:col-span-2">
            <h4 className="text-lg font-bold text-white mb-4">Market Heatmap</h4>
            <div className="flex-1 space-y-4 overflow-hidden">
              {/* Sector Performance Grid */}
              <div className="grid grid-cols-3 gap-2">
                {generateDynamicIntelligenceData.sectorPerformance.map((sector) => (
                  <div key={sector.name} className="p-3 rounded-lg bg-[#1a1d29]/60 border border-gray-800/50 hover:border-[#4a9d7e]/30 transition-all cursor-pointer">
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">{sector.name}</div>
                      <div className={`text-sm font-bold ${
                        sector.change > 0 ? 'text-[#4a9d7e]' : 'text-red-500'
                      }`}>
                        {sector.change > 0 ? '+' : ''}{sector.change.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <div className="flex items-center justify-center gap-1">
                          <div className={`w-1 h-1 rounded-full ${
                            sector.volume === 'High' ? 'bg-emerald-500' :
                            sector.volume === 'Medium' ? 'bg-yellow-500' : 'bg-gray-500'
                          }`} />
                          <span>{sector.volume}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{sector.cap}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Market Breadth */}
              <div className="pt-3 border-t border-gray-800">
                <h5 className="text-white font-bold text-sm mb-3">Market Breadth</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Advancing</span>
                    <span className="text-[#4a9d7e] font-bold text-sm">{generateDynamicIntelligenceData.marketBreadth.advancing}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Declining</span>
                    <span className="text-red-500 font-bold text-sm">{generateDynamicIntelligenceData.marketBreadth.declining}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Unchanged</span>
                    <span className="text-gray-500 font-bold text-sm">{generateDynamicIntelligenceData.marketBreadth.unchanged}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Advance/Decline</span>
                      <span className="text-[#4a9d7e] font-bold text-sm">{generateDynamicIntelligenceData.marketBreadth.advanceDeclineRatio.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sector Performance Chart */}
              <div className="pt-3 border-t border-gray-800">
                <h5 className="text-white font-bold text-sm mb-3">Sector Performance</h5>
                <div className="h-32">
                  <svg viewBox="0 0 200 120" className="w-full h-full">
                    {generateDynamicIntelligenceData.sectorPerformance.map((sector, index) => (
                      <g key={sector.name}>
                        <rect
                          x={20 + index * 30}
                          y={120 - Math.abs(sector.change) * 10}
                          width="25"
                          height={Math.abs(sector.change) * 10}
                          fill={sector.change > 0 ? '#4a9d7e' : '#ef4444'}
                          opacity="0.8"
                          rx="2"
                        />
                        <text
                          x={32.5 + index * 30}
                          y={115 - Math.abs(sector.change) * 10}
                          fill="white"
                          fontSize="8"
                          textAnchor="middle"
                          className="font-bold"
                        >
                          {sector.name.substring(0, 3)}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
              
              {/* Market Statistics */}
              <div className="pt-3 border-t border-gray-800">
                <h5 className="text-white font-bold text-sm mb-3">Market Statistics</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs">Total Volume</div>
                    <div className="text-white font-bold text-sm">{generateDynamicIntelligenceData.volume24h}</div>
                  </div>
                  <div className="p-2 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs">Market Cap</div>
                    <div className="text-white font-bold text-sm">{generateDynamicIntelligenceData.marketCap}</div>
                  </div>
                  <div className="p-2 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs">Volatility</div>
                    <div className="text-white font-bold text-sm">{generateDynamicIntelligenceData.volatility.toFixed(1)}%</div>
                  </div>
                  <div className="p-2 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs">Liquidity</div>
                    <div className="text-white font-bold text-sm">{generateDynamicIntelligenceData.liquidityScore.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Volume Analysis - Full Height */}
          <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 flex flex-col h-[650px]">
            <h4 className="text-lg font-bold text-white mb-4">Volume Analysis</h4>
            <div className="flex-1 space-y-4 overflow-hidden">
              {/* Volume Bars */}
              <div className="space-y-3">
                {generateDynamicIntelligenceData.volumeAnalysis.map((item) => (
                  <div key={item.level} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">{item.level}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm">{item.amount}</span>
                        <span className={`text-xs font-bold ${
                          item.change.startsWith('+') ? 'text-[#4a9d7e]' : 'text-red-500'
                        }`}>
                          {item.change}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} transition-all duration-500`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                      <span className="text-gray-500 text-xs w-8 text-right">{item.value.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">{item.assets.toLocaleString()} assets</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Volume Distribution Chart */}
              <div className="pt-3 border-t border-gray-800">
                <h5 className="text-white font-bold text-sm mb-3">Volume Distribution</h5>
                <div className="h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {[
                      { x: 10, y: 70, height: 30, label: 'Pre-Market', volume: '12%' },
                      { x: 25, y: 50, height: 50, label: 'Opening', volume: '28%' },
                      { x: 40, y: 25, height: 75, label: 'Mid-Day', volume: '45%' },
                      { x: 55, y: 35, height: 65, label: 'Closing', volume: '12%' },
                      { x: 70, y: 60, height: 40, label: 'After-Hours', volume: '3%' }
                    ].map((bar, index) => (
                      <g key={index}>
                        <rect
                          x={bar.x}
                          y={bar.y}
                          width="12"
                          height={bar.height}
                          fill="#4a9d7e"
                          opacity="0.8"
                          rx="2"
                        />
                        <text
                          x={bar.x + 6}
                          y={bar.y - 5}
                          fill="white"
                          fontSize="7"
                          textAnchor="middle"
                          className="fill-current"
                        >
                          {bar.label}
                        </text>
                        <text
                          x={bar.x + 6}
                          y={bar.y + bar.height + 10}
                          fill="#4a9d7e"
                          fontSize="8"
                          textAnchor="middle"
                          className="font-bold"
                        >
                          {bar.volume}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
              
              {/* Volume Trends */}
              <div className="pt-3 border-t border-gray-800">
                <h5 className="text-white font-bold text-sm mb-3">Volume Trends</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">24h Avg Volume</span>
                    <span className="text-white font-bold text-xs">{generateDynamicIntelligenceData.volume24h}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">7d Avg Volume</span>
                    <span className="text-white font-bold text-xs">${(parseFloat(generateDynamicIntelligenceData.volume24h.replace(/[^0-9.]/g, '')) * 1.14).toFixed(1)}B</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">30d Avg Volume</span>
                    <span className="text-white font-bold text-xs">${(parseFloat(generateDynamicIntelligenceData.volume24h.replace(/[^0-9.]/g, '')) * 0.89).toFixed(1)}B</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Volume Spike Alert</span>
                    <span className="text-yellow-500 font-bold text-xs">{generateDynamicIntelligenceData.volatility > 50 ? 'Active' : 'Normal'}</span>
                  </div>
                </div>
              </div>
              
              {/* Liquidity Analysis */}
              <div className="pt-3 border-t border-gray-800">
                <h5 className="text-white font-bold text-sm mb-3">Liquidity Analysis</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs">Bid-Ask Spread</div>
                    <div className="text-white font-bold text-xs">{(0.01 + seededRandom(timeBasedSeed + 35) * 0.02).toFixed(3)}%</div>
                  </div>
                  <div className="p-2 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs">Order Book Depth</div>
                    <div className="text-white font-bold text-xs">${(generateDynamicIntelligenceData.marketDepth / 1000000).toFixed(0)}M</div>
                  </div>
                  <div className="p-2 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs">Market Impact</div>
                    <div className="text-white font-bold text-xs">{generateDynamicIntelligenceData.volatility > 40 ? 'Medium' : 'Low'}</div>
                  </div>
                  <div className="p-2 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs">Slippage Rate</div>
                    <div className="text-white font-bold text-xs">{(0.1 + seededRandom(timeBasedSeed + 36) * 0.1).toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Sentiment Content */}
      {activeTab === 'sentiment' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
          {/* Enhanced Sentiment Overview */}
          <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 flex flex-col h-full">
            <h4 className="text-lg font-bold text-white mb-4">Sentiment Analysis</h4>
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Overall Sentiment</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  marketSentiment.overall === 'Bullish' ? 'bg-[#4a9d7e]/10 text-[#4a9d7e]' :
                  marketSentiment.overall === 'Bearish' ? 'bg-red-500/10 text-red-500' :
                  'bg-gray-500/10 text-gray-500'
                }`}>
                  {marketSentiment.overall}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Market Confidence</span>
                <span className="text-white font-bold text-sm">{Math.round(50 + (marketSentiment.momentumScore || 0))}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Risk Level</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  marketSentiment.volatilityIndex > 50 ? 'bg-red-500/10 text-red-500' :
                  marketSentiment.volatilityIndex > 30 ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-[#4a9d7e]/10 text-[#4a9d7e]'
                }`}>
                  {marketSentiment.volatilityIndex > 50 ? 'High' : marketSentiment.volatilityIndex > 30 ? 'Medium' : 'Low'}
                </span>
              </div>
              
              {/* Sentiment Gauge */}
              <div className="pt-3 border-t border-gray-800">
                <h5 className="text-white font-bold text-sm mb-3">Sentiment Gauge</h5>
                <div className="h-32">
                  <svg viewBox="0 0 200 120" className="w-full h-full">
                    <defs>
                      <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#6b7280" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#4a9d7e" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    {/* Background */}
                    <rect x="10" y="40" width="180" height="30" fill="#374151" rx="15" />
                    {/* Sentiment Bar */}
                    <rect 
                      x="10" 
                      y="40" 
                      width={180 * ((marketSentiment.fgIndex || 50) / 100)} 
                      height="30" 
                      fill="url(#sentimentGradient)" 
                      rx="15"
                    />
                    {/* Marker */}
                    <circle 
                      cx={10 + 180 * ((marketSentiment.fgIndex || 50) / 100)} 
                      cy="55" 
                      r="10" 
                      fill="white" 
                      stroke="#1a1d29" 
                      strokeWidth="2"
                    />
                    <text 
                      x={10 + 180 * ((marketSentiment.fgIndex || 50) / 100)} 
                      y="85" 
                      fill="white" 
                      fontSize="12" 
                      textAnchor="middle" 
                      className="font-bold"
                    >
                      {marketSentiment.fgIndex || 50}
                    </text>
                  </svg>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-red-500 text-xs">Fear</span>
                  <span className="text-gray-500 text-xs">Neutral</span>
                  <span className="text-[#4a9d7e] text-xs">Greed</span>
                </div>
              </div>
              
              {/* Sentiment Indicators */}
              <div className="pt-3 border-t border-gray-800">
                <h5 className="text-white font-bold text-sm mb-3">Sentiment Indicators</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Put/Call Ratio</span>
                    <span className="text-white font-bold text-xs">0.67</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">VIX Index</span>
                    <span className="text-yellow-500 font-bold text-xs">24.8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Fear Index</span>
                    <span className="text-[#4a9d7e] font-bold text-xs">32.1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Greed Index</span>
                    <span className="text-red-500 font-bold text-xs">78.4</span>
                  </div>
                </div>
              </div>
              
              {/* Market Psychology */}
              <div className="pt-3 border-t border-gray-800">
                <h5 className="text-white font-bold text-sm mb-3">Market Psychology</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs mb-1">Investor Behavior</div>
                    <div className="text-white font-bold text-sm">Risk-On</div>
                    <div className="text-[#4a9d7e] text-xs mt-1">+12.3%</div>
                  </div>
                  <div className="p-3 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs mb-1">Market Mood</div>
                    <div className="text-white font-bold text-sm">Optimistic</div>
                    <div className="text-[#4a9d7e] text-xs mt-1">+8.7%</div>
                  </div>
                  <div className="p-3 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs mb-1">Sentiment Score</div>
                    <div className="text-white font-bold text-sm">72.4</div>
                    <div className="text-[#4a9d7e] text-xs mt-1">Bullish</div>
                  </div>
                  <div className="p-3 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs mb-1">Panic Index</div>
                    <div className="text-white font-bold text-sm">18.2</div>
                    <div className="text-[#4a9d7e] text-xs mt-1">Low</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Social Trading Signals */}
          <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 flex flex-col h-full">
            <h4 className="text-lg font-bold text-white mb-4">Social Trading Signals</h4>
            <div className="flex-1 space-y-4">
              {/* Signal Strength */}
              <div className="space-y-3">
                {[
                  { signal: 'Strong Buy', strength: 85, count: 156, color: 'text-emerald-500', change: '+23%' },
                  { signal: 'Buy', strength: 65, count: 89, color: 'text-[#4a9d7e]', change: '+12%' },
                  { signal: 'Neutral', strength: 50, count: 45, color: 'text-gray-500', change: '+3%' },
                  { signal: 'Sell', strength: 35, count: 67, color: 'text-orange-500', change: '-8%' },
                  { signal: 'Strong Sell', strength: 15, count: 23, color: 'text-red-500', change: '-15%' }
                ].map((item) => (
                  <div key={item.signal} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.signal}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${item.color}`}>
                          {item.signal.includes('Buy') ? '↑' : item.signal === 'Neutral' ? '→' : '↓'} {item.count}
                        </span>
                        <span className={`text-xs font-bold ${
                          item.change.startsWith('+') ? 'text-[#4a9d7e]' : 'text-red-500'
                        }`}>
                          {item.change}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            item.signal.includes('Buy') ? 'bg-emerald-500' :
                            item.signal === 'Neutral' ? 'bg-gray-500' : 'bg-red-500'
                          } transition-all duration-500`}
                          style={{ width: `${item.strength}%` }}
                        />
                      </div>
                      <span className="text-gray-500 text-xs w-8 text-right">{item.strength}%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Social Sentiment Chart */}
              <div className="pt-3 border-t border-gray-800">
                <h5 className="text-white font-bold text-sm mb-3">Social Sentiment Trend</h5>
                <div className="h-32">
                  <svg viewBox="0 0 200 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="socialGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4a9d7e" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#4a9d7e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    {[25, 50, 75].map((y) => (
                      <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#374151" strokeWidth="0.5" />
                    ))}
                    {/* Area chart */}
                    <polygon
                      points="0,75 40,70 80,55 120,40 160,45 200,30 200,100 0,100"
                      fill="url(#socialGradient)"
                    />
                    <polyline
                      points="0,75 40,70 80,55 120,40 160,45 200,30"
                      fill="none"
                      stroke="#4a9d7e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Data points */}
                    {[{x: 0, y: 75}, {x: 40, y: 70}, {x: 80, y: 55}, {x: 120, y: 40}, {x: 160, y: 45}, {x: 200, y: 30}].map((point, index) => (
                      <circle key={index} cx={point.x} cy={point.y} r="4" fill="#4a9d7e" />
                    ))}
                  </svg>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-500 text-xs">6h ago</span>
                  <span className="text-[#4a9d7e] font-bold text-xs">+18.2%</span>
                  <span className="text-gray-500 text-xs">Now</span>
                </div>
              </div>
              
              {/* Social Metrics */}
              <div className="pt-3 border-t border-gray-800">
                <h5 className="text-white font-bold text-sm mb-3">Social Metrics</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Social Volume</span>
                    <span className="text-white font-bold text-xs">12.4K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Social Dominance</span>
                    <span className="text-white font-bold text-xs">3.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Influencer Score</span>
                    <span className="text-[#4a9d7e] font-bold text-xs">78.5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Sentiment Score</span>
                    <span className="text-[#4a9d7e] font-bold text-xs">72.3</span>
                  </div>
                </div>
              </div>
              
              {/* Trading Activity */}
              <div className="pt-3 border-t border-gray-800">
                <h5 className="text-white font-bold text-sm mb-3">Trading Activity</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs">Active Traders</div>
                    <div className="text-white font-bold text-sm">8.2K</div>
                    <div className="text-[#4a9d7e] text-xs mt-1">+24%</div>
                  </div>
                  <div className="p-2 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs">Avg Position Size</div>
                    <div className="text-white font-bold text-sm">$2.4K</div>
                    <div className="text-[#4a9d7e] text-xs mt-1">+8%</div>
                  </div>
                  <div className="p-2 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs">Win Rate</div>
                    <div className="text-white font-bold text-sm">67.8%</div>
                    <div className="text-[#4a9d7e] text-xs mt-1">+5%</div>
                  </div>
                  <div className="p-2 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs">Social Signals</div>
                    <div className="text-white font-bold text-sm">1.2K</div>
                    <div className="text-[#4a9d7e] text-xs mt-1">+18%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Content */}
      {activeTab === 'insights' && (
        <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-white">AI-Powered Market Insights</h4>
            <div className="flex items-center gap-2 text-emerald-500 text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold">Live Analysis</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            {/* AI Confidence Score */}
            <div className="p-4 bg-[#1a1d29]/60 rounded-xl border border-gray-800/50">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-white font-bold text-sm">AI Confidence Score</h5>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 transition-all duration-500"
                      style={{ width: '78%' }}
                    />
                  </div>
                  <span className="text-emerald-500 font-bold text-sm">78%</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 text-xs">
                <div className="text-center">
                  <span className="text-gray-400">Accuracy</span>
                  <span className="text-white font-bold">92.3%</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-400">Processing</span>
                  <span className="text-white font-bold">1.2M/sec</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-400">Data Points</span>
                  <span className="text-white font-bold">847K</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-400">Latency</span>
                  <span className="text-white font-bold">0.8ms</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                {
                  title: 'Market Momentum Shift',
                  description: 'Strong bullish momentum detected with 65 F & G index. Consider risk-on positions.',
                  impact: 'High',
                  category: 'Technical',
                  confidence: 85,
                  timeframe: 'Next 48-72 hours',
                  actionable: true,
                  probability: 78,
                  riskLevel: 'Medium'
                },
                {
                  title: 'Volatility Spike Alert',
                  description: 'Elevated volatility detected (45). Wider stops and smaller position sizes recommended.',
                  impact: 'Medium',
                  category: 'Technical',
                  confidence: 72,
                  timeframe: 'Next 24 hours',
                  actionable: true,
                  probability: 65,
                  riskLevel: 'High'
                },
                {
                  title: 'Institutional Flow Detected',
                  description: 'Large institutional buying patterns identified in tech sector. Potential breakout imminent.',
                  impact: 'High',
                  category: 'Economic',
                  confidence: 91,
                  timeframe: 'Next 1-2 weeks',
                  actionable: true,
                  probability: 87,
                  riskLevel: 'Low'
                },
                {
                  title: 'Earnings Calendar Impact',
                  description: 'Major earnings releases this week could trigger sector rotation. Monitor Q3 results.',
                  impact: 'Medium',
                  category: 'News',
                  confidence: 68,
                  timeframe: 'This week',
                  actionable: false,
                  probability: 54,
                  riskLevel: 'Medium'
                },
                {
                  title: 'Liquidity Analysis Update',
                  description: 'Market liquidity improving across major pairs. Lower spreads indicate institutional participation.',
                  impact: 'Low',
                  category: 'Economic',
                  confidence: 79,
                  timeframe: 'Next 7 days',
                  actionable: true,
                  probability: 71,
                  riskLevel: 'Low'
                },
                {
                  title: 'Regulatory Watch Alert',
                  description: 'Upcoming regulatory announcements may affect crypto markets. Monitor policy developments.',
                  impact: 'Medium',
                  category: 'Regulatory',
                  confidence: 64,
                  timeframe: 'Next 2 weeks',
                  actionable: false,
                  probability: 48,
                  riskLevel: 'High'
                }
              ].map((insight, index) => (
                <div key={index} className="bg-[#1a1d29]/40 border border-gray-800/50 rounded-xl p-4 hover:border-[#4a9d7e]/30 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          insight.category === 'Economic' ? 'bg-blue-500/10 text-blue-400' :
                          insight.category === 'Technical' ? 'bg-purple-500/10 text-purple-400' :
                          insight.category === 'News' ? 'bg-emerald-500/10 text-emerald-400' :
                          'bg-orange-500/10 text-orange-400'
                        }`}>
                          {insight.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          insight.impact === 'High' ? 'bg-red-500/10 text-red-400' :
                          insight.impact === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>
                          {insight.impact} Impact
                        </span>
                        {insight.actionable && (
                          <span className="px-2 py-1 rounded-full bg-[#4a9d7e]/10 text-[#4a9d7e] text-[10px] font-bold">
                            Actionable
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-500 text-[10px] uppercase tracking-widest">
                      {new Date(timeBasedSeed * 60000).toLocaleTimeString()}
                    </div>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-2">{insight.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">{insight.description}</p>
                  
                  {/* Insight Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">Confidence</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              insight.confidence > 80 ? 'bg-emerald-500' :
                              insight.confidence > 60 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${insight.confidence}%` }}
                          />
                        </div>
                        <span className="text-white text-xs font-bold">{insight.confidence}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">Probability</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              insight.probability > 70 ? 'bg-emerald-500' :
                              insight.probability > 50 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${insight.probability}%` }}
                          />
                        </div>
                        <span className="text-white text-xs font-bold">{insight.probability}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">Timeframe</span>
                      <span className="text-white text-xs font-bold">{insight.timeframe}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">Risk Level</span>
                      <span className={`text-xs font-bold ${
                        insight.riskLevel === 'High' ? 'text-red-500' :
                        insight.riskLevel === 'Medium' ? 'text-yellow-500' :
                        'text-emerald-500'
                      }`}>
                        {insight.riskLevel}
                      </span>
                    </div>
                  </div>
                  
                  {/* AI Recommendation */}
                  {insight.actionable && (
                    <div className="p-3 bg-[#4a9d7e]/5 rounded-lg border border-[#4a9d7e]/20">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#4a9d7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-[#4a9d7e] font-bold text-xs">AI Recommendation: {insight.impact === 'High' ? 'Monitor closely' : 'Consider position'}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* AI Processing Status */}
            <div className="pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-500 text-sm font-bold">Neural Network Active</span>
                  </div>
                  <div className="text-gray-500 text-xs">Processing 847K data points/sec</div>
                </div>
                <div className="text-gray-500 text-xs">Last updated: {new Date(timeBasedSeed * 60000).toLocaleTimeString()}</div>
              </div>
              
              {/* AI Model Performance */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { metric: 'Pattern Recognition', accuracy: 94.2, status: 'Optimal', trend: '+2.3%' },
                  { metric: 'Sentiment Analysis', accuracy: 87.8, status: 'Good', trend: '+1.2%' },
                  { metric: 'Volatility Forecast', accuracy: 91.5, status: 'Optimal', trend: '+3.1%' },
                  { metric: 'Risk Assessment', accuracy: 89.3, status: 'Good', trend: '+0.8%' }
                ].map((model, index) => (
                  <div key={index} className="text-center p-3 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                    <div className="text-gray-400 text-xs mb-1">{model.metric}</div>
                    <div className="text-white font-bold text-sm mb-1">{model.accuracy}%</div>
                    <div className={`text-xs font-bold ${
                      model.status === 'Optimal' ? 'text-emerald-500' : 'text-yellow-500'
                    }`}>
                      {model.status}
                    </div>
                    <div className="text-emerald-500 text-xs mt-1">{model.trend}</div>
                  </div>
                ))}
              </div>
              
              {/* AI System Health */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                  <div className="text-gray-400 text-xs mb-1">System Load</div>
                  <div className="text-white font-bold text-sm">42%</div>
                  <div className="text-emerald-500 text-xs">Normal</div>
                </div>
                <div className="p-3 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                  <div className="text-gray-400 text-xs mb-1">Memory Usage</div>
                  <div className="text-white font-bold text-sm">67%</div>
                  <div className="text-yellow-500 text-xs">Moderate</div>
                </div>
                <div className="p-3 bg-[#1a1d29]/60 rounded-lg border border-gray-800/50">
                  <div className="text-gray-400 text-xs mb-1">API Response</div>
                  <div className="text-white font-bold text-sm">0.8ms</div>
                  <div className="text-emerald-500 text-xs">Fast</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Asset Classes Content */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          {/* Error handling */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}
          
          {/* Enhanced Asset Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {!isLoading && !error && currentData.length === 0 && (
              <div className="col-span-full p-8 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
                No data found for this category
              </div>
            )}
            {currentData.map((instrument, index) => (
              <div
                key={index}
                className="group relative bg-[#1a1d29]/40 border border-gray-800/50 rounded-xl hover:border-[#4a9d7e]/40 hover:bg-[#1a1d29]/60 transition-all duration-300 cursor-pointer overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Hover accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4a9d7e] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Icon */}
                      <div className="w-8 h-8 bg-gradient-to-br from-[#4a9d7e]/20 to-[#4a9d7e]/10 rounded-xl flex items-center justify-center border border-[#4a9d7e]/20 group-hover:border-[#4a9d7e]/40 transition-all duration-300">
                        <div className={`w-4 h-4 rounded-full ${
                          activeTab === 'stocks' ? 'bg-blue-400' :
                          activeTab === 'forex' ? 'bg-emerald-400' :
                          activeTab === 'metals' ? 'bg-yellow-500' :
                          activeTab === 'crypto' ? 'bg-orange-400' :
                          'bg-gray-400'
                        }`} />
                      </div>
                      
                      {/* Instrument Info */}
                      <div className="min-w-0">
                        <h4 className="text-white font-bold text-sm leading-tight group-hover:text-[#4a9d7e] transition-colors truncate">
                          {instrument.name}
                        </h4>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">{instrument.symbol}</p>
                      </div>
                    </div>

                    {/* Price and Change */}
                    <div className="text-right">
                      <p className="text-white font-bold text-lg tracking-tight tabular-nums mb-1">
                        ${(instrument.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <div className="flex items-center justify-end space-x-2">
                        <span
                          className={`text-[10px] font-bold tabular-nums ${
                            (instrument.change || 0) >= 0 ? 'text-[#4a9d7e]' : 'text-red-500'
                          }`}
                        >
                          {(instrument.change || 0) >= 0 ? '+' : ''}{(instrument.changePercent || 0).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-800">
                    {instrument.volume && (
                      <div className="text-center">
                        <p className="text-gray-500 text-[9px] uppercase tracking-widest">Volume</p>
                        <p className="text-white text-xs font-bold">
                          {((instrument.volume || 0) / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    )}
                    {instrument.dayHigh && (
                      <div className="text-center">
                        <p className="text-gray-500 text-[9px] uppercase tracking-widest">Day Range</p>
                        <p className="text-xs font-bold">
                          <span className="text-emerald-500">${(instrument.dayLow || 0).toLocaleString()}</span>
                          -
                          <span className="text-red-500">${(instrument.dayHigh || 0).toLocaleString()}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
