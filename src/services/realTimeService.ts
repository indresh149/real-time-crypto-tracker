import { AppDispatch } from "../store/store";
import { resetCryptoStatus, updateAssetPrice } from "../store/cryptoSlice";
import { WebSocketPriceUpdate } from "../types.ts";

let socket: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 5000;

const getWebSocketUrl = (assetIds: string[]): string => {
  if (!assetIds || assetIds.length === 0) {
    console.warn("No asset IDs provided for WebSocket connection.");

    return `wss://ws.coincap.io/prices?assets=bitcoin,ethereum`;
  }
  return `wss://ws.coincap.io/prices?assets=${assetIds.join(",")}`;
};

export const startRealTimeUpdates = (
  dispatch: AppDispatch,
  assetIds: string[]
) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("WebSocket already open.");
    return;
  }

  const wsUrl = getWebSocketUrl(assetIds);
  if (!wsUrl.includes("?assets=")) return;

  console.log(`Connecting to WebSocket: ${wsUrl}`);
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log("WebSocket connection established.");
    reconnectAttempts = 0;
    dispatch(resetCryptoStatus());
  };

  socket.onmessage = (event) => {
    try {
      const message: WebSocketPriceUpdate = JSON.parse(event.data);

      if (typeof message === "object" && message !== null) {
        dispatch(updateAssetPrice(message));
      } else {
        console.warn("Received non-object WebSocket message:", message);
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = (event) => {
    console.log(
      `WebSocket closed. Code: ${event.code}, Reason: ${event.reason}. Clean close: ${event.wasClean}`
    );
    socket = null;

    if (!event.wasClean && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`
      );

      setTimeout(
        () => startRealTimeUpdates(dispatch, assetIds),
        RECONNECT_DELAY_MS * Math.pow(2, reconnectAttempts - 1)
      );
    } else if (!event.wasClean) {
      console.error("WebSocket reconnect attempts exhausted.");
    }
  };
};

export const stopRealTimeUpdates = () => {
  if (socket) {
    console.log("Closing WebSocket connection.");

    reconnectAttempts = MAX_RECONNECT_ATTEMPTS;
    socket.close(1000, "Client closed connection");
    socket = null;
  }
};
