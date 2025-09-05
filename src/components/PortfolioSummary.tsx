import React, { memo } from 'react';
import { PortfolioStock } from '../types/portfolio';
import { formatCurrency, formatPercentage, getGainLossColor } from '../utils/portfolioCalculations';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

interface PortfolioSummaryProps {
  stocks: PortfolioStock[];
}

const PortfolioSummary = memo<PortfolioSummaryProps>(({ stocks }) => {
  const totalInvestment = stocks.reduce((sum, stock) => sum + stock.investment, 0);
  const totalPresentValue = stocks.reduce((sum, stock) => sum + stock.presentValue, 0);
  const totalGainLoss = totalPresentValue - totalInvestment;
  const totalGainLossPercentage = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

  // Summary card configuration
  const summaryCards = [
    {
      title: 'Total Invested',
      value: formatCurrency(totalInvestment),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Current Value',
      value: formatCurrency(totalPresentValue),
      icon: PieChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Net Gain/Loss',
      value: formatCurrency(totalGainLoss),
      subValue: formatPercentage(totalGainLossPercentage),
      icon: totalGainLoss >= 0 ? TrendingUp : TrendingDown,
      color: getGainLossColor(totalGainLoss),
      bgColor: totalGainLoss >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {summaryCards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div key={card.title} className={`${card.bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                {card.subValue && (
                  <p className={`text-sm font-medium ${card.color} mt-1`}>{card.subValue}</p>
                )}
              </div>
              <div className={`bg-white rounded-full p-3 shadow-sm`}>
                <IconComponent className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

PortfolioSummary.displayName = 'PortfolioSummary';

export default PortfolioSummary;