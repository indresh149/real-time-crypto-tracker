import React from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface SparklineChartProps {
  data?: number[];
  trend: "positive" | "negative" | "neutral";
  height?: number;
  width?: number;
}

const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  trend,
  height = 40,
  width = 112,
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        style={{ height: `${height}px`, width: `${width}px` }}
        className="flex items-center justify-center text-xs text-text-secondary"
      >
        No chart data
      </div>
    );
  }

  const chartData = data.map((price, index) => ({ name: index, value: price }));

  const lineColor =
    trend === "positive"
      ? "rgb(22 163 74)"
      : trend === "negative"
      ? "rgb(220 38 38)"
      : "#a3a3a3";

  const yMin = Math.min(...data);
  const yMax = Math.max(...data);

  const yDomainBuffer = (yMax - yMin) * 0.05; // 5% buffer
  const yDomain = [yMin - yDomainBuffer, yMax + yDomainBuffer];

  return (
    <div
      style={{ height: `${height}px`, width: `${width}px` }}
      className="ml-auto"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
        >
          <YAxis hide domain={yDomain} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SparklineChart;
