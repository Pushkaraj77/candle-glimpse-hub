
export interface Symbol {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

// New interface for candlestick interval
export interface CandlestickInterval {
  label: string;
  value: string;
}

export interface ChartType {
  close: number;
  high: number;
  low: number;
  open: number;
  time: string;
  volume: number;
}

export interface QuoteType {
  avgVolume: number;
  change: number;
  changePercent: number;
  dividendYield: number;
  high52w: number;
  low52w: number;
  marketCap: number;
  name: string;
  peRatio: number;
  price: number;
  symbol: string;
  time: string;
  volume: number;
}