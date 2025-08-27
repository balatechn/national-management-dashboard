import React, { useState } from 'react';
import { useAuth, UserRole } from '../lib/authContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError('');
    let demoUsername = '';
    let demoPassword = '';

    switch (role) {
      case UserRole.VIEWER:
        demoUsername = 'viewer';
        demoPassword = 'viewer123';
        break;
      case UserRole.INTERACTIVE:
        demoUsername = 'manager';
        demoPassword = 'manager123';
        break;
      case UserRole.ADMIN:
        demoUsername = 'admin';
        demoPassword = 'admin123';
        break;
    }

    try {
      const success = await login(demoUsername, demoPassword);
      if (!success) {
        setError('Demo login failed');
      }
    } catch (err) {
      setError('Demo login failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-stone-50 to-gray-200 relative overflow-hidden flex items-center justify-center p-4">
      {/* Marble-inspired Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-96 h-96 bg-gradient-to-r from-stone-300/30 to-gray-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-4 w-96 h-96 bg-gradient-to-r from-slate-300/30 to-stone-400/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-gradient-to-r from-gray-300/30 to-slate-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        
        {/* Marble veining effect */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="marble-login" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <path d="M0,100 Q50,20 100,100 T200,100" stroke="#6B7280" strokeWidth="1" fill="none" opacity="0.3"/>
                <path d="M0,150 Q80,80 160,150 T320,150" stroke="#9CA3AF" strokeWidth="0.5" fill="none" opacity="0.4"/>
                <path d="M50,0 Q100,50 150,0 T250,0" stroke="#6B7280" strokeWidth="0.8" fill="none" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#marble-login)"/>
          </svg>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src="/national-logo.png" 
            alt="National Group Logo" 
            className="h-20 w-auto mx-auto mb-6 filter drop-shadow-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="text-5xl font-light bg-gradient-to-r from-gray-700 via-stone-600 to-gray-800 bg-clip-text text-transparent mb-4">
            National Management
          </h1>
          <p className="text-gray-600 text-lg font-light">
            Advanced Business Intelligence Platform
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/90 backdrop-blur-xl border border-gray-300/50 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-3xl font-light text-gray-800 mb-2">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600 font-light">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-3">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={isLoading}
                  className="h-14 bg-white/80 border-gray-300/50 text-gray-800 placeholder:text-gray-500 focus:border-stone-400 focus:ring-stone-400/20 backdrop-blur-sm rounded-xl"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-3">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="h-14 bg-white/80 border-gray-300/50 text-gray-800 placeholder:text-gray-500 focus:border-stone-400 focus:ring-stone-400/20 backdrop-blur-sm rounded-xl"
                />
              </div>

              {error && (
                <div className="text-red-700 text-sm bg-red-100/80 p-4 rounded-xl border border-red-300/50 backdrop-blur-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-14 text-base bg-gradient-to-r from-stone-500/90 to-gray-600/90 hover:from-stone-600 hover:to-gray-700 text-white shadow-2xl rounded-xl font-medium transition-all duration-300 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Access Section */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/90 text-gray-600 backdrop-blur-sm rounded-full">Quick Demo Access</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-300/50 text-gray-700 hover:bg-gray-100/60 backdrop-blur-sm rounded-xl font-light transition-all duration-300 hover:scale-105"
                  onClick={() => handleDemoLogin(UserRole.VIEWER)}
                  disabled={isLoading}
                >
                  <span className="text-lg mr-3">🔍</span>
                  <div className="text-left">
                    <div className="font-medium">Viewer Access</div>
                    <div className="text-xs opacity-70">Read-only dashboard</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-300/50 text-gray-700 hover:bg-gray-100/60 backdrop-blur-sm rounded-xl font-light transition-all duration-300 hover:scale-105"
                  onClick={() => handleDemoLogin(UserRole.INTERACTIVE)}
                  disabled={isLoading}
                >
                  <span className="text-lg mr-3">📊</span>
                  <div className="text-left">
                    <div className="font-medium">Manager Access</div>
                    <div className="text-xs opacity-70">Interactive analytics</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-300/50 text-gray-700 hover:bg-gray-100/60 backdrop-blur-sm rounded-xl font-light transition-all duration-300 hover:scale-105"
                  onClick={() => handleDemoLogin(UserRole.ADMIN)}
                  disabled={isLoading}
                >
                  <span className="text-lg mr-3">⚙️</span>
                  <div className="text-left">
                    <div className="font-medium">Admin Access</div>
                    <div className="text-xs opacity-70">Full control panel</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-md border border-amber-200">
              <p className="text-sm text-amber-800 text-center">
                <strong>Demo Credentials:</strong><br />
                viewer/viewer123 • manager/manager123 • admin/admin123
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-amber-700">
          <p>© 2025 National Group India</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
