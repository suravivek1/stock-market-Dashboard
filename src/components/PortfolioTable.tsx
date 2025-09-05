import React, { memo } from 'react';
import { PortfolioStock } from '../types/portfolio';
import { formatCurrency, formatPercentage, getGainLossColor, getGainLossBgColor } from '../utils/portfolioCalculations';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PortfolioTableProps {
  stocks: PortfolioStock[];
  loading: boolean;
}

const PortfolioTable = memo<PortfolioTableProps>(({ stocks, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Fetching latest market data...</p>
        </div>
      </div>
    );
  }

  // Helper function to determine trend direction
  const getTrendIcon = (gainLoss: number) => {
    if (gainLoss > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (gainLoss < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Particulars
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purchase Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Investment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Portfolio (%)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exchange
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CMP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Present Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gain/Loss
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                P/E Ratio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Latest Earnings
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((stock) => (
              <tr 
                key={stock.id} 
                className={`hover:bg-gray-50 transition-colors duration-150 ${getGainLossBgColor(stock.gainLoss)}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{stock.particulars}</div>
                    <div className="text-sm text-gray-500">{stock.symbol}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(stock.purchasePrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stock.quantity.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatCurrency(stock.investment)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPercentage(stock.portfolioPercentage)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {stock.exchange}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {stock.cmp ? formatCurrency(stock.cmp) : 'Loading...'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatCurrency(stock.presentValue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center space-x-2 ${getGainLossColor(stock.gainLoss)}`}>
                    {getTrendIcon(stock.gainLoss)}
                    <div>
                      <div className="text-sm font-semibold">{formatCurrency(stock.gainLoss)}</div>
                      <div className="text-xs">{formatPercentage(stock.gainLossPercentage)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stock.peRatio ? stock.peRatio.toFixed(2) : 'Loading...'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate" title={stock.latestEarnings || 'Loading...'}>
                  {stock.latestEarnings || 'Loading...'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

PortfolioTable.displayName = 'PortfolioTable';

export default PortfolioTable;