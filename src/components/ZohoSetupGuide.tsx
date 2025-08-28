import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zohoAPI } from "@/services/zohoAPI";
import ZohoScopeHelper from "./ZohoScopeHelper";
import { CheckCircle, XCircle, AlertCircle, ExternalLink, Copy, RefreshCw } from "lucide-react";

export default function ZohoSetupGuide() {
  const [authUrl, setAuthUrl] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthUrl(zohoAPI.getAuthorizationUrl());
    setIsAuthenticated(zohoAPI.isAuthenticated());
  }, []);

  const testAPIConnection = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test People API
      try {
        await zohoAPI.getEmployees();
        results.people = { success: true, message: 'Connected successfully' };
      } catch (error: any) {
        results.people = { success: false, message: error.message };
      }

      // Test Projects API
      try {
        await zohoAPI.getProjects();
        results.projects = { success: true, message: 'Connected successfully' };
      } catch (error: any) {
        results.projects = { success: false, message: error.message };
      }

      // Test CRM API
      try {
        await zohoAPI.getCRMContacts();
        results.crm = { success: true, message: 'Connected successfully' };
      } catch (error: any) {
        results.crm = { success: false, message: error.message };
      }

      // Test Payroll API
      try {
        await zohoAPI.getPayrollSummary();
        results.payroll = { success: true, message: 'Connected successfully' };
      } catch (error: any) {
        results.payroll = { success: false, message: error.message };
      }

      setTestResults(results);
    } catch (error) {
      console.error('API test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const StatusIcon = ({ success }: { success: boolean }) => {
    if (success) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
            <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ OAuth Scope Error Fix</h3>
            <div className="text-red-700 space-y-2">
              <p><strong>Error:</strong> "Invalid OAuth Scope - Scope does not exist"</p>
              <p><strong>Solution:</strong> Configure the correct scopes in your Zoho API Console</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">🔧 Step 1: Fix Zoho API Console Scopes</h3>
            <div className="space-y-3 text-blue-700">
              <div>
                <p className="font-medium">1. Go to Zoho API Console:</p>
                <a 
                  href="https://api-console.zoho.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  https://api-console.zoho.com/
                </a>
              </div>
              
              <div>
                <p className="font-medium">2. Select your application → Go to "Scopes" tab</p>
              </div>
              
              <div>
                <p className="font-medium">3. Add these scopes (start with minimal):</p>
                <div className="bg-white p-3 rounded border mt-2">
                  <p className="font-mono text-sm"><strong>Minimal (Start Here):</strong></p>
                  <code className="block bg-gray-100 p-2 rounded mt-1 text-xs">ZohoPeople.forms.READ</code>
                  
                  <p className="font-mono text-sm mt-3"><strong>Basic (After minimal works):</strong></p>
                  <code className="block bg-gray-100 p-2 rounded mt-1 text-xs">
                    ZohoPeople.employee.READ<br/>
                    ZohoPayroll.employees.READ
                  </code>
                  
                  <p className="font-mono text-sm mt-3"><strong>Extended (Final goal):</strong></p>
                  <code className="block bg-gray-100 p-2 rounded mt-1 text-xs">
                    ZohoPeople.employee.READ<br/>
                    ZohoPayroll.employees.READ<br/>
                    ZohoProjects.projects.READ<br/>
                    ZohoCRM.modules.READ
                  </code>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-3">🎯 Step 2: Test Different Scope Modes</h3>
            <div className="space-y-3 text-green-700">
              <p>Add this to your <code>.env</code> file to test different scopes:</p>
              <div className="bg-white p-3 rounded border">
                <code className="block text-sm">
                  # Start with minimal scope<br/>
                  VITE_ZOHO_SCOPE_MODE=minimal<br/><br/>
                  
                  # After minimal works, try basic<br/>
                  # VITE_ZOHO_SCOPE_MODE=basic<br/><br/>
                  
                  # After basic works, try extended<br/>
                  # VITE_ZOHO_SCOPE_MODE=extended
                </code>
              </div>
            </div>
          </div>
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            Zoho API Integration Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <StatusIcon success={isAuthenticated} />
              <div>
                <h3 className="font-medium">Authentication Status</h3>
                <p className="text-sm text-gray-600">
                  {isAuthenticated ? 'Connected to Zoho' : 'Not authenticated'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-medium">API Configuration</h3>
                <p className="text-sm text-gray-600">
                  Environment variables configured
                </p>
              </div>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="space-y-3">
            <h3 className="font-medium text-amber-800">Environment Variables Required:</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm font-mono">
              <div className="flex items-center justify-between">
                <span>VITE_ZOHO_CLIENT_ID=1000.FCMJ4WPDJRQ29B5N5C4GVVXOM7O5EW</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => copyToClipboard('VITE_ZOHO_CLIENT_ID=1000.FCMJ4WPDJRQ29B5N5C4GVVXOM7O5EW')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>VITE_ZOHO_CLIENT_SECRET=b26ee4e0b733c916730af00f6e37a5bd1201024f79</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => copyToClipboard('VITE_ZOHO_CLIENT_SECRET=b26ee4e0b733c916730af00f6e37a5bd1201024f79')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>VITE_ZOHO_REDIRECT_URI=https://your-site.netlify.app/auth/callback</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => copyToClipboard('VITE_ZOHO_REDIRECT_URI=https://your-site.netlify.app/auth/callback')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Authentication */}
          {!isAuthenticated && (
            <div className="space-y-3">
              <h3 className="font-medium text-amber-800">Step 1: Authenticate with Zoho</h3>
              <p className="text-sm text-gray-600">
                Click the button below to authorize this application to access your Zoho data.
              </p>
              <Button 
                onClick={() => window.open(authUrl, '_blank')}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Authorize with Zoho
              </Button>
            </div>
          )}

          {/* API Testing */}
          {isAuthenticated && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-amber-800">Step 2: Test API Connections</h3>
                <Button 
                  onClick={testAPIConnection} 
                  disabled={loading}
                  variant="outline"
                  className="border-amber-300 text-amber-700"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Testing...' : 'Test All APIs'}
                </Button>
              </div>

              {Object.keys(testResults).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(testResults).map(([api, result]: [string, any]) => (
                    <div key={api} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <StatusIcon success={result.success} />
                      <div>
                        <h4 className="font-medium capitalize">{api} API</h4>
                        <p className="text-sm text-gray-600">{result.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Setup Instructions */}
          <div className="space-y-3">
            <h3 className="font-medium text-amber-800">Zoho Setup Instructions:</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-start space-x-2">
                <span className="font-medium">1.</span>
                <span>Go to <a href="https://api-console.zoho.com/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">Zoho API Console</a></span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">2.</span>
                <span>Create a new application and get Client ID & Secret</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">3.</span>
                <span>Set redirect URI to your deployment URL + /auth/callback</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">4.</span>
                <span>Add the environment variables to your .env file or Netlify settings</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">5.</span>
                <span>Deploy and test the authentication flow</span>
              </div>
            </div>
          </div>

          {/* Scopes Information */}
          <div className="space-y-3">
            <h3 className="font-medium text-amber-800">Required Zoho Scopes:</h3>
            <div className="bg-amber-50 p-4 rounded-lg">
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• ZohoPeople.employee.ALL - Employee data access</li>
                <li>• ZohoPayroll.employees.ALL - Payroll data access</li>
                <li>• ZohoProjects.projects.ALL - Project data access</li>
                <li>• ZohoCRM.modules.ALL - CRM data access</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scope Helper */}
      <ZohoScopeHelper />
    </div>
  );
}
