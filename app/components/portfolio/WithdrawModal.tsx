'use client';

import { useState } from 'react';
import { useModal } from '../auth/ModalContext';

export default function WithdrawModal() {
  const { isWithdrawOpen, closeWithdraw, addTransaction, balance } = useModal();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isWithdrawOpen) return null;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (amount > balance) {
      setError(`Insufficient funds. Available balance: $${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const success = addTransaction(amount, 'withdrawal');
      
      if (success) {
        setWithdrawAmount('');
        setIsProcessing(false);
        setTimeout(() => {
          closeWithdraw();
        }, 500);
      } else {
        setError('Transaction failed. Please try again.');
        setIsProcessing(false);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#1a1d29]/80 backdrop-blur-xl animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0"
        onClick={() => !isProcessing && closeWithdraw()}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#252836] border border-gray-800 rounded-[2rem] shadow-2xl overflow-hidden animate-scale-up">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="p-8 md:p-10 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">Withdraw Funds</h3>
            <button 
              onClick={closeWithdraw}
              disabled={isProcessing}
              className="text-gray-500 hover:text-white transition-colors p-2 bg-gray-800/50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-6">
            <div className="space-y-2">
              <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1 block">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                <input
                  required
                  autoFocus
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => {
                    setWithdrawAmount(e.target.value);
                    setError('');
                  }}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max={balance}
                  disabled={isProcessing}
                  className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl pl-8 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-rose-500/50 transition-all text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">{error}</p>
              </div>
            )}

            <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Available Balance</span>
                <span className="text-white font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Processing Fee</span>
                <span className="text-rose-400 font-bold">0.00%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Estimated Arrival</span>
                <span className="text-white font-bold">1-2 Business Days</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-rose-600/20 uppercase tracking-widest text-xs disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Withdrawal'
                )}
              </button>
              <button
                type="button"
                onClick={closeWithdraw}
                disabled={isProcessing}
                className="w-full bg-transparent border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white font-bold py-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>

          <p className="mt-6 text-[10px] text-gray-500 text-center leading-relaxed">
            Withdrawals are processed within 1-2 business days. Funds will be transferred to your registered bank account.
          </p>
        </div>
      </div>
    </div>
  );
}
