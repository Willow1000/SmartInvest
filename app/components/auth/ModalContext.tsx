'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface NewsInsight {
  id: string | number;
  type: string;
  title: string;
  excerpt: string;
  timestamp: string;
  category: string;
  icon?: ReactNode;
  content?: string[];
  url?: string;
  image?: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  method: string;
}

export interface CurrencyProfit {
  symbol: string;
  name: string;
  investment: number;
  profit: number;
  profitPercent: number;
  projection: number;
}

export interface PerformanceDataPoint {
  date: string;
  value: number;
  profit: number;
}

export interface AnalyticsMetrics {
  sharpeRatio: number;
  alpha: number;
  beta: number;
  volatility: number;
  timeWeightedReturn: number;
  cagr: number;
}

interface ModalContextType {
  // Auth Modals
  isSignupOpen: boolean;
  openSignup: () => void;
  closeSignup: () => void;
  
  // News Modals
  isNewsOpen: boolean;
  selectedNews: NewsInsight | null;
  openNews: (news: NewsInsight) => void;
  closeNews: () => void;

  // Deposit Modal
  isDepositOpen: boolean;
  openDeposit: () => void;
  closeDeposit: () => void;

  // Withdraw Modal
  isWithdrawOpen: boolean;
  openWithdraw: () => void;
  closeWithdraw: () => void;

  // Portfolio Data
  balance: number;
  transactions: Transaction[];
  currencyProfits: CurrencyProfit[];
  performanceHistory: PerformanceDataPoint[];
  analytics: AnalyticsMetrics;
  
  // Transaction Methods
  addTransaction: (amount: number, type: 'deposit' | 'withdrawal') => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsInsight | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // Initial Portfolio State
  const [balance, setBalance] = useState(125430.50);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'tx-1', type: 'deposit', amount: 50000, status: 'completed', timestamp: '2026-02-15 10:30', method: 'Wire Transfer' },
    { id: 'tx-2', type: 'deposit', amount: 25000, status: 'completed', timestamp: '2026-02-28 14:20', method: 'Crypto (BTC)' },
    { id: 'tx-3', type: 'withdrawal', amount: 5000, status: 'completed', timestamp: '2026-03-02 09:15', method: 'Bank Transfer' },
  ]);

  const [currencyProfits] = useState<CurrencyProfit[]>([
    { symbol: 'BTC', name: 'Bitcoin', investment: 45000, profit: 12450.30, profitPercent: 27.6, projection: 18500 },
    { symbol: 'ETH', name: 'Ethereum', investment: 32000, profit: 8240.45, profitPercent: 25.7, projection: 12000 },
    { symbol: 'SOL', name: 'Solana', investment: 15000, profit: 4560.20, profitPercent: 30.4, projection: 7500 },
    { symbol: 'EUR', name: 'EUR/USD', investment: 20000, profit: 2150.15, profitPercent: 10.7, projection: 3500 },
    { symbol: 'XAU', name: 'Gold', investment: 13430.50, profit: 1139.65, profitPercent: 8.5, projection: 2200 },
  ]);

  const performanceHistory: PerformanceDataPoint[] = [
    { date: '2025-03', value: 75000, profit: 0 },
    { date: '2025-04', value: 78500, profit: 3500 },
    { date: '2025-05', value: 82000, profit: 7000 },
    { date: '2025-06', value: 80500, profit: 5500 },
    { date: '2025-07', value: 86000, profit: 11000 },
    { date: '2025-08', value: 91000, profit: 16000 },
    { date: '2025-09', value: 89500, profit: 14500 },
    { date: '2025-10', value: 95000, profit: 20000 },
    { date: '2025-11', value: 102000, profit: 27000 },
    { date: '2025-12', value: 108000, profit: 33000 },
    { date: '2026-01', value: 115000, profit: 40000 },
    { date: '2026-02', value: 125430.50, profit: 50430.50 },
  ];

  const analytics: AnalyticsMetrics = {
    sharpeRatio: 2.84,
    alpha: 0.12,
    beta: 0.85,
    volatility: 14.2,
    timeWeightedReturn: 32.5,
    cagr: 28.4
  };

  const openSignup = () => setIsSignupOpen(true);
  const closeSignup = () => setIsSignupOpen(false);

  const openNews = (news: NewsInsight) => {
    setSelectedNews(news);
    setIsNewsOpen(true);
  };
  const closeNews = () => {
    setIsNewsOpen(false);
    setSelectedNews(null);
  };

  const openDeposit = () => setIsDepositOpen(true);
  const closeDeposit = () => setIsDepositOpen(false);

  const openWithdraw = () => setIsWithdrawOpen(true);
  const closeWithdraw = () => setIsWithdrawOpen(false);

  const addTransaction = useCallback((amount: number, type: 'deposit' | 'withdrawal'): boolean => {
    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid amount:', amount);
      return false;
    }

    // Validate withdrawal
    if (type === 'withdrawal' && amount > balance) {
      console.error('Insufficient funds for withdrawal');
      return false;
    }

    // Create new transaction
    const now = new Date();
    const timestamp = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+)/, '$3-$1-$2 $4:$5');

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type,
      amount,
      status: 'completed',
      timestamp,
      method: type === 'deposit' ? 'Bank Transfer' : 'Instant Withdrawal',
    };

    // Update transactions
    setTransactions(prev => [newTx, ...prev]);

    // Update balance
    if (type === 'deposit') {
      setBalance(prev => prev + amount);
    } else {
      setBalance(prev => prev - amount);
    }

    return true;
  }, [balance]);

  return (
    <ModalContext.Provider 
      value={{ 
        isSignupOpen, openSignup, closeSignup,
        isNewsOpen, selectedNews, openNews, closeNews,
        isDepositOpen, openDeposit, closeDeposit,
        isWithdrawOpen, openWithdraw, closeWithdraw,
        balance, transactions, currencyProfits, performanceHistory, analytics,
        addTransaction
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
