export interface Asset {
  id: string;
  rank: number;
  logo: string;
  name: string;
  symbol: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number;
  chartUrl: string;
  sparkline?: number[];
}

export interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface WebSocketPriceUpdate {
  [key: string]: string; 
} 