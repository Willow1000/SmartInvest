'use client';

import { useState } from 'react';
import { useModal } from '../auth/ModalContext';

export default function DepositModal() {
  const { isDepositOpen, closeDeposit, addTransaction } = useModal();
  const [depositAmount, setDepositAmount] = useState('');

  if (!isDepositOpen) return null;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    addTransaction(amount, 'deposit');
    alert(`Deposit of $${amount.toLocaleString()} initiated! Our financial team will process this shortly.`);
    setDepositAmount('');
    closeDeposit();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#1a1d29]/80 backdrop-blur-xl animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0"
        onClick={closeDeposit}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#252836] border border-gray-800 rounded-[2rem] shadow-2xl overflow-hidden animate-scale-up">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4a9d7e]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="p-8 md:p-10 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">Deposit Funds</h3>
            <button 
              onClick={closeDeposit}
              className="text-gray-500 hover:text-white transition-colors p-2 bg-gray-800/50 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleDeposit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1 block">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                <input
                  required
                  autoFocus
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl pl-8 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50 transition-all text-lg font-bold"
                />
              </div>
            </div>

            <div className="bg-[#4a9d7e]/5 border border-[#4a9d7e]/20 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Processing Fee</span>
                <span className="text-[#4a9d7e] font-bold">0.00%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Estimated Arrival</span>
                <span className="text-white font-bold">Instant</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-[#4a9d7e]/20 uppercase tracking-widest text-xs"
              >
                Confirm Deposit
              </button>
              <button
                type="button"
                onClick={closeDeposit}
                className="w-full bg-transparent border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white font-bold py-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-xs"
              >
                Cancel
              </button>
            </div>
          </form>

          <p className="mt-6 text-[10px] text-gray-500 text-center leading-relaxed">
            By confirming this deposit, you agree to our Terms of Service and recognize that all financial transactions are subject to institutional verification.
          </p>
        </div>
      </div>
    </div>
  );
}
