// Market data utility - fetches real prices EXCLUSIVELY from Alpha Vantage API
// API Key: d4P7OXFWW9G4NPFSB

const ALPHA_VANTAGE_API_KEY = '4P7OXFWW9G4NPFSB';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

export type Instrument = {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
};

export type MarketData = {
  stocks: Instrument[];
  forex: Instrument[];
  metals: Instrument[];
  crypto: Instrument[];
};

// Helper to wait between API calls to respect rate limits
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to fetch exchange rate (Forex & Crypto)
async function fetchExchangeRate(from: string, to: string = 'USD', name: string): Promise<Instrument | null> {
  try {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    
    if (data['Realtime Currency Exchange Rate']) {
      const rate = data['Realtime Currency Exchange Rate'];
      const price = parseFloat(rate['5. Exchange Rate']);
      const bid = parseFloat(rate['8. Bid Price']);
      const ask = parseFloat(rate['9. Ask Price']);
      const change = ask - bid;
      const changePercent = (change / bid) * 100;
      return { name, symbol: from + to, price, change, changePercent };
    }
    
    if (data['Information'] || data['Note']) {
      console.warn(`Alpha Vantage Rate Limit for ${from}/${to}:`, data['Information'] || data['Note']);
    }
    return null;
  } catch {
    return null;
  }
}

// Helper to fetch stock quote
async function fetchStockQuote(symbol: string, name: string): Promise<Instrument | null> {
  try {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    
    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const quote = data['Global Quote'];
      return {
        name,
        symbol,
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change'] || '0'),
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
      };
    }
    
    if (data['Information'] || data['Note']) {
      console.warn(`Alpha Vantage Rate Limit for ${symbol}:`, data['Information'] || data['Note']);
    }
    return null;
  } catch {
    return null;
  }
}

// Helper to fetch commodity price (Copper, Natural Gas, etc.)
async function fetchCommodityPrice(func: string, name: string, symbol: string): Promise<Instrument | null> {
  try {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=${func}&interval=monthly&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    
    if (data.data && data.data.length >= 2) {
      const current = parseFloat(data.data[0].value);
      const previous = parseFloat(data.data[1].value);
      const change = current - previous;
      const changePercent = (change / previous) * 100;
      return { name, symbol, price: current, change, changePercent };
    }
    
    if (data['Information'] || data['Note']) {
      console.warn(`Alpha Vantage Rate Limit for ${func}:`, data['Information'] || data['Note']);
    }
    return null;
  } catch {
    return null;
  }
}

// Specialized helper for Gold/Silver Spot
async function fetchMetalSpot(symbol: string, name: string): Promise<Instrument | null> {
  try {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=GOLD_SILVER_SPOT&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    
    if (data.price) {
      return { name, symbol, price: parseFloat(data.price), change: 0, changePercent: 0 };
    }
    
    if (data['Information'] || data['Note']) {
      console.warn(`Alpha Vantage Rate Limit for ${symbol} Spot:`, data['Information'] || data['Note']);
    }
    
    // Fallback to exchange rate if spot endpoint is restricted
    return fetchExchangeRate(symbol, 'USD', name);
  } catch {
    return null;
  }
}

export async function fetchMarketData(): Promise<MarketData> {
  const marketData: MarketData = {
    stocks: [],
    forex: [],
    metals: [],
    crypto: [],
  };

  // 1. Fetch Crypto (Sequential to avoid rate limits)
  const cryptoConfigs = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
  ];
  for (const c of cryptoConfigs) {
    const res = await fetchExchangeRate(c.symbol, 'USD', c.name);
    if (res) marketData.crypto.push(res);
    await delay(1100); // Wait 1.1s between calls
  }

  // 2. Fetch Forex
  const forexConfigs = [
    { from: 'EUR', to: 'USD', name: 'EUR/USD' },
    { from: 'GBP', to: 'USD', name: 'GBP/USD' },
  ];
  for (const c of forexConfigs) {
    const res = await fetchExchangeRate(c.from, c.to, c.name);
    if (res) marketData.forex.push(res);
    await delay(1100);
  }

  // 3. Fetch Stocks
  const stockConfigs = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
  ];
  for (const c of stockConfigs) {
    const res = await fetchStockQuote(c.symbol, c.name);
    if (res) marketData.stocks.push(res);
    await delay(1100);
  }

  // 4. Fetch Metals & Commodities
  const metalConfigs = [
    { symbol: 'XAU', name: 'Gold', type: 'spot' },
    { symbol: 'XAG', name: 'Silver', type: 'spot' },
  ];
  for (const c of metalConfigs) {
    const res = await fetchMetalSpot(c.symbol, c.name);
    if (res) marketData.metals.push(res);
    await delay(1100);
  }

  return marketData;
}

// Export an empty object for SEED_MARKET_DATA to maintain compatibility
export const SEED_MARKET_DATA: MarketData = {
  stocks: [],
  forex: [],
  metals: [],
  crypto: [],
};
