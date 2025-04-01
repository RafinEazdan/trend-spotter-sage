
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatLargeNumber } from "@/lib/stock-utils";
import type { StockData } from "@/lib/stock-utils";

interface StockStatsProps {
  stock: StockData;
}

const StockStats = ({ stock }: StockStatsProps) => {
  const stats = [
    { name: "Open", value: formatCurrency(stock.open) },
    { name: "High", value: formatCurrency(stock.high) },
    { name: "Low", value: formatCurrency(stock.low) },
    { name: "Market Cap", value: formatLargeNumber(stock.marketCap) },
    { name: "Previous Close", value: formatCurrency(stock.previousClose) },
    { name: "Volume", value: formatLargeNumber(stock.volume) },
    { name: "Avg. Volume", value: formatLargeNumber(stock.avgVolume) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Key Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={stat.name} className="flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{stat.name}</span>
                <span className="font-medium">{stat.value}</span>
              </div>
              {index < stats.length - 1 && <Separator className="mt-2" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockStats;
