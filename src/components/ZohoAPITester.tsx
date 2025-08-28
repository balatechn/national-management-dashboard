import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { zohoAPI } from '../services/zohoAPI';

interface TestResult {
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

const ZohoAPITester: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [authUrl, setAuthUrl] = useState<string>('');
  const [testMode, setTestMode] = useState(false);

  // Initialize tests
  const initializeTests = () => {
    setTestResults([
      { test: '🔐 Environment Variables', status: 'pending', message: 'Checking configuration...' },
      { test: '🌐 OAuth URL Generation', status: 'pending', message: 'Generating authorization URL...' },
      { test: '🔍 Authentication Status', status: 'pending', message: 'Checking current auth status...' },
      { test: '🔗 API Connection Test', status: 'pending', message: 'Testing API connectivity...' },
    ]);
  };

  // Update test result
  const updateTestResult = (testName: string, status: 'success' | 'error', message: string, data?: any) => {
    setTestResults(prev => prev.map(result => 
      result.test === testName 
        ? { ...result, status, message, data }
        : result
    ));
  };

  // Test environment variables
  const testEnvironmentVariables = async () => {
    try {
      const clientId = import.meta.env.VITE_ZOHO_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_ZOHO_CLIENT_SECRET;
      const redirectUri = import.meta.env.VITE_ZOHO_REDIRECT_URI;

      const envData = {
        clientId: clientId ? `${clientId.substring(0, 10)}...` : 'Missing',
        clientSecret: clientSecret ? `${clientSecret.substring(0, 10)}...` : 'Missing',
        redirectUri: redirectUri || 'Missing'
      };

      if (clientId && clientSecret && redirectUri) {
        updateTestResult('🔐 Environment Variables', 'success', 'All environment variables configured correctly', envData);
        return true;
      } else {
        updateTestResult('🔐 Environment Variables', 'error', 'Missing required environment variables', envData);
        return false;
      }
    } catch (error) {
      updateTestResult('🔐 Environment Variables', 'error', `Error: ${error}`);
      return false;
    }
  };

  // Test OAuth URL generation
  const testOAuthUrl = async () => {
    try {
      const url = zohoAPI.getAuthorizationUrl();
      setAuthUrl(url);
      updateTestResult('🌐 OAuth URL Generation', 'success', 'Authorization URL generated successfully', { url: url.substring(0, 100) + '...' });
      return true;
    } catch (error) {
      updateTestResult('🌐 OAuth URL Generation', 'error', `Error: ${error}`);
      return false;
    }
  };

  // Test authentication status
  const testAuthStatus = async () => {
    try {
      if (testMode) {
        // Test mode: simulate authentication
        updateTestResult('🔍 Authentication Status', 'success', 
          'Test Mode: Simulated authentication successful', 
          { 
            authenticated: true,
            hasAccessToken: true,
            hasRefreshToken: true,
            testMode: true
          }
        );
        return true;
      } else {
        // Real authentication check
        const isAuth = zohoAPI.isAuthenticated();
        const token = localStorage.getItem('zoho_access_token');
        const refreshToken = localStorage.getItem('zoho_refresh_token');

        updateTestResult('🔍 Authentication Status', isAuth ? 'success' : 'error', 
          isAuth ? 'User is authenticated' : 'User not authenticated', 
          { 
            authenticated: isAuth,
            hasAccessToken: !!token,
            hasRefreshToken: !!refreshToken
          }
        );
        return isAuth;
      }
    } catch (error) {
      updateTestResult('🔍 Authentication Status', 'error', `Error: ${error}`);
      return false;
    }
  };

  // Test API connection (this will fail until OAuth is complete)
  const testAPIConnection = async () => {
    try {
      if (testMode) {
        // Test mode: simulate API connection
        const mockData = {
          peopleAPI: { connected: true, employeesCount: 142 },
          payrollAPI: { connected: true, recordsCount: 89 },
          projectsAPI: { connected: true, projectsCount: 25 }
        };
        updateTestResult('🔗 API Connection Test', 'success', 'Test Mode: All APIs connected successfully', mockData);
        return true;
      } else {
        // Real API connection test
        if (!zohoAPI.isAuthenticated()) {
          updateTestResult('🔗 API Connection Test', 'error', 'Cannot test API - user not authenticated');
          return false;
        }

        // Try to fetch employees (this will trigger authentication flow)
        const employees = await zohoAPI.getEmployees();
        updateTestResult('🔗 API Connection Test', 'success', `Successfully connected! Found ${employees.length} employees`, { count: employees.length });
        return true;
      }
    } catch (error: any) {
      if (error.message?.includes('No access token')) {
        updateTestResult('🔗 API Connection Test', 'error', 'No access token - OAuth flow required');
      } else {
        updateTestResult('🔗 API Connection Test', 'error', `API Error: ${error.message || error}`);
      }
      return false;
    }
  };

