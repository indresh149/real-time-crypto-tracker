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
  totalSupply?: number | null;
  maxSupply?: number | null;
  chartUrl: string;
  sparkline?: number[];
}

export interface WebSocketPriceUpdate {
  [key: string]: string;
}

export interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: number | null;
  total_volume: number;
  high_24h?: number | null;
  low_24h?: number | null;
  price_change_24h?: number | null;
  price_change_percentage_24h: number;
  market_cap_change_24h?: number | null;
  market_cap_change_percentage_24h?: number | null;
  circulating_supply: number;
  total_supply?: number | null;
  max_supply?: number | null;
  ath?: number;
  ath_change_percentage?: number;
  ath_date?: string;
  atl?: number;
  atl_change_percentage?: number;
  atl_date?: string;
  roi?: null | { times: number; currency: string; percentage: number };
  last_updated?: string;

  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface AssetUpdatePayload {
  id: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  volume24h: number;
}
