'use client';

import { useState } from 'react';

export default function TradingAutomations() {
    const [activeBot, setActiveBot] = useState<string | null>('grid');

    const bots = [
        { id: 'grid', name: 'Grid Trading', apy: '12.4%', risk: 'Low', description: 'Automatically buy low and sell high within a set price range.' },
        { id: 'dca', name: 'DCA Bot', apy: '8.2%', risk: 'Low', description: 'Dollar Cost Averaging to mitigate volatility over time.' },
        { id: 'arbitrage', name: 'Arbitrage', apy: '18.7%', risk: 'Medium', description: 'Exploit price differences across multiple exchanges.' },
        { id: 'momentum', name: 'Momentum', apy: '24.5%', risk: 'High', description: 'Follows strong market trends using advanced indicators.' },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Trading <span className="text-[#4a9d7e]">Automations</span></h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">Select a standard algorithmic trading bot or build your custom algorithm to trade on your behalf 24/7.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Available Bots */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6">Standard Algorithms</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {bots.map(bot => (
                            <button
                                key={bot.id}
                                onClick={() => setActiveBot(bot.id)}
                                className={`text-left p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group ${activeBot === bot.id
                                        ? 'bg-[#4a9d7e]/10 border-[#4a9d7e] shadow-[0_0_30px_rgba(74,157,126,0.1)]'
                                        : 'bg-[#252836]/40 border-gray-800/50 hover:border-[#4a9d7e]/50 text-left cursor-pointer appearance-none'
                                    }`}
                            >
                                {activeBot === bot.id && (
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#4a9d7e]/20 rounded-full blur-[40px] pointer-events-none" />
                                )}
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-xl font-bold text-white group-hover:text-[#4a9d7e] transition-colors">{bot.name}</h4>
                                    <span className="text-[#4a9d7e] font-bold text-sm bg-[#4a9d7e]/10 px-3 py-1 rounded-full">{bot.apy} APY</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{bot.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${bot.risk === 'Low' ? 'text-emerald-500' : bot.risk === 'Medium' ? 'text-yellow-500' : 'text-rose-500'}`}>
                                        {bot.risk} Risk
                                    </span>
                                    <div className={`w-4 h-4 rounded-full border-2 ${activeBot === bot.id ? 'border-[#4a9d7e] bg-[#4a9d7e]' : 'border-gray-600 bg-transparent'} transition-colors flex items-center justify-center`}>
                                        {activeBot === bot.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Algorithm / Configuration */}
                <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 flex flex-col relative overflow-hidden">
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#4a9d7e]/5 rounded-full blur-[60px] pointer-events-none" />

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <h3 className="text-2xl font-bold text-white">Algorithm Configuration</h3>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            System Online
                        </span>
                    </div>

                    <div className="flex-1 space-y-6 relative z-10">
                        {/* Asset Pairs */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target Assets</label>
                            <div className="flex flex-wrap gap-2">
                                {['BTC/USD', 'ETH/USD', 'SOL/USD', 'Forex Majors'].map(pair => (
                                    <button key={pair} className="px-4 py-2 bg-[#1a1d29]/60 border border-gray-700/50 rounded-xl text-sm text-gray-300 hover:text-white hover:border-[#4a9d7e]/50 transition-colors">
                                        {pair}
                                    </button>
                                ))}
                                <button className="px-4 py-2 bg-[#4a9d7e]/10 border border-[#4a9d7e]/30 rounded-xl text-sm text-[#4a9d7e] font-bold hover:bg-[#4a9d7e]/20 transition-colors">
                                    + Add Custom
                                </button>
                            </div>
                        </div>

                        {/* Risk Slider */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Risk Tolerance</label>
                                <span className="text-white font-bold text-sm">Balanced (50%)</span>
                            </div>
                            <input type="range" min="0" max="100" defaultValue="50" className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#4a9d7e]" />
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
                                    <input type="text" defaultValue="5.0" className="w-full bg-[#1a1d29]/60 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e] transition-colors" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Take Profit</label>
                                <div className="relative">
                                    <input type="text" defaultValue="12.0" className="w-full bg-[#1a1d29]/60 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e] transition-colors" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-8 py-4 bg-gradient-to-r from-[#4a9d7e] to-[#6bc99e] text-white rounded-xl font-bold uppercase tracking-widest text-[11px] hover:shadow-[0_0_30px_rgba(74,157,126,0.3)] transition-all duration-300 relative z-10">
                        Deploy Algorithm
                    </button>
                </div>
            </div>
        </div>
    );
}
