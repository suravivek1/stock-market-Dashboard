import React, { useState } from 'react';
import PortfolioTable from './components/PortfolioTable';
import PortfolioSummary from './components/PortfolioSummary';
import SectorSummary from './components/SectorSummary';
import UpdateIndicator from './components/UpdateIndicator';
import { usePortfolioData } from './hooks/usePortfolioData';
import { BarChart3, PieChart, Table, Briefcase } from 'lucide-react';

function App() {
  const {
    portfolioStocks,
    sectorSummaries,
    loading,
    error,
    lastUpdate,
    refreshData,
  } = usePortfolioData();

  const [activeView, setActiveView] = useState<'table' | 'sectors'>('table');
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set());

  // Handle sector expansion/collapse
  const toggleSector = (sector: string) => {
    const newExpanded = new Set(expandedSectors);
    if (newExpanded.has(sector)) {
      newExpanded.delete(sector);
    } else {
      newExpanded.add(sector);
    }
    setExpandedSectors(newExpanded);
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Main Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Portfolio Dashboard</h1>
                <p className="text-sm text-gray-500">Live market tracking system</p>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setActiveView('table')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-150 ${
                  activeView === 'table' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Table className="w-4 h-4" />
                <span>Table View</span>
              </button>
              
              <button
                onClick={() => setActiveView('sectors')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-150 ${
                  activeView === 'sectors' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <PieChart className="w-4 h-4" />
                <span>Sectors</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards Section */}
        <PortfolioSummary stocks={portfolioStocks} />
        
        {/* Status and Refresh Controls */}
        <UpdateIndicator 
          lastUpdate={lastUpdate}
          loading={loading}
          error={error}
          onRefresh={refreshData}
        />

        {/* Main Data Display */}
        {activeView === 'table' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Current Holdings</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <BarChart3 className="w-4 h-4" />
                <span>{portfolioStocks.length} stocks</span>
              </div>
            </div>
            <PortfolioTable stocks={portfolioStocks} loading={loading} />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sector Breakdown</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <PieChart className="w-4 h-4" />
                <span>{sectorSummaries.length} sectors</span>
              </div>
            </div>
            <SectorSummary 
              sectors={sectorSummaries}
              expandedSectors={expandedSectors}
              onToggleSector={toggleSector}
            />
          </div>
        )}

        {/* Development Notes - Remove in production */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-3">Development Status</h3>
          <div className="space-y-2 text-sm text-amber-700">
            <p>• <strong>Data Source:</strong> Currently using mock data. Need to implement actual Yahoo Finance scraping.</p>
            <p>• <strong>API Integration:</strong> P/E ratios and earnings data require Google Finance integration.</p>
            <p>• <strong>Performance:</strong> Caching implemented but may need optimization for large portfolios.</p>
            <p>• <strong>Updates:</strong> 15-second refresh cycle - consider WebSocket implementation for better performance.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;