
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { formatCurrency } from "@/lib/stock-utils";
import type { HistoricalDataPoint, PredictionData } from "@/lib/stock-utils";

interface StockChartProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  historicalData: HistoricalDataPoint[];
  prediction: PredictionData;
}

const StockChart = ({ 
  symbol, 
  name, 
  price, 
  change, 
  changePercent, 
  historicalData, 
  prediction 
}: StockChartProps) => {
  const [timeRange, setTimeRange] = useState<"1W" | "1M" | "3M" | "6M" | "1Y" | "ALL">("1M");
  const [showPrediction, setShowPrediction] = useState(false);
  
  // Filter data based on selected time range
  const getFilteredData = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case "1W":
        startDate.setDate(now.getDate() - 7);
        break;
      case "1M":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3M":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6M":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1Y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "ALL":
      default:
        return historicalData;
    }
    
    const startDateStr = startDate.toISOString().split('T')[0];
    return historicalData.filter(d => d.date >= startDateStr);
  };
  
  const filteredData = getFilteredData();
  
  // Combine historical and prediction data for the chart
  const chartData = showPrediction 
    ? [
        ...filteredData.map(d => ({ ...d, isPrediction: false })),
        ...prediction.dates.map((date, i) => ({
          date,
          price: prediction.prices[i],
          upperBound: prediction.upperBound[i],
          lowerBound: prediction.lowerBound[i],
          isPrediction: true
        }))
      ]
    : filteredData.map(d => ({ ...d, isPrediction: false }));
  
  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border p-2 rounded-md shadow-sm">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-medium">{formatCurrency(data.price)}</p>
          {data.isPrediction && (
            <div className="mt-1 pt-1 border-t border-border">
              <p className="text-xs text-muted-foreground">Prediction</p>
              {data.upperBound && data.lowerBound && (
                <p className="text-xs text-muted-foreground">
                  Range: {formatCurrency(data.lowerBound)} - {formatCurrency(data.upperBound)}
                </p>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  const isPositive = change >= 0;
  const colorClass = isPositive ? "text-stock-up" : "text-stock-down";
  const chartColor = isPositive ? "#16c784" : "#ea3943";
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{symbol}</CardTitle>
            <p className="text-muted-foreground">{name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{formatCurrency(price)}</p>
            <p className={`text-sm font-medium ${colorClass}`}>
              {isPositive ? "+" : ""}{formatCurrency(change)} ({isPositive ? "+" : ""}
              {changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <Tabs 
              defaultValue="1M" 
              value={timeRange}
              onValueChange={(value) => setTimeRange(value as any)}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="1W">1W</TabsTrigger>
                <TabsTrigger value="1M">1M</TabsTrigger>
                <TabsTrigger value="3M">3M</TabsTrigger>
                <TabsTrigger value="6M">6M</TabsTrigger>
                <TabsTrigger value="1Y">1Y</TabsTrigger>
                <TabsTrigger value="ALL">ALL</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant={showPrediction ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPrediction(!showPrediction)}
              className="ml-auto"
            >
              {showPrediction ? "Hide Prediction" : "Show Prediction"}
            </Button>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  tickFormatter={(date) => {
                    // Different formatting based on time range
                    if (timeRange === "1W" || timeRange === "1M") {
                      return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    }
                    return new Date(date).toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
                  }}
                  minTickGap={30}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => formatCurrency(value)}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Historical price line */}
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={chartColor}
                  fill={`${chartColor}20`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: chartColor, stroke: "white", strokeWidth: 2 }}
                  connectNulls
                />
                
                {/* Prediction bounds area (if showing prediction) */}
                {showPrediction && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="upperBound"
                      stroke="transparent"
                      fill="rgba(25, 118, 210, 0.1)"
                      activeDot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="lowerBound"
                      stroke="transparent"
                      fill="transparent"
                      activeDot={false}
                    />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
