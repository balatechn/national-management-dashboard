import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertCircle, ExternalLink, CheckCircle } from 'lucide-react';

const ZohoQuickFix: React.FC = () => {
  const basicAuthUrl = () => {
    const clientId = '1000.FCMJ4WPDJRQ29B5N5C4GVVXOM7O5EW';
    const redirectUri = encodeURIComponent('http://localhost:3001/auth/callback');
    const scope = 'ZohoPeople.forms.READ'; // Most basic scope
    
    return `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&access_type=offline`;
  };

  const testBasicAuth = () => {
    window.open(basicAuthUrl(), '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Error Fix Section */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            OAuth Error Fix
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-white border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Current Issue:</h4>
            <p className="text-red-700 text-sm">
              "An error occurred while processing your request" - This happens when OAuth scopes 
              are not properly configured in your Zoho API Console.
            </p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Quick Fix:</h4>
            <p className="text-blue-700 text-sm mb-3">
              Test with the most basic scope first: <Badge variant="secondary">ZohoPeople.forms.READ</Badge>
            </p>
            <Button 
              onClick={testBasicAuth}
              className="flex items-center gap-2"
              variant="outline"
            >
              <ExternalLink className="h-4 w-4" />
              Test Basic OAuth
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Required Zoho API Console Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <h4 className="font-semibold text-gray-800">Step 1: Update Zoho API Console</h4>
            <div className="pl-4 space-y-1">
              <p>• Go to: <a href="https://api-console.zoho.com/" target="_blank" className="text-blue-600 underline">https://api-console.zoho.com/</a></p>
              <p>• Select your app: "National Management Dashboard"</p>
              <p>• Update Redirect URI to: <code className="bg-gray-100 px-1 rounded">http://localhost:3001/auth/callback</code></p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <h4 className="font-semibold text-gray-800">Step 2: Add Basic Scope</h4>
            <div className="pl-4 space-y-1">
              <p>• In your app settings, go to "Scopes" section</p>
              <p>• Add this scope: <Badge variant="secondary" className="mx-1">ZohoPeople.forms.READ</Badge></p>
              <p>• Save the configuration</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <h4 className="font-semibold text-gray-800">Step 3: Test Authentication</h4>
            <div className="pl-4 space-y-1">
              <p>• Click "Test Basic OAuth" button above</p>
              <p>• Complete the authorization flow</p>
              <p>• If successful, you can add more scopes gradually</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium">Client ID:</span>
            <Badge variant="outline">1000.FCMJ4WPDJRQ29B5N5C4GVVXOM7O5EW</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium">Redirect URI:</span>
            <Badge variant="outline">http://localhost:3001/auth/callback</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium">Current Scope:</span>
            <Badge variant="secondary">ZohoPeople.forms.READ</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Success Indicators */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Once Working, You Can Add More Scopes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm text-green-700">
            <p>• ZohoPeople.employee.READ - Employee details</p>
            <p>• ZohoPayroll.employees.READ - Payroll data</p>
            <p>• ZohoProjects.projects.READ - Project information</p>
            <p>• ZohoCRM.modules.READ - CRM data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZohoQuickFix;
