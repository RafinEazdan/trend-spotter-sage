
import { SeparatorHorizontal } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-6 mt-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-stock-blue to-stock-teal p-1 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-white"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
              </div>
              <span className="font-bold gradient-text">StockSage</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Predictive stock analysis powered by AI
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} StockSage. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              For demonstration purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
