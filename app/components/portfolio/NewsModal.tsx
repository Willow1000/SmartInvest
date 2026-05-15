'use client';

export default function NewsModal() {
  // Auth modals hidden - no modal to display
  return null;

  // Enhanced content with more detailed analysis
  const defaultContent = [
    "Our advanced market intelligence systems have detected significant movement in this sector. Institutional flows indicate a strategic shift as major players rebalance their portfolios in response to the latest developments.",
    "The current market environment presents unique opportunities for sophisticated investors utilizing high-frequency data and AI-driven analysis. Key technical indicators suggest we're at a critical inflection point that could determine the medium-term trend.",
    "Risk management remains paramount in this environment. We recommend position sizing that accounts for potential volatility spikes and maintaining liquidity levels that allow for rapid deployment of capital when opportunities arise.",
    "For full access to real-time depth-of-market data, sentiment analysis, and predictive modeling related to this event, please ensure your account is upgraded to the Institutional tier."
  ];

  const content = selectedNews.content || defaultContent;

  return (
    <>
      {/* Main Modal Container */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={closeNews}
      >
        {/* Modal Content Panel - prevents click from closing when clicking inside */}
        <div 
          className="relative w-full max-w-sm mx-4 bg-[#0a0c10] border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-slide-in-right"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-4 border-b border-gray-800/50 flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <span className="text-[#4a9d7e] text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-1 bg-[#4a9d7e]/10 rounded-md border border-[#4a9d7e]/20 flex-shrink-0">
                {selectedNews.category}
              </span>
              <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest flex-shrink-0">
                {selectedNews.timestamp}
              </span>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={closeNews}
              className="text-gray-500 hover:text-white transition-colors p-1.5 bg-gray-800/50 rounded-lg flex-shrink-0"
              title="Close news panel"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {/* Title */}
            <h2 className="text-lg font-bold text-white leading-tight tracking-tight mb-3">
              {selectedNews.title}
            </h2>

            {/* Excerpt */}
            <div className="mb-4">
              <p className="text-gray-300 leading-relaxed text-sm">
                {selectedNews.excerpt}
              </p>
            </div>

            {/* Full Content */}
            <div className="space-y-3">
              {content.map((paragraph, index) => (
                <p key={index} className="text-gray-400 leading-relaxed text-xs">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-4 p-3 bg-[#1a1d29]/40 rounded-xl border border-gray-800/50">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4a9d7e] animate-pulse" />
                <span className="text-[#4a9d7e] text-[9px] font-bold uppercase tracking-widest">Market Intelligence</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                This analysis is based on real-time institutional data feeds and advanced AI-driven sentiment analysis.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-800/50">
            <div className="flex gap-2">
              <button 
                onClick={closeNews}
                className="flex-1 bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-2.5 rounded-lg transition-all duration-300 uppercase tracking-widest text-[10px]"
              >
                Close
              </button>
              <button className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 text-white font-bold py-2.5 rounded-lg transition-all duration-300 uppercase tracking-widest text-[10px]">
                Share
              </button>
            </div>
          </div>

          {/* Drag Handle (optional visual indicator) */}
          <div className="absolute top-0 left-0 w-1 h-full bg-[#4a9d7e]/30 hover:bg-[#4a9d7e]/50 transition-colors cursor-ew-resize" />
        </div>
      </div>

      {/* Add custom animation for slide-in effect */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1d29;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a9d7e;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3d8567;
        }
      `}</style>
    </>
  );
}