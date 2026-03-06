
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
    <div id="market-insights" className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 h-full flex flex-col hover:border-[#4a9d7e]/20 transition-all duration-500 scroll-mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Market Insights</h3>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mt-1">Intelligence Terminal</p>
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

      <div className="flex-1 space-y-4 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-8 h-8 border-2 border-[#4a9d7e] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Syncing Intelligence Feed...</p>
          </div>
        ) : filteredNews.length > 0 ? (
          filteredNews.map((insight) => (
            <div
              key={insight.id}
              onClick={() => openNews(insight)}
              className="p-5 bg-[#1a1d29]/40 border border-gray-800/50 rounded-2xl hover:border-[#4a9d7e]/40 hover:bg-[#1a1d29]/60 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-800/50 rounded-xl flex items-center justify-center border border-gray-700/50 group-hover:border-[#4a9d7e]/30 group-hover:text-[#4a9d7e] transition-all duration-300 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v4a2 2 0 002 2h4" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h5M7 12h10M7 16h10" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#4a9d7e] text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 bg-[#4a9d7e]/10 rounded-md">
                      {insight.category}
                    </span>
                    <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">{insight.timestamp}</span>
                  </div>
                  <p className="text-white font-bold text-sm tracking-tight leading-snug group-hover:text-[#4a9d7e] transition-colors line-clamp-2">
                    {insight.title}
                  </p>
                  <p className="text-gray-500 text-[11px] mt-2 line-clamp-2 leading-relaxed">
                    {insight.excerpt}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">No insights found for this category.</p>
          </div>
        )}
      </div>

      <button className="w-full mt-8 group flex items-center justify-center space-x-2 bg-[#4a9d7e] hover:bg-[#3d8567] text-white px-4 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all duration-300 shadow-lg shadow-[#4a9d7e]/10">
        <span>Access Full Terminal</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  );
}
