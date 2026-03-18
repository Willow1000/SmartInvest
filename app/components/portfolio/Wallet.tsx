'use client';

import { useModal } from '../auth/ModalContext';

export default function Wallet() {
    const { balance, openDeposit, openWithdraw } = useModal();

    const cryptoBalance = balance * 0.75;
    const fiatBalance = balance * 0.25;

    return (
        <section id="wallet" className="min-h-[85vh] flex flex-col justify-center scroll-mt-24">
            <div className="mb-12">
                <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">My Wallet</h2>
                <p className="text-gray-400 text-lg">Manage your fiat and crypto assets, execute transfers, and view balances.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Total Balance Card */}
                <div className="lg:col-span-1 bg-gradient-to-br from-[#4a9d7e]/20 to-[#252836] backdrop-blur-xl border border-[#4a9d7e]/30 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="absolute -right-20 -top-20 w-48 h-48 bg-[#4a9d7e]/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#4a9d7e]/30 transition-all duration-500" />

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <p className="text-[#4a9d7e] font-bold text-xs uppercase tracking-[0.2em] mb-4">Total Wallet Balance</p>
                            <h3 className="text-5xl font-extrabold text-white tracking-tighter mb-2">
                                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </h3>
                            <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#4a9d7e] animate-pulse" />
                                Available for trading
                            </p>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button onClick={openDeposit} className="flex-1 py-3 bg-[#4a9d7e] hover:bg-[#3d8567] text-white rounded-xl font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(74,157,126,0.3)]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
                                Deposit
                            </button>
                            <button onClick={openWithdraw} className="flex-1 py-3 bg-[#1a1d29] hover:bg-[#252836] text-white border border-gray-700/50 rounded-xl font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                Withdraw
                            </button>
                        </div>
                    </div>
                </div>

                {/* Asset Breakdown */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Crypto Wallet */}
                    <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 hover:border-[#4a9d7e]/40 transition-colors group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-purple-500/10 group-hover:bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">Cryptocurrency</h4>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Digital Assets</p>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mb-6">${cryptoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <div className="space-y-3">
                            {[
                                { name: 'Bitcoin', symbol: 'BTC', amount: '0.45', value: cryptoBalance * 0.6 },
                                { name: 'Ethereum', symbol: 'ETH', amount: '4.2', value: cryptoBalance * 0.3 },
                                { name: 'Solana', symbol: 'SOL', amount: '125', value: cryptoBalance * 0.1 },
                            ].map(asset => (
                                <div key={asset.symbol} className="flex items-center justify-between p-3 bg-[#1a1d29]/40 rounded-xl border border-gray-800/50">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400">{asset.symbol}</span>
                                        <span className="text-sm font-bold text-white">{asset.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-white">{asset.amount} {asset.symbol}</p>
                                        <p className="text-[10px] text-gray-500 font-bold">${asset.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fiat Wallet */}
                    <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 hover:border-blue-500/40 transition-colors group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-500/10 group-hover:bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">Fiat Currency</h4>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Cash Reserves</p>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mb-6">${fiatBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <div className="space-y-3">
                            {[
                                { name: 'US Dollar', symbol: 'USD', amount: fiatBalance * 0.8 },
                                { name: 'Euro', symbol: 'EUR', amount: fiatBalance * 0.15 },
                                { name: 'British Pound', symbol: 'GBP', amount: fiatBalance * 0.05 },
                            ].map(asset => (
                                <div key={asset.symbol} className="flex items-center justify-between p-3 bg-[#1a1d29]/40 rounded-xl border border-gray-800/50">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400">{asset.symbol}</span>
                                        <span className="text-sm font-bold text-white">{asset.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-white">${asset.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
