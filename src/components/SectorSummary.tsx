import React, { memo } from 'react';
import { SectorSummary } from '../types/portfolio';
import { formatCurrency, formatPercentage, getGainLossColor } from '../utils/portfolioCalculations';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

interface SectorSummaryProps {
  sectors: SectorSummary[];
  expandedSectors: Set<string>;
  onToggleSector: (sector: string) => void;
}

const SectorSummaryComponent = memo<SectorSummaryProps>(({ 
  sectors, 
  expandedSectors, 
  onToggleSector 
}) => {
  return (
    <div className="space-y-4">
      {sectors.map((sector) => (
        <div key={sector.sector} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <button
            onClick={() => onToggleSector(sector.sector)}
            className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-150 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              {expandedSectors.has(sector.sector) ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
              <h3 className="text-lg font-semibold text-gray-900">{sector.sector}</h3>
              <span className="text-sm text-gray-500">({sector.stocks.length} stocks)</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Investment</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(sector.totalInvestment)}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Present Value</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(sector.totalPresentValue)}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Gain/Loss</p>
                <div className={`flex items-center space-x-2 ${getGainLossColor(sector.totalGainLoss)}`}>
                  {sector.totalGainLoss > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : sector.totalGainLoss < 0 ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : null}
                  <div>
                    <p className="text-lg font-semibold">{formatCurrency(sector.totalGainLoss)}</p>
                    <p className="text-sm">{formatPercentage(sector.gainLossPercentage)}</p>
                  </div>
                </div>
              </div>
            </div>
          </button>
          
          {expandedSectors.has(sector.sector) && (
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Investment
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sector.stocks.map((stock) => (
                      <tr key={stock.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{stock.particulars}</div>
                          <div className="text-sm text-gray-500">{stock.symbol}</div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                          {stock.quantity.toLocaleString()}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(stock.investment)}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {stock.cmp ? formatCurrency(stock.cmp) : 'Loading...'}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(stock.presentValue)}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className={`text-sm font-medium ${getGainLossColor(stock.gainLoss)}`}>
                            <div>{formatCurrency(stock.gainLoss)}</div>
                            <div className="text-xs">{formatPercentage(stock.gainLossPercentage)}</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

SectorSummaryComponent.displayName = 'SectorSummaryComponent';

export default SectorSummaryComponent;