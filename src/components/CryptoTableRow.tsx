import React, { useState, useEffect, useRef } from "react";
import { Asset } from "../types";
import {
  formatCurrency,
  formatPercent,
  formatLargeNumber,
  formatNumberWithCommas,
} from "../utils/formatters";
import clsx from "clsx";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import SparklineChart from "./SparklineChart";

interface CryptoTableRowProps {
  asset: Asset;
}

const CryptoTableRow: React.FC<CryptoTableRowProps> = React.memo(
  ({ asset }) => {
    const [flashClass, setFlashClass] = useState("");
    const prevPriceRef = useRef<number | undefined>(undefined);
    const isInitialRender = useRef(true);
    const flashTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
        flashTimeoutRef.current = null;
      }

      if (isInitialRender.current) {
        isInitialRender.current = false;
        prevPriceRef.current = asset.price;
        return;
      }

      if (
        prevPriceRef.current !== undefined &&
        asset.price !== prevPriceRef.current
      ) {
        const priceIncreased = asset.price > prevPriceRef.current;
        const newFlashClass = priceIncreased
          ? "flash-positive"
          : "flash-negative";

        setFlashClass(newFlashClass);

        flashTimeoutRef.current = setTimeout(() => {
          setFlashClass("");
          flashTimeoutRef.current = null;
        }, 600);
      }

      prevPriceRef.current = asset.price;

      return () => {
        if (flashTimeoutRef.current) {
          clearTimeout(flashTimeoutRef.current);
        }
      };
    }, [asset.price]);

    const PercentChange: React.FC<{ value: number }> = ({ value }) => {
      const isPositive = value >= 0;
      const colorClass = isPositive ? "text-positive" : "text-negative";
      const Icon = isPositive ? FaCaretUp : FaCaretDown;

      return (
        <span
          className={clsx("flex items-center justify-end gap-1", colorClass)}
        >
          <Icon />
          {formatPercent(Math.abs(value))}
        </span>
      );
    };

    const chartTrend =
      asset.change7d > 0
        ? "positive"
        : asset.change7d < 0
        ? "negative"
        : "neutral";

    return (
      <tr
        className={clsx(
          "border-b border-border hover:bg-card transition-colors duration-150",
          flashClass
        )}
      >
        <td className="py-4 px-2 md:px-4 text-center text-text-secondary text-sm sticky left-0 bg-background md:bg-transparent z-10">
          {asset.rank}
        </td>

        <td className="py-4 px-2 md:px-4 sticky left-[40px] md:left-0 bg-background md:bg-transparent z-10">
          <div className="flex items-center gap-3">
            <img
              src={asset.logo}
              alt={`${asset.name} logo`}
              className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white"
            />
            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
              <span className="font-semibold text-sm md:text-base">
                {asset.name}
              </span>
              <span className="text-text-secondary text-xs md:text-sm">
                {asset.symbol}
              </span>
            </div>
          </div>
        </td>

        <td className="py-4 px-2 md:px-4 text-right font-medium text-sm md:text-base">
          {formatCurrency(asset.price)}
        </td>

        <td className="py-4 px-2 md:px-4 text-right text-sm hidden sm:table-cell">
          <PercentChange value={asset.change1h} />
        </td>

        <td className="py-4 px-2 md:px-4 text-right text-sm">
          <PercentChange value={asset.change24h} />
        </td>

        <td className="py-4 px-2 md:px-4 text-right text-sm hidden md:table-cell">
          <PercentChange value={asset.change7d} />
        </td>

        <td className="py-4 px-2 md:px-4 text-right text-sm hidden lg:table-cell">
          {formatCurrency(asset.marketCap)}
        </td>

        <td className="py-4 px-2 md:px-4 text-right text-sm hidden lg:table-cell">
          <div>{formatCurrency(asset.volume24h)}</div>
          <div className="text-text-secondary text-xs">
            {formatLargeNumber(asset.volume24h / asset.price, asset.symbol)}
          </div>
        </td>

        <td className="py-4 px-2 md:px-4 text-right text-sm hidden xl:table-cell">
          {formatNumberWithCommas(asset.circulatingSupply)} {asset.symbol}
          {asset.maxSupply &&
            asset.circulatingSupply &&
            asset.maxSupply > 0 && (
              <div className="w-full bg-gray-600 rounded-full h-1.5 mt-1">
                <div
                  className="bg-gray-400 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (asset.circulatingSupply / asset.maxSupply) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            )}
        </td>

        <td className="py-3 px-2 md:px-4 hidden md:table-cell align-middle">
          <SparklineChart data={asset.sparkline} trend={chartTrend} />
        </td>
      </tr>
    );
  }
);

export default CryptoTableRow;
