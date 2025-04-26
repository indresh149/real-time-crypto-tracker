# Real-Time Crypto Price Tracker (React + Redux Toolkit + TypeScript)

This application demonstrates a real-time cryptocurrency price tracking table, similar to CoinMarketCap, built with modern frontend technologies. It simulates WebSocket updates for price changes and manages all application state using Redux Toolkit.

[![Sample Output](<>)]([https://drive.google.com/drive/u/0/folders/12J2Lr-gQl0-2LXWmHrElz88OSVBaDiFe](https://drive.google.com/file/d/1PZjA6IKHid0Z9Q5SgFWWfC3sv_sA5biN/view?usp=drive_link))


## Features

* Displays a table of top cryptocurrencies (BTC, ETH, USDT, BNB, SOL).
* Columns include: Rank, Name/Symbol, Price, % Change (1h, 24h, 7d), Market Cap, 24h Volume, Circulating Supply, and a static 7-day chart.
* **Simulated Real-Time Updates:** Prices, percentage changes, and volume update every ~1.5 seconds to mimic live data feeds.
* **Redux State Management:** All crypto asset data is stored and managed centrally in the Redux store using Redux Toolkit (`createSlice`, `configureStore`).
* **Responsive Design:** The table layout adjusts for different screen sizes using Tailwind CSS, hiding less critical columns on smaller devices and enabling horizontal scrolling.
* **Optimized Rendering:** Uses Redux selectors and `React.memo` where appropriate to minimize unnecessary re-renders.
* **Type Safety:** Built with TypeScript for enhanced code quality and maintainability.
* **Modern Tooling:** Uses Vite for fast development and builds.
* **Clean UI:** Styled with Tailwind CSS for a modern look and feel.

## Tech Stack

* **Framework:** React 18+
* **State Management:** Redux Toolkit, React-Redux
* **Language:** TypeScript
* **Styling:** Tailwind CSS v3
* **Build Tool:** Vite
* **Formatting/Utils:** `clsx` (for conditional classes), `react-icons` (optional icons)

## Architecture

* **`main.tsx`**: Entry point, sets up the Redux store Provider.
* **`App.tsx`**: Main application component, handles layout and initiates/cleans up the mock WebSocket simulation via `useEffect`.
* **`store/`**: Contains Redux Toolkit setup.
    * **`store.ts`**: Configures the Redux store using `configureStore` and exports typed hooks (`useAppDispatch`, `useAppSelector`).
    * **`cryptoSlice.ts`**: Defines the state structure (`CryptoState`, `Asset`), initial state (sample data), reducers (`updateAssets`), and selectors (`selectAllAssets`).
* **`components/`**: Contains React components.
    * **`CryptoTable.tsx`**: Fetches data from the Redux store using `useAppSelector` and renders the main table structure (header, body). Maps over assets to render rows. Handles responsiveness and layout.
    * **`CryptoTableRow.tsx`**: Renders a single row (`<tr>`) for an asset. Receives asset data as props, formats values using utility functions, applies conditional styling (e.g., green/red for percentages), and displays logos/charts. Uses `React.memo` for optimization.
* **`services/`**: Contains logic for external interactions (or simulations).
    * **`mockWebSocket.ts`**: Simulates real-time data updates using `setInterval`. It gets the current state, calculates pseudo-random changes, and dispatches the `updateAssets` action to the Redux store. Provides `start` and `stop` functions.
* **`utils/`**: Contains helper functions.
    * **`formatters.ts`**: Utility functions for formatting numbers (currency, percentage, large numbers).
* **`types.ts`**: Defines shared TypeScript interfaces (`Asset`, `AssetUpdatePayload`).
* **`public/`**: Contains static assets like logos and chart images/SVGs.

**State Flow:**

1.  `App.tsx` mounts and calls `startMockWebSocket`.
2.  `mockWebSocket.ts` service starts a `setInterval`.
3.  On each interval tick:
    * It gets the current asset list from the Redux store (`getState`).
    * It calculates small random changes for price, percentages, and volume for each asset.
    * It dispatches the `updateAssets` action with an array of updates payload.
4.  The `cryptoSlice` reducer receives the action and updates the `assets` array in the Redux state immutably.
5.  The `CryptoTable.tsx` component, subscribed to the store via `useAppSelector(selectAllAssets)`, receives the updated `assets` array.
6.  React efficiently re-renders only the necessary `CryptoTableRow.tsx` components whose `asset` prop has changed.
7.  `CryptoTableRow.tsx` displays the new data, applying correct formatting and styles.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd real-time-crypto-tracker
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port).

4.  **(Optional) Build for production:**
    ```bash
    npm run build
    ```
    This creates a `dist` folder with optimized production assets.

## Demo

*(Embed a GIF or provide a link to a short video walkthrough here)*

[* [Link to Demo Video/GIF]]([https://drive.google.com/drive/u/0/folders/12J2Lr-gQl0-2LXWmHrElz88OSVBaDiFe](https://drive.google.com/file/d/1PZjA6IKHid0Z9Q5SgFWWfC3sv_sA5biN/view?usp=drive_link))

## Potential Improvements (Bonus)

* Integrate a real WebSocket API (e.g., Binance, Coinbase Pro) for live data.
* Implement filtering and sorting functionality (e.g., sort by price, filter top gainers).
* Add persistence using `localStorage` (e.g., using `redux-persist`).
* Write unit tests for reducers and selectors using Vitest or Jest.
* Add pagination or infinite scrolling for larger datasets.
* Implement more detailed chart interactions (e.g., using a charting library like Chart.js or Recharts).
* Add error handling for API calls (if using real data).
