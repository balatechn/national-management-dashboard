import { useState } from "react";
import { AuthProvider, useAuth } from "./lib/authContext";
import LoginPage from "./components/LoginPage";
import EnhancedDashboard from "./components/EnhancedDashboard";
import CSVUpload from "./components/CSVUpload";
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 relative overflow-hidden">
      {/* Gold-inspired Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-amber-300/40 to-yellow-300/40 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-4 w-72 h-72 bg-gradient-to-r from-yellow-300/40 to-orange-300/40 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-gradient-to-r from-orange-300/40 to-amber-300/40 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        
        {/* Gold shimmer effect */}
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gold-shimmer" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0,50 Q25,10 50,50 T100,50" stroke="#F59E0B" strokeWidth="0.5" fill="none" opacity="0.6"/>
                <path d="M0,75 Q40,40 80,75 T160,75" stroke="#FBBF24" strokeWidth="0.3" fill="none" opacity="0.4"/>
                <circle cx="20" cy="20" r="1" fill="#F59E0B" opacity="0.8"/>
                <circle cx="70" cy="70" r="0.5" fill="#FBBF24" opacity="0.6"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gold-shimmer)"/>
          </svg>
        </div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-amber-500/95 via-yellow-500/95 to-orange-500/95 backdrop-blur-xl border-b border-amber-300/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex-1">
              <h1 className="text-6xl font-display font-bold text-white tracking-normal drop-shadow-2xl filter brightness-110 antialiased animate-fadeInUp">
                Management Dashboard
              </h1>
              <p className="text-amber-50 mt-4 font-serif font-medium text-xl tracking-wide drop-shadow-lg antialiased animate-fadeInUp animation-delay-200">
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
              <div className="bg-gradient-to-r from-amber-100/90 to-yellow-100/90 backdrop-blur-lg px-6 py-3 rounded-2xl border border-amber-200/60 shadow-xl">
                <span className="text-amber-800 font-light text-lg tracking-wide">Welcome, </span>
                <span className="text-amber-900 font-semibold text-lg tracking-wide bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">{user?.username}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="border-amber-300/50 text-amber-100 hover:bg-amber-400/20 backdrop-blur-sm"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="relative z-10 backdrop-blur-xl border-b border-amber-300/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 py-6 overflow-x-auto">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveTab(module.id as any)}
                className={`group flex items-center space-x-3 px-8 py-4 rounded-2xl text-sm font-medium transition-all duration-500 whitespace-nowrap ${
                  activeTab === module.id
                    ? "bg-gradient-to-r from-amber-600/90 to-yellow-600/90 text-white shadow-2xl transform scale-105 backdrop-blur-sm border border-amber-400/50"
                    : "text-amber-700 hover:bg-amber-500/20 border border-amber-300/30 hover:border-amber-200/60 backdrop-blur-sm hover:text-amber-800"
                }`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-300">{module.icon}</span>
                <span className="font-light tracking-wide text-lg">{module.label}</span>
                {activeTab === module.id && (
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full animate-pulse shadow-lg"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="backdrop-blur-xl bg-white/90 rounded-3xl border border-amber-200/50 shadow-2xl p-8">
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

        {/* CSV Upload Section */}
        <div className="mt-8">
          <CSVUpload 
            title="Data Import & Export" 
            description="Upload CSV files to import project data, employee records, or financial information"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-r from-amber-100/30 via-yellow-100/30 to-orange-100/30 backdrop-blur-xl border-t border-amber-200/40 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-amber-800 font-serif text-lg tracking-wide">
              National Group India - Advanced Business Intelligence Platform
            </p>
            <p className="text-amber-700/80 mt-2 font-light tracking-wider">
              Powered by Next-Generation Analytics & Machine Learning
            </p>
            <p className="text-amber-600/60 mt-1 text-sm font-light">
              © 2025 National Group. All rights reserved.
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
