'use client';

import { useState } from 'react';
import { useModal } from '../auth/ModalContext';

type WithdrawMethod = 'bank' | 'wire' | 'crypto' | 'paypal';

interface WithdrawMethodInfo {
  id: WithdrawMethod;
  name: string;
  icon: React.ReactNode;
  fees: string;
  timing: string;
  minAmount: number;
  maxAmount: number;
  available: boolean;
}

export default function WithdrawModal() {
  const { isWithdrawOpen, closeWithdraw, addTransaction, balance } = useModal();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<WithdrawMethod>('bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: amount, 2: method, 3: confirm

  if (!isWithdrawOpen) return null;

  const withdrawMethods: WithdrawMethodInfo[] = [
    {
      id: 'bank',
      name: 'Bank Transfer (ACH)',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      fees: '0.0%',
      timing: '2-4 days',
      minAmount: 100,
      maxAmount: 50000,
      available: true
    },
    {
      id: 'wire',
      name: 'Wire Transfer',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      fees: '0.5%',
      timing: '1-3 days',
      minAmount: 1000,
      maxAmount: 1000000,
      available: true
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      fees: '1.0%',
      timing: '15-30 min',
      minAmount: 50,
      maxAmount: balance,
      available: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 2.419c.103-.594.688-1.063 1.291-1.063h7.652c2.636 0 4.783 2.145 4.783 4.783 0 2.636-2.147 4.783-4.783 4.783h-3.457l.331 1.91c.103.594-.416 1.063-1.019 1.063z"/>
          <path d="M19.525 10.149H14.84a.641.641 0 00-.633.74l1.107 6.374c.103.594.688 1.063 1.291 1.063h3.457c2.636 0 4.783-2.147 4.783-4.783 0-2.638-2.147-4.785-4.783-4.785z"/>
        </svg>
      ),
      fees: '2.5%',
      timing: 'Instant',
      minAmount: 25,
      maxAmount: 25000,
      available: true
    }
  ];

  const selectedMethodInfo = withdrawMethods.find(m => m.id === selectedMethod);
  const amount = parseFloat(withdrawAmount) || 0;
  const fees = amount * (parseFloat(selectedMethodInfo?.fees || '0') / 100);
  const totalAmount = amount - fees;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (amount < (selectedMethodInfo?.minAmount || 0)) {
        setError(`Minimum withdrawal is $${selectedMethodInfo?.minAmount}`);
        return;
      }
      if (amount > balance) {
        setError(`Insufficient funds. Available balance: $${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
        return;
      }
      if (amount > (selectedMethodInfo?.maxAmount || 0)) {
        setError(`Maximum withdrawal is $${selectedMethodInfo?.maxAmount}`);
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      // Here you would integrate with third-party withdrawal APIs
      setStep(3);
      return;
    }

    // Step 3 - Final confirmation
    setIsProcessing(true);

    // Simulate API integration with withdrawal providers
    try {
      // API calls would go here:
      // - Bank ACH: Plaid, Stripe ACH
      // - Wire: SWIFT integration
      // - Crypto: Coinbase, BitPay
      // - PayPal: PayPal Payouts API
      
      // Call the async addTransaction function
      const success = await addTransaction(amount, 'withdrawal');

      if (success) {
        setWithdrawAmount('');
        setStep(1);
        setIsProcessing(false);
        setTimeout(() => {
          closeWithdraw();
        }, 1000);
      } else {
        setError('Transaction failed. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      setError('Withdrawal processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setWithdrawAmount('');
    setStep(1);
    setError('');
    setIsProcessing(false);
  };

  const handleClose = () => {
    if (!isProcessing) {
      resetModal();
      closeWithdraw();
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#1a1d29]/80 backdrop-blur-xl animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={handleClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-md lg:max-w-lg bg-[#252836] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Progress Steps */}
        <div className="flex items-center justify-center p-6 border-b border-gray-800/50">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step >= stepNum 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-800 text-gray-500'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                    step > stepNum ? 'bg-orange-600' : 'bg-gray-800'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {step === 1 && 'Withdraw Funds'}
                {step === 2 && 'Withdrawal Method'}
                {step === 3 && 'Confirm Withdrawal'}
              </h3>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mt-1">
                {step === 1 && 'Enter amount'}
                {step === 2 && 'Choose withdrawal method'}
                {step === 3 && 'Review and confirm'}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="text-gray-500 hover:text-white transition-colors p-2 bg-gray-800/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-6">
            {/* Step 1: Amount */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1 block">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">$</span>
                    <input
                      required
                      autoFocus
                      type="text"
                      inputMode="decimal"
                      value={withdrawAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                          setWithdrawAmount(val);
                          setError('');
                        }
                      }}
                      placeholder="0.00"
                      disabled={isProcessing}
                      className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl pl-10 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-all text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Balance Display */}
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Available Balance</span>
                    <span className="text-white font-bold text-lg">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex gap-2">
                  {[100, 500, 1000, 5000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setWithdrawAmount(Math.min(amount, balance).toString())}
                      disabled={isProcessing || amount > balance}
                      className="flex-1 bg-gray-800/50 hover:bg-orange-500/20 border border-gray-700 hover:border-orange-500/50 text-gray-400 hover:text-white py-2 rounded-lg transition-all duration-300 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                {/* Max Button */}
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(balance.toString())}
                  disabled={isProcessing || balance < 100}
                  className="w-full bg-gray-800/50 hover:bg-orange-500/20 border border-gray-700 hover:border-orange-500/50 text-gray-400 hover:text-white py-2 rounded-lg transition-all duration-300 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Withdraw Max (${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                </button>
              </>
            )}

            {/* Step 2: Withdrawal Methods */}
            {step === 2 && (
              <div className="space-y-3">
                <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1 block">Select Withdrawal Method</label>
                {withdrawMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    disabled={!method.available || isProcessing}
                    className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                      selectedMethod === method.id
                        ? 'bg-orange-500/10 border-orange-500/50'
                        : 'bg-[#1a1d29]/30 border-gray-800 hover:border-gray-700'
                    } ${!method.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedMethod === method.id
                            ? 'bg-orange-500/20 text-orange-600'
                            : 'bg-gray-800/50 text-gray-500'
                        }`}>
                          {method.icon}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{method.name}</div>
                          <div className="text-gray-500 text-xs">
                            Fee: {method.fees} • {method.timing}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm font-bold">
                          {method.minAmount >= 1000 ? `${method.minAmount/1000}k` : method.minAmount}-{method.maxAmount >= 1000 ? `${method.maxAmount/1000}k` : method.maxAmount}
                        </div>
                        <div className="text-gray-500 text-xs">USD</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-[#1a1d29]/40 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Withdrawal Amount</span>
                    <span className="text-white font-bold text-lg">${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Withdrawal Method</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-orange-500/20 rounded flex items-center justify-center text-orange-600">
                        {selectedMethodInfo?.icon}
                      </div>
                      <span className="text-white text-sm">{selectedMethodInfo?.name}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Processing Fee</span>
                    <span className="text-orange-400 font-bold">${fees.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-gray-800 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm font-semibold">You'll Receive</span>
                      <span className="text-orange-600 font-bold text-xl">${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-orange-600 text-xs leading-relaxed">
                      Withdrawals are processed according to the selected method's timeline. You'll receive a confirmation email once processed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 text-gray-400 hover:text-white font-bold py-3 rounded-xl transition-all duration-300 uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-orange-600/20 uppercase tracking-widest text-xs disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {step === 1 && 'Continue'}
                    {step === 2 && 'Continue'}
                    {step === 3 && `Withdraw $${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-[10px] text-gray-500 text-center leading-relaxed">
            {step === 1 && 'Enter the amount you wish to withdraw from your SmartInvest account.'}
            {step === 2 && 'Choose your preferred withdrawal method. Each method has different fees and processing times.'}
            {step === 3 && 'Review your withdrawal details and confirm to process your request.'}
          </p>
        </div>
      </div>
    </div>
  );
}
