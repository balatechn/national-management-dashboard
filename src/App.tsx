import { useState } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/authContext";
import LoginPage from "./components/LoginPage";
import ZohoIntegratedDashboard from "./components/ZohoIntegratedDashboard";
import PayrollDashboard from "./components/PayrollDashboard";
import AuthCallback from "./components/AuthCallback";
import { Button } from "./components/ui/button";
import { Users, DollarSign, BarChart3, UserCheck, Home } from "lucide-react";

// Main Dashboard Component (requires authentication)
function DashboardContent() {
  const [activeTab, setActiveTab] = useState<"overview" | "people" | "payroll" | "project" | "crm" | "finance" | "setup">("overview");
  const { user, logout } = useAuth();

  const modules = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "project", label: "Project", icon: BarChart3 },
    { id: "crm", label: "CRM", icon: Users },
    { id: "finance", label: "Finance", icon: DollarSign },
    { id: "people", label: "People & Payroll", icon: UserCheck },
    { id: "setup", label: "Zoho Setup", icon: Users }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <ZohoIntegratedDashboard module="overview" />;
      case "people":
        return <ZohoIntegratedDashboard module="people" />;
      case "payroll":
        return <PayrollDashboard />;
      case "project":
        return <ZohoIntegratedDashboard module="project" />;
      case "crm":
        return <ZohoIntegratedDashboard module="crm" />;
      case "finance":
        return <ZohoIntegratedDashboard module="finance" />;
      case "setup":
        return <ZohoIntegratedDashboard module="setup" />;
      default:
        return <ZohoIntegratedDashboard module="overview" />;
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
