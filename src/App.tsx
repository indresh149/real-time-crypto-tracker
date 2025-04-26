import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./store/store";
import {
  fetchAssets,
  selectAllAssets,
  selectCryptoStatus,
  selectCryptoError,
  simulatePriceTick,
} from "./store/cryptoSlice";
import CryptoTable from "./components/CryptoTable";

const REAL_DATA_POLLING_INTERVAL_MS = 60000;

const SIMULATION_INTERVAL_MS = 1500;

function App() {
  const dispatch = useAppDispatch();
  const assets = useAppSelector(selectAllAssets);
  const status = useAppSelector(selectCryptoStatus);
  const error = useAppSelector(selectCryptoError);

  const pollingIntervalRef = useRef<number | null>(null);
  const simulationIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === "idle") {
      console.log("Dispatching initial asset fetch.");
      dispatch(fetchAssets());
    }
  }, [status, dispatch]);

  // --- Effect for Setting Up Intervals (Polling & Simulation) ---
  useEffect(() => {
    // Function to clear intervals
    const clearAllIntervals = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
      console.log("Cleared all intervals.");
    };

    if (status === "succeeded") {
      clearAllIntervals();

      console.log(
        `Setting up polling interval (${REAL_DATA_POLLING_INTERVAL_MS}ms)`
      );
      pollingIntervalRef.current = setInterval(() => {
        console.log("Dispatching periodic asset fetch (polling).");
        dispatch(fetchAssets());
      }, REAL_DATA_POLLING_INTERVAL_MS);

      console.log(
        `Setting up simulation interval (${SIMULATION_INTERVAL_MS}ms)`
      );
      simulationIntervalRef.current = setInterval(() => {
        dispatch(simulatePriceTick());
      }, SIMULATION_INTERVAL_MS);
    } else {
      clearAllIntervals();
    }

    return () => {
      clearAllIntervals();
    };
  }, [status, dispatch]);

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">
          Real-Time Crypto Tracker
        </h1>
        <p className="text-center text-text-secondary mt-2">
          Using CoinGecko API (Polling Updates)
        </p>
      </header>
      <main>
        {status === "loading" && assets.length === 0 && (
          <div className="text-center p-10">Loading market data...</div>
        )}

        {error && (
          <div className="my-4 p-3 bg-red-800 border border-red-600 text-white text-center rounded shadow-md">
            {error.includes("Rate limit exceeded") ? (
              <>
                <p className="font-bold">API Rate Limit Exceeded</p>
                <p className="mt-2">
                  The CoinGecko API has rate limits. We'll automatically retry
                  in 1 minute.
                </p>
                <p className="text-sm mt-2">
                  If this persists, please try again later.
                </p>
              </>
            ) : (
              `Error: API Rate Limit Exceeded ${error}`
            )}
          </div>
        )}

        {(status !== "loading" || assets.length > 0) && assets.length > 0 && (
          <CryptoTable />
        )}

        {status === "succeeded" && assets.length === 0 && (
          <div className="text-center p-10 text-text-secondary">
            No assets found matching the criteria.
          </div>
        )}

        {status === "failed" &&
          assets.length === 0 &&
          !error?.includes("Rate limit exceeded") && (
            <div className="text-center p-10 text-text-secondary">
              Failed to load initial data. Please try refreshing later.
            </div>
          )}
      </main>
      <footer className="mt-8 text-center text-xs text-text-secondary">
        Powered by{" "}
        <a
          href="https://www.coingecko.com/en/api"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          CoinGecko API
        </a>
        . Data updated periodically.
      </footer>
    </div>
  );
}

export default App;
