# Portfolio Management Dashboard

A real-time portfolio tracking application built with React.js, TypeScript, and Tailwind CSS for monitoring stock market investments.

## Features

- **Live Market Data**: Automatic price updates every 15 seconds
- **Portfolio Analytics**: Complete investment tracking with gains/losses calculation
- **Sector Grouping**: Organize holdings by industry sectors
- **Dual View Modes**: Switch between detailed table and sector summary views
- **Visual Feedback**: Color-coded performance indicators
- **Mobile Responsive**: Works across all device sizes
- **Optimized Performance**: Smart caching and efficient data handling

## Technology Stack

- **Frontend Framework**: React.js + TypeScript
- **CSS Framework**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Icon Library**: Lucide React
- **Build System**: Vite
- **HTTP Client**: Axios + Custom Service Layer

## Development Challenges

### Financial Data APIs

The biggest challenge in this project is accessing reliable financial data:

1. **Yahoo Finance API Issues**
   - No official public API available
   - Current version uses mock data for demonstration
   - Real implementation needs:
     - Web scraping solution
     - Third-party libraries like 'yahoo-finance2'
     - Proxy server to handle CORS issues

2. **Google Finance Data**
   - No public API for P/E ratios and earnings
   - Mock data used for P/E and earnings display
   - Production needs custom scraping implementation

3. **Performance Considerations**
   - 30-second data caching to reduce API load
   - Batch processing (3 stocks per request)
   - 1-second delays between batches
   - Fallback handling for API failures

### Architecture Overview

- **PortfolioTable**: Main holdings display component
- **SectorSummary**: Expandable sector groupings
- **PortfolioSummary**: Overview metrics cards
- **UpdateIndicator**: Status display and manual refresh
- **usePortfolioData**: Custom hook for data management

## Getting Started

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd portfolio-dashboard
   npm install
   ```

2. **Development Server**
   ```bash
   npm run dev
   ```

3. **Access Application**
   - Open browser to `http://localhost:5173`
   - Dashboard will load with sample portfolio data

## Next Steps for Production

To make this production-ready:

1. **Real API Integration**
   - Implement Yahoo Finance scraping
   - Add Google Finance data extraction
   - Set up proxy server for CORS handling

2. **User Management**
   - Add authentication system
   - Personal portfolio storage
   - User preferences and settings

3. **Backend Services**
   - Database for portfolio storage
   - API rate limiting and caching
   - WebSocket connections for real-time updates

4. **Production Deployment**
   - Environment configuration
   - Error monitoring and logging
   - Performance analytics

## Known Limitations

- Mock data used for demonstration
- No user authentication
- Client-side only (no backend persistence)
- Limited to predefined stock list

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Team

Built by the Portfolio Development Team using modern React.js practices and financial industry standards.