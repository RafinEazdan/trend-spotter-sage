
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StockSearch from "@/components/StockSearch";
import StockChart from "@/components/StockChart";
import StockStats from "@/components/StockStats";
import PredictionInfo from "@/components/PredictionInfo";
import { generateMockStockData, type StockData } from "@/lib/stock-utils";

const Index = () => {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load default stock on initial render
  useEffect(() => {
    loadStock("AAPL", "Apple Inc.");
  }, []);

  const loadStock = async (symbol: string, name: string) => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      try {
        const stockData = generateMockStockData(symbol, name);
        setSelectedStock(stockData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading stock data:", error);
        toast({
          title: "Error loading stock data",
          description: "Please try again later",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              Stock Price Prediction
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enter any stock symbol to see historical data and AI-powered price predictions
            </p>
          </div>

          <div className="w-full max-w-md mx-auto mb-8">
            <StockSearch onSelectStock={loadStock} />
          </div>

          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-pulse-opacity flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-muted mb-4" />
                <div className="h-4 w-48 bg-muted rounded" />
              </div>
            </div>
          ) : selectedStock ? (
            <div className="space-y-8">
              <StockChart
                symbol={selectedStock.symbol}
                name={selectedStock.name}
                price={selectedStock.price}
                change={selectedStock.change}
                changePercent={selectedStock.changePercent}
                historicalData={selectedStock.historicalData}
                prediction={selectedStock.prediction}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <StockStats stock={selectedStock} />
                <PredictionInfo
                  symbol={selectedStock.symbol}
                  price={selectedStock.price}
                  prediction={selectedStock.prediction}
                />
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">
                Search for a stock to view data
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
