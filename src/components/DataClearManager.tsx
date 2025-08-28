import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const DataClearManager: React.FC = () => {
  const clearAllData = () => {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Reload the page to reset all state
    window.location.reload();
  };

  const clearZohoData = () => {
    // Clear only Zoho-related data
    localStorage.removeItem('zoho_access_token');
    localStorage.removeItem('zoho_refresh_token');
    localStorage.removeItem('zoho_user_data');
    localStorage.removeItem('zoho_organization_data');
    
    alert('Zoho authentication data cleared');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-red-700">🗑️ Data Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800">Clear Data Options</h3>
          <p className="text-sm text-gray-600">
            Choose what data to clear from the application
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={clearZohoData}
            variant="outline"
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            Clear Zoho Auth Data Only
          </Button>
          
          <Button 
            onClick={clearAllData}
            variant="destructive"
            className="w-full"
          >
            Clear All Data & Reload
          </Button>
        </div>
        
        <div className="text-xs text-gray-500">
          <p><strong>Zoho Only:</strong> Clears authentication tokens</p>
          <p><strong>All Data:</strong> Clears everything and reloads app</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataClearManager;
