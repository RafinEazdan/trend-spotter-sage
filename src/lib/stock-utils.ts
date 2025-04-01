
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  avgVolume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  historicalData: HistoricalDataPoint[];
  prediction: PredictionData;
}

export interface HistoricalDataPoint {
  date: string;
  price: number;
}

export interface PredictionData {
  dates: string[];
  prices: number[];
  upperBound: number[];
  lowerBound: number[];
}

const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com, Inc." },
  { symbol: "META", name: "Meta Platforms, Inc." },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
];

// Generate realistic-looking mock historical data
export function generateHistoricalData(days: number): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const now = new Date();
  
  let price = 100 + Math.random() * 150; // Starting price between 100 and 250
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some randomness to price, but maintain a trend
    const change = (Math.random() - 0.48) * 5; // Slight upward bias
    price += change;
    price = Math.max(price, 10); // Ensure price doesn't go too low
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
    });
  }
  
  return data;
}

// Generate mock prediction data based on historical trends
export function generatePredictionData(historicalData: HistoricalDataPoint[], days = 30): PredictionData {
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  const lastPrice = historicalData[historicalData.length - 1].price;
  
  // Calculate simple moving average of last 7 days to determine trend
  const lastWeekPrices = historicalData.slice(-7).map(d => d.price);
  const avgPrice = lastWeekPrices.reduce((a, b) => a + b, 0) / lastWeekPrices.length;
  const trend = lastPrice > avgPrice ? 1 : -1; // positive or negative trend
  
  // Calculate volatility from last 30 days
  const lastMonthPrices = historicalData.slice(-30).map(d => d.price);
  const volatility = calculateVolatility(lastMonthPrices);
  
  const dates: string[] = [];
  const prices: number[] = [];
  const upperBound: number[] = [];
  const lowerBound: number[] = [];
  
  let currentPrice = lastPrice;
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(lastDate);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
    
    // Generate predicted price with trend and some randomness
    const dailyChange = (trend * 0.001 + (Math.random() - 0.5) * 0.01) * currentPrice;
    currentPrice += dailyChange;
    
    // Ensure price doesn't go negative
    currentPrice = Math.max(currentPrice, 1);
    prices.push(Math.round(currentPrice * 100) / 100);
    
    // Calculate confidence intervals based on volatility
    const confidence = volatility * Math.sqrt(i); // Widens with time
    upperBound.push(Math.round((currentPrice * (1 + confidence)) * 100) / 100);
    lowerBound.push(Math.round((currentPrice * (1 - confidence)) * 100) / 100);
  }
  
  return { dates, prices, upperBound, lowerBound };
}

// Helper to calculate volatility
function calculateVolatility(prices: number[]): number {
  if (prices.length <= 1) return 0.01;
  
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i-1]) / prices[i-1]);
  }
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / returns.length;
  
  return Math.sqrt(variance);
}

// Generate a complete mock stock data entry
export function generateMockStockData(symbol: string, name: string): StockData {
  const historicalData = generateHistoricalData(365);
  const currentPrice = historicalData[historicalData.length - 1].price;
  const previousPrice = historicalData[historicalData.length - 2].price;
  const change = currentPrice - previousPrice;
  const changePercent = (change / previousPrice) * 100;
  
  return {
    symbol,
    name,
    price: currentPrice,
    change,
    changePercent,
    marketCap: Math.round(currentPrice * (1000000000 + Math.random() * 2000000000)),
    volume: Math.round(1000000 + Math.random() * 10000000),
    avgVolume: Math.round(1000000 + Math.random() * 10000000),
    high: Math.round((currentPrice * (1 + Math.random() * 0.05)) * 100) / 100,
    low: Math.round((currentPrice * (1 - Math.random() * 0.05)) * 100) / 100,
    open: Math.round((previousPrice * (1 + (Math.random() - 0.5) * 0.02)) * 100) / 100,
    previousClose: previousPrice,
    historicalData,
    prediction: generatePredictionData(historicalData)
  };
}

// Search for a stock by its symbol or name
export function searchStocks(query: string): { symbol: string, name: string }[] {
  if (!query) return popularStocks;
  
  const lowerCaseQuery = query.toLowerCase();
  return popularStocks.filter(
    stock => stock.symbol.toLowerCase().includes(lowerCaseQuery) || 
             stock.name.toLowerCase().includes(lowerCaseQuery)
  );
}

// Format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(value);
}

// Format large numbers with abbreviations (K, M, B, T)
export function formatLargeNumber(num: number): string {
  if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(2) + 'T';
  }
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toString();
}

// Get a list of popular stocks
export function getPopularStocks(): { symbol: string, name: string }[] {
  return popularStocks;
}
