// Core data types for portfolio management system

export interface Stock {
  id: string;
  particulars: string;
  purchasePrice: number;
  quantity: number;
  sector: string;
  exchange: 'NSE' | 'BSE';
  symbol: string;
  // Optional market data (fetched from APIs)
  cmp?: number;
  peRatio?: number;
  latestEarnings?: string;
}

// Extended stock interface with calculated portfolio metrics
export interface PortfolioStock extends Stock {
  investment: number;
  portfolioPercentage: number;
  presentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
}

// Sector-level aggregation interface
export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  gainLossPercentage: number;
  stocks: PortfolioStock[];
}

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}