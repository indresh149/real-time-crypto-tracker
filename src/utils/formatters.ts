export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercent = (value: number): string => {
  const formatted = value.toFixed(2);
  return `${value >= 0 ? "+" : ""}${formatted}%`;
};

export const formatLargeNumber = (value: number, symbol?: string): string => {
  try {
    const formatted = new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

    return symbol ? `${formatted} ${symbol}` : formatted;
  } catch (e) {
    console.warn(
      "Intl.NumberFormat compact notation not supported, falling back to basic formatting.",
      e
    );

    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(2)}T${symbol ? ` ${symbol}` : ""}`;
    } else if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B${symbol ? ` ${symbol}` : ""}`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M${symbol ? ` ${symbol}` : ""}`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K${symbol ? ` ${symbol}` : ""}`;
    } else {
      const formatted = value.toFixed(2);
      return symbol ? `${formatted} ${symbol}` : formatted;
    }
  }
};

export const formatNumberWithCommas = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(value);
};