  // Run all tests
  const runTests = async () => {
    setIsRunning(true);
    initializeTests();

    // Wait a bit for UI to update
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 1: Environment Variables
    const envTest = await testEnvironmentVariables();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: OAuth URL (only if env vars are good)
    if (envTest) {
      await testOAuthUrl();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Test 3: Auth Status
    await testAuthStatus();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 4: API Connection
    await testAPIConnection();

    setIsRunning(false);
  };
  // Start OAuth flow
  const startOAuthFlow = () => {
    if (authUrl) {
      window.open(authUrl, '_blank', 'width=500,height=600');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '⏳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <span className="text-2xl">🧪</span>
          <span>Zoho API Integration Tester</span>
        </CardTitle>
        <CardDescription>
          Test your Zoho API Console configuration and authentication flow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Mode Banner */}
        {testMode && (
          <div className="bg-purple-100 border border-purple-300 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🧪</span>
              <div>
                <h3 className="font-semibold text-purple-800">Test Mode Active</h3>
                <p className="text-sm text-purple-700">
                  OAuth authentication is bypassed. API calls will return mock data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* API Configuration Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">🔧 Current API Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Client ID:</span>
              <br />
              <code className="bg-blue-100 px-2 py-1 rounded text-xs">1000.FCMJ4WPDJRQ29B5N5C4GVVXOM7O5EW</code>
            </div>
            <div>
              <span className="font-medium">Client Secret:</span>
              <br />
              <code className="bg-blue-100 px-2 py-1 rounded text-xs">b26ee4e0b733...1201024f79</code>
            </div>
            <div>
              <span className="font-medium">Redirect URI:</span>
              <br />
              <code className="bg-blue-100 px-2 py-1 rounded text-xs">http://localhost:3000/auth/callback</code>
            </div>
            <div>
              <span className="font-medium">Scopes:</span>
              <br />
              <code className="bg-blue-100 px-2 py-1 rounded text-xs">ZohoPeople.employee.ALL,ZohoPayroll.employees.ALL</code>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex space-x-4">
          <Button 
            onClick={() => setTestMode(!testMode)}
            variant={testMode ? "default" : "outline"}
            className={testMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "border-purple-300 text-purple-700 hover:bg-purple-50"}
          >
            🧪 {testMode ? 'Exit Test Mode' : 'Test Mode'}
          </Button>

          <Button 
            onClick={runTests}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? '🔄 Testing...' : '🚀 Run Tests'}
          </Button>
          
          {authUrl && (
            <Button 
              onClick={startOAuthFlow}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              🔐 Start OAuth Flow
            </Button>
          )}
          
          <Button 
            onClick={() => {
              // Refresh test results to check new auth status
              runTests();
            }}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            🔄 Refresh Status
          </Button>

          <Button 
            onClick={() => {
              // Clear stored tokens for testing
              localStorage.removeItem('zoho_access_token');
              localStorage.removeItem('zoho_refresh_token');
              runTests();
            }}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            🗑️ Clear Tokens
          </Button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Test Results:</h3>
            {testResults.map((result, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getStatusIcon(result.status)}</span>
                    <span className="font-medium">{result.test}</span>
                  </div>
                  <span className="text-sm font-medium">{result.status.toUpperCase()}</span>
                </div>
                <p className="mt-2 text-sm">{result.message}</p>
                {result.data && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer">View Details</summary>
                    <pre className="mt-2 text-xs bg-white/50 p-2 rounded overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Next Steps Guide */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-800 mb-2">📋 Testing Options</h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-amber-700">🧪 Test Mode (No OAuth Required)</h4>
              <ol className="list-decimal list-inside text-sm text-amber-700 space-y-1 ml-4">
                <li>Click "🧪 Test Mode" to enable simulation mode</li>
                <li>Click "🚀 Run Tests" to see simulated results</li>
                <li>All tests will pass with mock data</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-amber-700">🔐 Real OAuth Flow</h4>
              <ol className="list-decimal list-inside text-sm text-amber-700 space-y-1 ml-4">
                <li>Ensure Test Mode is OFF</li>
                <li>Click "🚀 Run Tests" to check configuration</li>
                <li>If environment variables pass, click "Start OAuth Flow"</li>
                <li>Complete OAuth authorization in popup window</li>
                <li>Return here to see real API connection results</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">🔧 Troubleshooting</h3>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            <li><strong>Environment Variables Missing:</strong> Check your .env file is properly configured</li>
            <li><strong>OAuth Flow Fails:</strong> Verify redirect URI is registered in Zoho Console</li>
            <li><strong>API Connection Error:</strong> Check your Zoho account permissions and scopes</li>
            <li><strong>CORS Issues:</strong> Make sure you're running from localhost:3000</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZohoAPITester;
