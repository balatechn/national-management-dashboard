import { useState  const modules = [
    { id: "project", label: "Project", icon: BarChart3 },
    { id: "crm", label: "CRM", icon: Users },
    { id: "finance", label: "Finance", icon: DollarSign },
    { id: "people", label: "People & Payroll", icon: UserCheck }
  ];m "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/authContext";
import LoginPage from "./components/LoginPage";
import EnhancedDashboard from "./components/EnhancedDashboard";
import PayrollDashboard from "./components/PayrollDashboard";
import ZohoPeopleDashboard from "./components/ZohoPeopleDashboard";
import CSVUpload from "./components/CSVUpload";
import AuthCallback from "./components/AuthCallback";
import { Button } from "./components/ui/button";
import { Users, DollarSign, BarChart3, UserCheck } from "lucide-react";

// Main Dashboard Component (requires authentication)
function DashboardContent() {
  const [activeTab, setActiveTab] = useState<"people" | "payroll" | "project" | "crm" | "finance">("project");
  const { user, logout } = useAuth();

  const modules = [
    { id: "project", label: "Project", icon: "�" },
    { id: "crm", label: "CRM", icon: "🤝" },
    { id: "finance", label: "Finance", icon: "💰" },
    { id: "people", label: "People & Payroll", icon: "�" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="relative z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Project Management Dashboard
              </h1>
              <p className="text-sm text-gray-600">National Group India</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.username}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <EnhancedDashboard title="Project Management" type="project" />
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
