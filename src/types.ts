
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
