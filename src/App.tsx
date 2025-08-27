import { useState } from "react";
import { AuthProvider, useAuth } from "./lib/authContext";
import LoginPage from "./components/LoginPage";
import EnhancedDashboard from "./components/EnhancedDashboard";
import { Button } from "./components/ui/button";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-stone-50 to-gray-200 relative overflow-hidden">
      {/* Marble-inspired Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-stone-300/30 to-gray-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-4 w-72 h-72 bg-gradient-to-r from-slate-300/30 to-stone-400/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-gradient-to-r from-gray-300/30 to-slate-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        
        {/* Marble veining effect */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="marble" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <path d="M0,100 Q50,20 100,100 T200,100" stroke="#6B7280" strokeWidth="1" fill="none" opacity="0.3"/>
                <path d="M0,150 Q80,80 160,150 T320,150" stroke="#9CA3AF" strokeWidth="0.5" fill="none" opacity="0.4"/>
                <path d="M50,0 Q100,50 150,0 T250,0" stroke="#6B7280" strokeWidth="0.8" fill="none" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#marble)"/>
          </svg>
        </div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-300/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex-1">
              <h1 className="text-4xl font-light bg-gradient-to-r from-gray-700 via-stone-600 to-gray-800 bg-clip-text text-transparent">
                National Management Dashboard
              </h1>
              <p className="text-gray-600 mt-2 font-light">
                Advanced Business Intelligence & Analytics Platform
              </p>
            </div>
            
            {/* Logo in top right */}
            <div className="flex items-center space-x-6">
              <img 
                src="/national-logo.png" 
                alt="National Group Logo" 
                className="h-14 w-auto object-contain filter drop-shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="bg-gray-200/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-300/50">
                <span className="text-gray-700 font-light">Welcome, </span>
                <span className="text-stone-600 font-medium">{user?.username}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="border-gray-400/50 text-gray-700 hover:bg-gray-200/50 backdrop-blur-sm"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-gray-300/30 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 py-6 overflow-x-auto">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveTab(module.id as any)}
                className={`group flex items-center space-x-3 px-8 py-4 rounded-2xl text-sm font-medium transition-all duration-500 whitespace-nowrap ${
                  activeTab === module.id
                    ? "bg-gradient-to-r from-stone-400/90 to-gray-500/90 text-white shadow-2xl transform scale-105 backdrop-blur-sm border border-stone-300/50"
                    : "text-gray-600 hover:bg-gray-200/60 border border-gray-300/50 hover:border-gray-400/60 backdrop-blur-sm hover:text-gray-800"
                }`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-300">{module.icon}</span>
                <span className="font-light">{module.label}</span>
                {activeTab === module.id && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="backdrop-blur-xl bg-white/80 rounded-3xl border border-gray-300/50 shadow-2xl p-8">
          {activeTab === "people" && (
            <EnhancedDashboard title="People & Payroll Management" type="people" />
          )}
          {activeTab === "project" && (
            <EnhancedDashboard title="Project Management" type="project" />
          )}
          {activeTab === "crm" && (
            <EnhancedDashboard title="Customer Relationship Management" type="crm" />
          )}
          {activeTab === "finance" && (
            <EnhancedDashboard title="Financial Management" type="finance" />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/5 backdrop-blur-xl border-t border-white/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-white/90 font-light text-lg">
              National Group India - Advanced Business Intelligence Platform
            </p>
            <p className="text-white/60 mt-2 font-light">
              Powered by Next-Generation Analytics & Machine Learning
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Main App Component with Authentication
function AppContent() {
  const { user, isLoading } = useAuth();

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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
