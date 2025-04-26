import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Asset, CoinGeckoMarketData, WebSocketPriceUpdate } from "../types.ts";

const TARGET_ASSET_IDS_CG = [
  "bitcoin",
  "ethereum",
  "tether",
  "binancecoin",
  "solana",
];

const COINGECKO_MARKETS_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${TARGET_ASSET_IDS_CG.join(
  ","
)}&order=market_cap_desc&sparkline=true&price_change_percentage=1h%2C24h%2C7d`;

export const fetchAssets = createAsyncThunk<
  Asset[],
  void,
  { rejectValue: string }
>("crypto/fetchAssets", async (_, { rejectWithValue }) => {
  try {
    console.log(`Workspaceing data from CoinGecko: ${COINGECKO_MARKETS_URL}`);
    const response = await fetch(COINGECKO_MARKETS_URL);

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded with CoinGecko API.");
        return rejectWithValue(
          "Rate limit exceeded. CoinGecko API is temporarily unavailable due to too many requests. Please wait a few minutes and try again."
        );
      }
      throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }
    const result: CoinGeckoMarketData[] = await response.json();

    if (!Array.isArray(result)) {
      console.error("Unexpected API response format:", result);
      throw new Error("Received invalid data format from CoinGecko API.");
    }

    const mappedAssets: Asset[] = result.map(
      (apiAsset: CoinGeckoMarketData): Asset => {
        const logoUrl = apiAsset.image || `/logos/${apiAsset.symbol}.svg`;

        const chartUrl = `/charts/${apiAsset.symbol}_7d.svg`;

        const safeNum = (value: number | null | undefined): number =>
          value ?? 0;

        const sparklineData = apiAsset.sparkline_in_7d?.price;

        return {
          id: apiAsset.id,
          rank: apiAsset.market_cap_rank ?? 0,
          logo: logoUrl,
          name: apiAsset.name,
          symbol: apiAsset.symbol.toUpperCase(),
          price: safeNum(apiAsset.current_price),
          change1h: safeNum(apiAsset.price_change_percentage_1h_in_currency),
          change24h: safeNum(apiAsset.price_change_percentage_24h),
          change7d: safeNum(apiAsset.price_change_percentage_7d_in_currency),
          marketCap: safeNum(apiAsset.market_cap),
          volume24h: safeNum(apiAsset.total_volume),
          circulatingSupply: safeNum(apiAsset.circulating_supply),
          totalSupply: safeNum(apiAsset.total_supply),
          maxSupply: safeNum(apiAsset.max_supply),
          chartUrl: chartUrl,
          sparkline: sparklineData,
        };
      }
    );

    mappedAssets.sort((a, b) => a.rank - b.rank);

    return mappedAssets;
  } catch (error) {
    console.error("Failed to fetch assets from CoinGecko:", error);
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch data"
    );
  }
});

// --- State Interface ---
interface CryptoState {
  assets: Asset[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// --- Initial State ---
const initialState: CryptoState = {
  assets: [],
  status: "idle",
  error: null,
};

// --- Slice Definition ---
export const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    resetCryptoStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
    simulatePriceTick: (state) => {
      // Only simulate if we have successfully loaded assets
      if (state.status === 'succeeded' && state.assets.length > 0) {
          state.assets = state.assets.map(asset => {
              // Apply a tiny random fluctuation (+/- 0.05% max)
              const fluctuation = 1 + (Math.random() - 0.5) * 0.001; // Smaller fluctuation
              const newPrice = asset.price * fluctuation;

              // Recalculate market cap based on simulated price
              const newMarketCap = newPrice * asset.circulatingSupply;

              // Note: We are *not* simulating % changes or volume here,
              // as that would be significantly more complex and even less accurate.
              return {
                  ...asset,
                  price: newPrice,
                  marketCap: newMarketCap,
              };
          });
      }
  },
    updateAssetPrice: (state, action: PayloadAction<WebSocketPriceUpdate>) => {
      Object.entries(action.payload).forEach(([assetId, price]) => {
        const asset = state.assets.find((a) => a.id === assetId);
        if (asset) {
          asset.price = parseFloat(price);
        }
      });
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        if (state.assets.length === 0) {
          state.status = "loading";
        }
        state.error = null;
      })
      .addCase(
        fetchAssets.fulfilled,
        (state, action: PayloadAction<Asset[]>) => {
          state.status = "succeeded";
          state.assets = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAssets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error fetching data";
        if (state.assets.length === 0) {
          console.error("Initial data fetch failed:", action.payload);
        } else {
          console.warn("Periodic data update failed:", action.payload);
        }
      });
  },
});

// --- Actions ---
export const { resetCryptoStatus, updateAssetPrice,simulatePriceTick } = cryptoSlice.actions;

// --- Selectors ---

export const selectAllAssets = (state: RootState): Asset[] =>
  state.crypto.assets;
export const selectAssetById =
  (id: string) =>
  (state: RootState): Asset | undefined =>
    state.crypto.assets.find((asset) => asset.id === id);
export const selectCryptoStatus = (
  state: RootState
): "idle" | "loading" | "succeeded" | "failed" => state.crypto.status;
export const selectCryptoError = (state: RootState): string | null =>
  state.crypto.error;

// --- Reducer Export ---
export default cryptoSlice.reducer;
