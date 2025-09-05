import { Stock, ApiResponse } from '../types/portfolio';

class StockDataService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 30000; // TODO: Make this configurable

  private getFromCache(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // FIXME: This should be moved to a config file
  private generateRealisticPrice(basePrice: number): number {
    const variation = (Math.random() - 0.5) * 0.1; // ±5%
    return Math.round(basePrice * (1 + variation) * 100) / 100;
  }

  private generateRealisticPE(): number {
    // P/E ratios typically range from 10-40 for most stocks
    return Math.round((Math.random() * 30 + 10) * 100) / 100;
  }

  private generateEarnings(): string {
    // Mock earnings - replace with real API call
    const earnings = [
      "₹45.2 per share (Q3 2024)",
      "₹67.8 per share (Q3 2024)", 
      "₹23.4 per share (Q3 2024)",
      "₹89.1 per share (Q3 2024)",
      "₹12.6 per share (Q3 2024)",
    ];
    return earnings[Math.floor(Math.random() * earnings.length)];
  }

  async fetchYahooFinanceData(symbol: string): Promise<ApiResponse<{ cmp: number }>> {
    const cacheKey = `yahoo-${symbol}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return { success: true, data: cached };
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
      
      // NOTE: Yahoo Finance API is unofficial - need to implement proper scraping
      // Consider using yahoo-finance2 npm package or building custom scraper
      const basePrice = Math.random() * 4000 + 100;
      const cmp = this.generateRealisticPrice(basePrice);
      
      const data = { cmp };
      this.setCache(cacheKey, data);
      
      return { success: true, data };
    } catch (error) {
      console.error(`Failed to fetch Yahoo Finance data for ${symbol}:`, error);
      // TODO: Implement retry logic here
      return { 
        success: false, 
        error: `Failed to fetch current market price for ${symbol}` 
      };
    }
  }

  async fetchGoogleFinanceData(symbol: string): Promise<ApiResponse<{ peRatio: number; latestEarnings: string }>> {
    const cacheKey = `google-${symbol}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return { success: true, data: cached };
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
      
      // Google Finance scraping implementation needed here
      // Research: Check if Google Finance has any unofficial APIs
      const peRatio = this.generateRealisticPE();
      const latestEarnings = this.generateEarnings();
      
      const data = { peRatio, latestEarnings };
      this.setCache(cacheKey, data);
      
      return { success: true, data };
    } catch (error) {
      console.error(`Failed to fetch Google Finance data for ${symbol}:`, error);
      return { 
        success: false, 
        error: `Failed to fetch P/E ratio and earnings for ${symbol}` 
      };
    }
  }

  async fetchStockData(stock: Stock): Promise<Stock & { cmp?: number; peRatio?: number; latestEarnings?: string }> {
    try {
      const [yahooResponse, googleResponse] = await Promise.allSettled([
        this.fetchYahooFinanceData(stock.symbol),
        this.fetchGoogleFinanceData(stock.symbol)
      ]);

      let cmp = stock.purchasePrice; // fallback to purchase price
      let peRatio: number | undefined;
      let latestEarnings: string | undefined;

      if (yahooResponse.status === 'fulfilled' && yahooResponse.value.success) {
        cmp = yahooResponse.value.data!.cmp;
      }

      if (googleResponse.status === 'fulfilled' && googleResponse.value.success) {
        peRatio = googleResponse.value.data!.peRatio;
        latestEarnings = googleResponse.value.data!.latestEarnings;
      }

      return {
        ...stock,
        cmp,
        peRatio,
        latestEarnings,
      };
    } catch (error) {
      console.error(`Error fetching data for ${stock.symbol}:`, error);
      return {
        ...stock,
        cmp: stock.purchasePrice, // fallback to purchase price if API fails
      };
    }
  }

  async fetchAllStockData(stocks: Stock[]): Promise<Stock[]> {
    // Process in batches to avoid overwhelming the APIs
    const batchSize = 3;
    const results: Stock[] = [];
    
    for (let i = 0; i < stocks.length; i += batchSize) {
      const batch = stocks.slice(i, i + batchSize);
      const batchPromises = batch.map(stock => this.fetchStockData(stock));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Delay between batches - might need to adjust based on API limits
      if (i + batchSize < stocks.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

export const stockDataService = new StockDataService();