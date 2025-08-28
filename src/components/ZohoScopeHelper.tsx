import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

const ZohoScopeHelper: React.FC = () => {
  const [testingScope, setTestingScope] = useState<string>('');

  // Available scopes for different modules
  const availableScopes = {
    'Basic People Access': 'ZohoPeople.forms.READ',
    'Employee Data': 'ZohoPeople.employee.READ',
    'All People Data': 'ZohoPeople.employee.ALL',
    'Basic Payroll': 'ZohoPayroll.employees.READ', 
    'Projects Read': 'ZohoProjects.projects.READ',
    'CRM Read': 'ZohoCRM.modules.READ',
    'CRM All': 'ZohoCRM.modules.ALL'
  };

  const testScope = (scope: string) => {
    setTestingScope(scope);
    const clientId = '1000.FCMJ4WPDJRQ29B5N5C4GVVXOM7O5EW';
    const redirectUri = encodeURIComponent('http://localhost:3001/auth/callback');
    const authUrl = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&access_type=offline`;
    
    window.open(authUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            OAuth Scope Configuration Helper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">Current Issue:</h4>
            <p className="text-amber-700 text-sm">
              The OAuth scope "ZohoPeople.employee.ALL" might not be configured in your Zoho API Console.
              Try testing with simpler scopes first.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Test Individual Scopes:</h4>
            {Object.entries(availableScopes).map(([name, scope]) => (
              <div key={scope} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-medium">{name}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {scope}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => testScope(scope)}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Test
                </Button>
              </div>
            ))}
          </div>

          {testingScope && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <CheckCircle className="h-4 w-4 inline mr-1" />
                Testing scope: <code className="bg-blue-100 px-1 rounded">{testingScope}</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zoho API Console Setup Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <p><strong>1.</strong> Go to <a href="https://api-console.zoho.com/" target="_blank" className="text-blue-600 underline">Zoho API Console</a></p>
            <p><strong>2.</strong> Select your app: "National Management Dashboard"</p>
            <p><strong>3.</strong> Update the Redirect URI to: <code className="bg-gray-100 px-1 rounded">http://localhost:3001/auth/callback</code></p>
            <p><strong>4.</strong> In Scopes section, add these scopes one by one:</p>
            <ul className="ml-4 space-y-1">
              <li>• ZohoPeople.forms.READ</li>
              <li>• ZohoPeople.employee.READ</li>
              <li>• ZohoProjects.projects.READ</li>
              <li>• ZohoCRM.modules.READ</li>
            </ul>
            <p><strong>5.</strong> Save and test with the buttons above</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZohoScopeHelper;
