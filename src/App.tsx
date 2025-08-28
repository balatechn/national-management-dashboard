import { useState } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/authContext";
import LoginPage from "./components/LoginPage";
import EnhancedDashboard from "./components/EnhancedDashboard";
import PayrollDashboard from "./components/PayrollDashboard";
import ZohoPeopleDashboard from "./components/ZohoPeopleDashboard";
import AuthCallback from "./components/AuthCallback";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Users, DollarSign, BarChart3, UserCheck, Home, TrendingUp, Calendar, AlertCircle } from "lucide-react";

// Overview Dashboard Component
function OverviewDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Project Overview */}
        <Card className="border-amber-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Active Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">12</div>
            <p className="text-xs text-amber-600 mt-1">+2 from last month</p>
          </CardContent>
        </Card>

        {/* CRM Overview */}
        <Card className="border-amber-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">1,247</div>
            <p className="text-xs text-amber-600 mt-1">+15% growth</p>
          </CardContent>
        </Card>

        {/* Finance Overview */}
        <Card className="border-amber-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">₹45.2L</div>
            <p className="text-xs text-amber-600 mt-1">+8% from last month</p>
          </CardContent>
        </Card>

        {/* People & Payroll Overview */}
        <Card className="border-amber-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Total Employees</CardTitle>
            <UserCheck className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">156</div>
            <p className="text-xs text-amber-600 mt-1">5 new hires this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New project "Mobile App" started</p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Payroll processed for August 2025</p>
                <p className="text-xs text-gray-600">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">5 new customer leads added</p>
                <p className="text-xs text-gray-600">2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Q2 Financial Report Due</p>
                <p className="text-xs text-gray-600">Due in 3 days</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Employee Performance Reviews</p>
                <p className="text-xs text-gray-600">Due in 1 week</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Client Presentation Prep</p>
                <p className="text-xs text-gray-600">Due in 2 weeks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
              New Project
            </Button>
            <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
              Add Customer
            </Button>
            <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
              Process Payroll
            </Button>
            <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Dashboard Component (requires authentication)
function DashboardContent() {
  const [activeTab, setActiveTab] = useState<"overview" | "people" | "payroll" | "project" | "crm" | "finance">("overview");
  const { user, logout } = useAuth();

  const modules = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "project", label: "Project", icon: BarChart3 },
    { id: "crm", label: "CRM", icon: Users },
    { id: "finance", label: "Finance", icon: DollarSign },
    { id: "people", label: "People & Payroll", icon: UserCheck }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewDashboard />;
      case "people":
        return <ZohoPeopleDashboard />;
      case "payroll":
        return <PayrollDashboard />;
      case "project":
        return <EnhancedDashboard title="Project Management" type="project" />;
      case "crm":
        return <EnhancedDashboard title="CRM Dashboard" type="crm" />;
      case "finance":
        return <EnhancedDashboard title="Finance Dashboard" type="finance" />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 border-b border-amber-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img 
                src="/national-logo.png" 
                alt="National Group" 
                className="h-12 w-auto drop-shadow-sm"
              />
              <div>
                <h1 className="text-2xl font-bold text-amber-800 drop-shadow-sm">
                  National Group Dashboard
                </h1>
                <p className="text-sm text-amber-600">Integrated Management Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-amber-700">Welcome, {user?.username}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="border-amber-300 text-amber-700 hover:bg-amber-200 hover:border-amber-400 bg-white/50"
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-t border-amber-200/60 -mb-px">
            <nav className="flex space-x-8" aria-label="Tabs">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = activeTab === module.id;
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveTab(module.id as any)}
                    className={`
                      flex items-center py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 rounded-t-lg
                      ${isActive
                        ? 'border-amber-500 text-amber-700 bg-white/70 shadow-sm'
                        : 'border-transparent text-amber-600 hover:text-amber-700 hover:border-amber-300 hover:bg-white/30'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {module.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-white via-amber-50/20 to-yellow-50/20 rounded-xl border border-amber-200 shadow-lg backdrop-blur-sm p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// Main App Component with Authentication
function AppContent() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Handle OAuth callback route
  if (location.pathname === '/auth/callback') {
    return <AuthCallback />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user?.isAuthenticated) {
    return <LoginPage />;
  }

  return <DashboardContent />;
}

// Root App Component with Authentication Provider
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
