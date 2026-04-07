
'use client';

import { useEffect, useState } from 'react';
import { useModal, NewsInsight } from '../auth/ModalContext';
import { fetchNewsData } from '../../lib/newsData';

export default function MarketInsightsFeed() {
  const { openNews } = useModal();
  const [news, setNews] = useState<NewsInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      try {
        const data = await fetchNewsData();
        // Convert NewsItem to NewsInsight
        const formattedNews: NewsInsight[] = data.map(item => ({
          ...item,
          content: [
            item.excerpt,
            "Our proprietary analysis indicates that this development will have a significant impact on market liquidity and institutional positioning over the next 48-72 hours.",
            "Sophisticated investors should monitor key support and resistance levels closely. For real-time depth-of-market data and AI-driven sentiment analysis, ensure your account is verified for the Intelligence Terminal."
          ]
        }));
        setNews(formattedNews);
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadNews();
  }, []);

  const categories = ['All', 'Stocks', 'Crypto', 'Forex', 'Metals'];
  
  const filteredNews = activeCategory === 'All' 
    ? news 
    : news.filter(item => item.category === activeCategory);

  return (
    <div id="market-insights" className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 lg:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#4a9d7e] animate-pulse" />
            <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Market Intelligence</h3>
          </div>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Real-time Terminal Feed</p>
        </div>
        <div className="flex space-x-1 bg-[#1a1d29]/50 p-1 rounded-xl border border-gray-800/50 overflow-x-auto custom-scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#4a9d7e] text-white shadow-lg shadow-[#4a9d7e]/20'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed Height News Container */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-8 h-8 border-2 border-[#4a9d7e] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Syncing Intelligence Feed...</p>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-3">
              {filteredNews.map((insight, index) => (
                <div
                  key={insight.id}
                  onClick={() => openNews(insight)}
                  className="group relative bg-[#1a1d29]/40 border border-gray-800/50 rounded-2xl hover:border-[#4a9d7e]/40 hover:bg-[#1a1d29]/60 transition-all duration-300 cursor-pointer overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Hover accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4a9d7e] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                  
                  <div className="p-4 lg:p-5">
                    <div className="flex items-start gap-4">
                      {/* Category icon */}
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#4a9d7e]/20 to-[#4a9d7e]/10 rounded-xl flex items-center justify-center border border-[#4a9d7e]/20 group-hover:border-[#4a9d7e]/40 transition-all duration-300">
                        <div className="w-5 h-5 text-[#4a9d7e]">
                          {insight.category === 'Stocks' && (
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                            </svg>
                          )}
                          {insight.category === 'Crypto' && (
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd"/>
                            </svg>
                          )}
                          {insight.category === 'Forex' && (
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                          )}
                          {insight.category === 'Metals' && (
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07-3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783.57-1.838-.197-1.539 1.118l1.07 3.292c.3.921.755 1.688 1.54 1.118l2.8-2.034a1 1 0 00.364-1.118L9.049 2.927z"/>
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Meta row */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#4a9d7e]/10 border border-[#4a9d7e]/20">
                              <span className="text-[#4a9d7e] text-[10px] font-bold uppercase tracking-[0.15em]">
                                {insight.category}
                              </span>
                            </span>
                            <span className="text-gray-600 text-[10px] font-medium uppercase tracking-widest">
                              {insight.timestamp}
                            </span>
                          </div>
                        </div>
                        
                        {/* Title */}
                        <h4 className="text-white font-semibold text-sm lg:text-base leading-tight mb-2 group-hover:text-[#4a9d7e] transition-colors line-clamp-2">
                          {insight.title}
                        </h4>
                        
                        {/* Excerpt */}
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
                          {insight.excerpt}
                        </p>
                        
                        {/* Action indicator */}
                        <div className="flex items-center gap-2 text-[#4a9d7e] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-[10px] font-bold uppercase tracking-widest">Read Analysis</span>
                          <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">No insights found for this category.</p>
          </div>
        )}
      </div>

      {/* Fixed Action Button */}
      <div className="mt-6">
        <button className="w-full group flex items-center justify-center space-x-2 bg-gradient-to-r from-[#4a9d7e] to-[#3d8567] hover:from-[#3d8567] hover:to-[#4a9d7e] text-white px-4 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all duration-300 shadow-lg shadow-[#4a9d7e]/10 hover:shadow-[#4a9d7e]/20">
          <span>Access Full Terminal</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
