import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { selectAllAssets } from "../store/cryptoSlice";
import { useAppSelector } from "../store/store";
import CryptoTableRow from "./CryptoTableRow";

const CryptoTable: React.FC = () => {
  const assets = useAppSelector(selectAllAssets);

  const HeaderTooltip: React.FC<{
    text: string;
    children: React.ReactNode;
  }> = ({ text, children }) => (
    <span className="group relative flex items-center gap-1 cursor-help">
      {children}
      <FaInfoCircle className="w-3 h-3 text-text-secondary opacity-50 group-hover:opacity-100 transition-opacity" />
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 whitespace-normal text-center">
        {text}
      </span>
    </span>
  );

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-card border border-border">
      <table className="w-full text-sm text-left text-text-primary relative">
        <thead className="text-xs text-text-secondary uppercase bg-card sticky top-0 z-20">
          <tr>
            <th
              scope="col"
              className="py-3 px-2 md:px-4 text-center sticky left-0 bg-card z-10"
            >
              #
            </th>
            <th
              scope="col"
              className="py-3 px-2 md:px-4 sticky left-[40px] md:left-0 bg-card z-10"
            >
              Name
            </th>
            <th scope="col" className="py-3 px-2 md:px-4 text-right">
              Price
            </th>
            <th
              scope="col"
              className="py-3 px-2 md:px-4 text-right hidden sm:table-cell"
            >
              1h %
            </th>
            <th scope="col" className="py-3 px-2 md:px-4 text-right">
              24h %
            </th>
            <th
              scope="col"
              className="py-3 px-2 md:px-4 text-right hidden md:table-cell"
            >
              7d %
            </th>
            <th
              scope="col"
              className="py-3 px-2 md:px-4 text-right hidden lg:table-cell"
            >
              <HeaderTooltip text="The total market value of a cryptocurrency's circulating supply. Market Cap = Current Price x Circulating Supply.">
                Market Cap
              </HeaderTooltip>
            </th>
            <th
              scope="col"
              className="py-3 px-2 md:px-4 text-right hidden lg:table-cell"
            >
              <HeaderTooltip text="The total dollar value of all transactions for this asset over the past 24 hours.">
                Volume(24h)
              </HeaderTooltip>
            </th>
            <th
              scope="col"
              className="py-3 px-2 md:px-4 text-right hidden xl:table-cell"
            >
              <HeaderTooltip text="The amount of coins that are circulating in the market and are in public hands.">
                Circulating Supply
              </HeaderTooltip>
            </th>

            <th
              scope="col"
              className="py-3 px-2 md:px-4 text-right hidden md:table-cell"
            >
              Last 7 Days
            </th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <CryptoTableRow key={asset.id} asset={asset} />
          ))}
        </tbody>
      </table>
      {assets.length === 0 && (
        <div className="text-center py-10 text-text-secondary">
          No assets to display.
        </div>
      )}
    </div>
  );
};

export default CryptoTable;
