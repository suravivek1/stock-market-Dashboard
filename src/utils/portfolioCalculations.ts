import { Stock, PortfolioStock, SectorSummary } from '../types/portfolio';

export function calculatePortfolioMetrics(stocks: Stock[]): PortfolioStock[] {
  const totalInvestment = stocks.reduce((sum, stock) => sum + (stock.purchasePrice * stock.quantity), 0);

  // Calculate metrics for each stock
  return stocks.map(stock => {
    const investment = stock.purchasePrice * stock.quantity;
    const presentValue = (stock.cmp || stock.purchasePrice) * stock.quantity;
    const gainLoss = presentValue - investment;
    const gainLossPercentage = (gainLoss / investment) * 100;
    const portfolioPercentage = (investment / totalInvestment) * 100;

    return {
      ...stock,
      investment,
      portfolioPercentage,
      presentValue,
      gainLoss,
      gainLossPercentage,
    } as PortfolioStock;
  });
}

export function groupBySector(portfolioStocks: PortfolioStock[]): SectorSummary[] {
  const sectorMap = new Map<string, PortfolioStock[]>();

  // First pass: group all stocks by their sector
  portfolioStocks.forEach(stock => {
    if (!sectorMap.has(stock.sector)) {
      sectorMap.set(stock.sector, []);
    }
    sectorMap.get(stock.sector)!.push(stock);
  });

  // Second pass: calculate aggregated metrics for each sector
  return Array.from(sectorMap.entries()).map(([sector, stocks]) => {
    const totalInvestment = stocks.reduce((sum, stock) => sum + stock.investment, 0);
    const totalPresentValue = stocks.reduce((sum, stock) => sum + stock.presentValue, 0);
    const totalGainLoss = totalPresentValue - totalInvestment;
    const gainLossPercentage = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

    return {
      sector,
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      gainLossPercentage,
      stocks,
    };
  }).sort((a, b) => b.totalInvestment - a.totalInvestment); // Largest investments first
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(percentage: number): string {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
}

export function getGainLossColor(gainLoss: number): string {
  if (gainLoss > 0) return 'text-green-600';
  if (gainLoss < 0) return 'text-red-600';
  return 'text-gray-600';
}

export function getGainLossBgColor(gainLoss: number): string {
  if (gainLoss > 0) return 'bg-green-50';
  if (gainLoss < 0) return 'bg-red-50';
  return 'bg-gray-50';
}