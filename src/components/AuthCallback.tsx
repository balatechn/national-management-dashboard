import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AuthCallbackProps {
  onAuthComplete?: (token: string) => void;
}

const AuthCallback: React.FC<AuthCallbackProps> = ({ onAuthComplete }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authorization...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`Authorization failed: ${error}`);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received');
          return;
        }

        // Exchange the code for access token
        const clientId = import.meta.env.VITE_ZOHO_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_ZOHO_CLIENT_SECRET;
        const redirectUri = import.meta.env.VITE_ZOHO_REDIRECT_URI;

        const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code: code,
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.access_token) {
          // Store the tokens in localStorage
          localStorage.setItem('zoho_access_token', tokenData.access_token);
          if (tokenData.refresh_token) {
            localStorage.setItem('zoho_refresh_token', tokenData.refresh_token);
          }
          
          setStatus('success');
          setMessage('Authorization successful! You can now close this window.');
          
          // Notify parent component
          if (onAuthComplete) {
            onAuthComplete(tokenData.access_token);
          }

          // Auto-close after 3 seconds
          setTimeout(() => {
            window.close();
          }, 3000);
        } else {
          setStatus('error');
          setMessage(`Token exchange failed: ${tokenData.error || 'Unknown error'}`);
        }
      } catch (error) {
        setStatus('error');
        setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    handleCallback();
  }, [onAuthComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'loading' && '🔄 Processing Authorization'}
            {status === 'success' && '✅ Authorization Complete'}
            {status === 'error' && '❌ Authorization Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className={`${
              status === 'success' ? 'text-green-600' : 
              status === 'error' ? 'text-red-600' : 'text-blue-600'
            }`}>
              {message}
            </p>
            
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            )}
            
            {status === 'success' && (
              <div className="text-sm text-gray-600">
                This window will close automatically...
              </div>
            )}
            
            {status === 'error' && (
              <button 
                onClick={() => window.close()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Close Window
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
