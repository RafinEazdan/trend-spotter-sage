
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/stock-utils";
import type { PredictionData } from "@/lib/stock-utils";

interface PredictionInfoProps {
  symbol: string;
  price: number;
  prediction: PredictionData;
}

const PredictionInfo = ({ symbol, price, prediction }: PredictionInfoProps) => {
  // Get the last prediction to show projected price
  const lastIdx = prediction.prices.length - 1;
  const projectedPrice = prediction.prices[lastIdx];
  const projectedHighPrice = prediction.upperBound[lastIdx];
  const projectedLowPrice = prediction.lowerBound[lastIdx];
  
  // Calculate projected return
  const projectedReturn = ((projectedPrice - price) / price) * 100;
  const isPositive = projectedReturn >= 0;
  
  // Get prediction timeframe (e.g., "30 days")
  const daysOut = prediction.dates.length;
  
  // Generate a simple analysis based on the projection
  const getAnalysis = () => {
    if (projectedReturn > 15) {
      return "Our model indicates a strong bullish trend for this stock.";
    } else if (projectedReturn > 5) {
      return "The stock shows promising upward momentum.";
    } else if (projectedReturn >= 0) {
      return "Our model indicates moderate upward potential.";
    } else if (projectedReturn > -5) {
      return "The stock may experience slight downward pressure.";
    } else {
      return "Our model indicates a bearish outlook in the short term.";
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {daysOut}-Day Price Prediction
        </CardTitle>
        <CardDescription>
          Based on historical data analysis and trend forecasting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Price</h3>
            <p className="text-xl font-bold">{formatCurrency(price)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Projected Price</h3>
            <p className={`text-xl font-bold ${isPositive ? "text-stock-up" : "text-stock-down"}`}>
              {formatCurrency(projectedPrice)}
            </p>
            <p className="text-sm mt-1">
              <span className={`font-medium ${isPositive ? "text-stock-up" : "text-stock-down"}`}>
                {isPositive ? "+" : ""}{projectedReturn.toFixed(2)}%
              </span>
              <span className="text-muted-foreground ml-1">in {daysOut} days</span>
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Potential High
              </h3>
              <p className="text-lg font-medium text-stock-up">
                {formatCurrency(projectedHighPrice)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Potential Low
              </h3>
              <p className="text-lg font-medium text-stock-down">
                {formatCurrency(projectedLowPrice)}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Analysis
            </h3>
            <p className="text-sm">{getAnalysis()}</p>
          </div>
          
          <div className="pt-2 text-xs text-muted-foreground">
            <p>Note: These projections are for informational purposes only and should not be considered as financial advice.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionInfo;
