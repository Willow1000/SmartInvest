// News data utility - fetches real news from Finnhub API
// API Key: Replace with your actual Finnhub API key
// Returns at most 2 news items per market category

export type NewsItem = {
  id: string;
  type: 'article' | 'news' | 'blog';
  title: string;
  excerpt: string;
  timestamp: string;
  category: string;
  icon?: React.ReactNode;
  url?: string;
  image?: string;
};

export type MarketNews = {
  stocks: NewsItem[];
  crypto: NewsItem[];
  forex: NewsItem[];
  metals: NewsItem[];
};

// Seed data with realistic financial news (fallback)
export const SEED_NEWS_DATA: NewsItem[] = [
  {
    id: '1',
    type: 'article',
    title: 'Tech Stocks Rally on AI Optimism',
    excerpt: 'Major tech companies surge as AI adoption accelerates across industries, with NVIDIA leading gains...',
    timestamp: '2 hours ago',
    category: 'Stocks',
  },
  {
    id: '2',
    type: 'news',
    title: 'Federal Reserve Signals Rate Pause',
    excerpt: 'Fed officials hint at potential pause in interest rate hikes amid cooling inflation concerns...',
    timestamp: '4 hours ago',
    category: 'Stocks',
  },
  {
    id: '3',
    type: 'article',
    title: 'Crypto Market Stabilizes Above $2T',
    excerpt: 'Digital assets show renewed strength amid regulatory clarity and institutional adoption...',
    timestamp: '1 day ago',
    category: 'Crypto',
  },
  {
    id: '4',
    type: 'news',
    title: 'Bitcoin Breaks Resistance Level',
    excerpt: 'BTC surges past $65,000 on institutional buying and positive macro sentiment...',
    timestamp: '1 day ago',
    category: 'Crypto',
  },
  {
    id: '5',
    type: 'article',
    title: 'EUR/USD Reaches 1.09 Level',
    excerpt: 'Euro strengthens against dollar on ECB rate expectations and economic data...',
    timestamp: '2 days ago',
    category: 'Forex',
  },
  {
    id: '6',
    type: 'news',
    title: 'GBP/USD Volatility Increases',
    excerpt: 'British pound fluctuates on UK inflation data and Bank of England commentary...',
    timestamp: '2 days ago',
    category: 'Forex',
  },
  {
    id: '7',
    type: 'article',
    title: 'Oil Prices Hit 6-Month High',
    excerpt: 'Energy sector gains momentum on supply concerns and geopolitical tensions...',
    timestamp: '2 days ago',
    category: 'Metals',
  },
  {
    id: '8',
    type: 'news',
    title: 'Gold Reaches New Record High',
    excerpt: 'Precious metal climbs on safe-haven demand and inflation concerns...',
    timestamp: '3 days ago',
    category: 'Metals',
  },
];

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || 'cqvbkd9r01qjc8lmhd60cqvbkd9r01qjc8lmhd60';

/**
 * Fetch company news from Finnhub
 */
async function fetchCompanyNews(symbol: string, limit: number = 2): Promise<NewsItem[]> {
  try {
    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&limit=${limit}&token=${FINNHUB_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.slice(0, limit).map((item: any, index: number) => ({
      id: `stock-${symbol}-${index}`,
      type: 'article' as const,
      title: item.headline || 'Market News',
      excerpt: item.summary || 'Financial market update',
      timestamp: formatNewsDate(item.datetime),
      category: 'Stocks',
      url: item.url,
      image: item.image,
    }));
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error);
    return [];
  }
}

/**
 * Fetch general market news
 */
async function fetchGeneralNews(category: string, limit: number = 2): Promise<NewsItem[]> {
  try {
    const url = `https://finnhub.io/api/v1/news?category=${category}&limit=${limit}&token=${FINNHUB_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.slice(0, limit).map((item: any, index: number) => ({
      id: `news-${category}-${index}`,
      type: 'news' as const,
      title: item.headline || 'Market News',
      excerpt: item.summary || 'Financial market update',
      timestamp: formatNewsDate(item.datetime),
      category: getCategoryLabel(category),
      url: item.url,
      image: item.image,
    }));
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    return [];
  }
}

/**
 * Map category names to display labels
 */
function getCategoryLabel(category: string): string {
  const categoryMap: Record<string, string> = {
    'forex': 'Forex',
    'crypto': 'Crypto',
    'commodity': 'Metals',
    'general': 'General',
  };
  return categoryMap[category] || category;
}

/**
 * Format timestamp to readable date
 */
export function formatNewsDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Fetch all market news with at most 2 items per category
 */
export async function fetchMarketNews(): Promise<MarketNews> {
  const marketNews: MarketNews = {
    stocks: [],
    crypto: [],
    forex: [],
    metals: [],
  };

  try {
    // Fetch Stock News (2 items max)
    const stockSymbols = ['AAPL', 'MSFT'];
    for (const symbol of stockSymbols) {
      const news = await fetchCompanyNews(symbol, 1);
      marketNews.stocks.push(...news);
      if (marketNews.stocks.length >= 2) break;
    }

    // Fetch Crypto News (2 items max)
    const cryptoNews = await fetchGeneralNews('crypto', 2);
    marketNews.crypto = cryptoNews.slice(0, 2);

    // Fetch Forex News (2 items max)
    const forexNews = await fetchGeneralNews('forex', 2);
    marketNews.forex = forexNews.slice(0, 2);

    // Fetch Metals/Commodities News (2 items max)
    const metalsNews = await fetchGeneralNews('commodity', 2);
    marketNews.metals = metalsNews.slice(0, 2);

    // If any category is empty, use seed data
    if (marketNews.stocks.length === 0) {
      marketNews.stocks = SEED_NEWS_DATA.filter(n => n.category === 'Stocks').slice(0, 2);
    }
    if (marketNews.crypto.length === 0) {
      marketNews.crypto = SEED_NEWS_DATA.filter(n => n.category === 'Crypto').slice(0, 2);
    }
    if (marketNews.forex.length === 0) {
      marketNews.forex = SEED_NEWS_DATA.filter(n => n.category === 'Forex').slice(0, 2);
    }
    if (marketNews.metals.length === 0) {
      marketNews.metals = SEED_NEWS_DATA.filter(n => n.category === 'Metals').slice(0, 2);
    }

    return marketNews;
  } catch (error) {
    console.error('Error fetching market news:', error);
    // Return seed data as fallback
    return {
      stocks: SEED_NEWS_DATA.filter(n => n.category === 'Stocks').slice(0, 2),
      crypto: SEED_NEWS_DATA.filter(n => n.category === 'Crypto').slice(0, 2),
      forex: SEED_NEWS_DATA.filter(n => n.category === 'Forex').slice(0, 2),
      metals: SEED_NEWS_DATA.filter(n => n.category === 'Metals').slice(0, 2),
    };
  }
}

/**
 * Fetch news data (backward compatibility)
 */
export async function fetchNewsData(): Promise<NewsItem[]> {
  try {
    const marketNews = await fetchMarketNews();
    return [
      ...marketNews.stocks,
      ...marketNews.crypto,
      ...marketNews.forex,
      ...marketNews.metals,
    ];
  } catch {
    return SEED_NEWS_DATA;
  }
}
