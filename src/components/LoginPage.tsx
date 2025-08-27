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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-96 h-96 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
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
          <h1 className="text-5xl font-light bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent mb-4">
            National Management
          </h1>
          <p className="text-white/70 text-lg font-light">
            Advanced Business Intelligence Platform
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-3xl font-light text-white mb-2">Welcome Back</CardTitle>
            <CardDescription className="text-white/70 font-light">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-3">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={isLoading}
                  className="h-14 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-amber-400 focus:ring-amber-400/20 backdrop-blur-sm rounded-xl"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-3">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="h-14 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-amber-400 focus:ring-amber-400/20 backdrop-blur-sm rounded-xl"
                />
              </div>

              {error && (
                <div className="text-red-300 text-sm bg-red-500/20 p-4 rounded-xl border border-red-500/30 backdrop-blur-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-14 text-base bg-gradient-to-r from-amber-500/90 to-yellow-500/90 hover:from-amber-600 hover:to-yellow-600 text-white shadow-2xl rounded-xl font-medium transition-all duration-300 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Access Section */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/10 text-white/70 backdrop-blur-sm rounded-full">Quick Demo Access</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-12 border-white/30 text-white/90 hover:bg-white/10 backdrop-blur-sm rounded-xl font-light transition-all duration-300 hover:scale-105"
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
                  className="w-full h-12 border-white/30 text-white/90 hover:bg-white/10 backdrop-blur-sm rounded-xl font-light transition-all duration-300 hover:scale-105"
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
                  className="w-full h-12 border-white/30 text-white/90 hover:bg-white/10 backdrop-blur-sm rounded-xl font-light transition-all duration-300 hover:scale-105"
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
