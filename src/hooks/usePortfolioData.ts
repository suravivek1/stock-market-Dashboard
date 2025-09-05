import { useState, useEffect, useCallback, useRef } from 'react';
import { Stock, PortfolioStock, SectorSummary } from '../types/portfolio';
import { mockPortfolioData } from '../data/mockPortfolio';
import { stockDataService } from '../services/stockDataService';
import { calculatePortfolioMetrics, groupBySector } from '../utils/portfolioCalculations';

export function usePortfolioData() {
  const [portfolioStocks, setPortfolioStocks] = useState<PortfolioStock[]>([]);
  const [sectorSummaries, setSectorSummaries] = useState<SectorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  // Using useRef to persist interval across re-renders
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPortfolioData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch updated stock data with current market prices
      console.log('Fetching portfolio data...'); // Debug log
      const updatedStocks = await stockDataService.fetchAllStockData(mockPortfolioData);
      
      // Run calculations on the fresh data
      const calculatedStocks = calculatePortfolioMetrics(updatedStocks);
      
      // Generate sector summaries
      const sectors = groupBySector(calculatedStocks);
      
      setPortfolioStocks(calculatedStocks);
      setSectorSummaries(sectors);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Portfolio data fetch failed:', err); // More specific error logging
      setError('Failed to fetch portfolio data. Please try again.');
      setLoading(false);
    }
  }, []);

  const startRealTimeUpdates = useCallback(() => {
    // Clear existing interval
    if (intervalRef.current) {
      console.log('Clearing existing update interval');
      clearInterval(intervalRef.current);
    }

    // Start new update cycle - 15 second intervals
    console.log('Starting real-time updates');
    intervalRef.current = setInterval(() => {
      fetchPortfolioData();
    }, 15000); // 15 seconds
  }, [fetchPortfolioData]);

  const stopRealTimeUpdates = useCallback(() => {
    if (intervalRef.current) {
      console.log('Stopping real-time updates');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Initial data fetch
    fetchPortfolioData();

    // Begin automatic updates
    startRealTimeUpdates();

    // Component cleanup
    return () => {
      stopRealTimeUpdates();
    };
  }, [fetchPortfolioData, startRealTimeUpdates, stopRealTimeUpdates]);

  const refreshData = useCallback(() => {
    setLoading(true);
    console.log('Manual refresh triggered');
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  return {
    portfolioStocks,
    sectorSummaries,
    loading,
    error,
    lastUpdate,
    refreshData,
    startRealTimeUpdates,
    stopRealTimeUpdates,
  };
}