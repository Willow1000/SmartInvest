'use client';

import { useModal } from '../auth/ModalContext';

export default function NewsModal() {
  const { isNewsOpen, selectedNews, closeNews } = useModal();

  if (!isNewsOpen || !selectedNews) return null;

  // Fallback content if none is provided
  const defaultContent = [
    "Our advanced market intelligence systems have detected significant movement in this sector. Institutional flows indicate a strategic shift as major players rebalance their portfolios in response to the latest developments.",
    "The current market environment presents unique opportunities for sophisticated investors utilizing high-frequency data and AI-driven analysis. We recommend close monitoring of key resistance levels and liquidity zones identified in the terminal.",
    "For full access to real-time depth-of-market data, sentiment analysis, and predictive modeling related to this event, please ensure your account is upgraded to the Institutional tier."
  ];

  const content = selectedNews.content || defaultContent;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop with heavy blur */}
      <div 
        className="fixed inset-0 bg-[#1a1d29]/80 backdrop-blur-xl animate-fade-in"
        onClick={closeNews}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#252836] border border-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up">
        {/* Close Button */}
        <button 
          onClick={closeNews}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20 p-2 bg-gray-800/50 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 md:p-12 relative">
          {/* Background Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4a9d7e]/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            {/* Header Info */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-[#4a9d7e] text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-[#4a9d7e]/10 rounded-lg border border-[#4a9d7e]/20">
                {selectedNews.category}
              </span>
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                {selectedNews.timestamp}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
              {selectedNews.title}
            </h2>

            {/* Content Icon & Metadata */}
            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-800/50">
              <div className="w-12 h-12 bg-[#4a9d7e]/10 rounded-2xl flex items-center justify-center border border-[#4a9d7e]/20 text-[#4a9d7e]">
                {selectedNews.icon}
              </div>
              <div>
                <p className="text-white font-bold text-sm">Intelligence Terminal</p>
                <p className="text-gray-500 text-xs">Verified Institutional Insight</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed mb-6 font-medium">
                {selectedNews.excerpt}
              </p>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                {content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={closeNews}
                className="flex-1 bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-[#4a9d7e]/20 uppercase tracking-widest text-xs"
              >
                Return to Dashboard
              </button>
              <button className="flex-1 bg-transparent border border-gray-700 hover:border-[#4a9d7e]/50 text-white font-bold py-4 rounded-2xl transition-all duration-300 uppercase tracking-widest text-xs">
                Share Insight
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
