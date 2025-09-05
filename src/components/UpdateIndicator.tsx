import React, { memo } from 'react';
import { RefreshCw, Clock, AlertCircle } from 'lucide-react';

interface UpdateIndicatorProps {
  lastUpdate: Date | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const UpdateIndicator = memo<UpdateIndicatorProps>(({ 
  lastUpdate, 
  loading, 
  error, 
  onRefresh 
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {lastUpdate ? `Last sync: ${formatTime(lastUpdate)}` : 'Initializing...'}
            </span>
          </div>
          
          {error && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-sm text-gray-600">
              {loading ? 'Syncing...' : 'Live (15s auto-refresh)'}
            </span>
          </div>
          
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Sync Now</span>
          </button>
        </div>
      </div>
    </div>
  );
});

UpdateIndicator.displayName = 'UpdateIndicator';

export default UpdateIndicator;