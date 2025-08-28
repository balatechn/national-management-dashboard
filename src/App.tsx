import { useState } from "react";

// Simple Button Component
const Button = ({ children, onClick, variant = "default", className = "" }: any) => {
  const baseStyle = "px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 ",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 "
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      alert(`${children} feature coming soon! This is a demo dashboard.`);
    }
  };
  
  return (
    <button 
      className={baseStyle + variants[variant] + className}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

// Simple Card Component
const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-lg border shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

// Simple Dashboard
function SimpleDashboard({ title, type }: { title: string; type: 'people' | 'payroll' }) {
  const peopleData = {
    kpis: [
      { label: "Total Employees", value: "142", desc: "Across all departments" },
      { label: "Active Today", value: "138", desc: "Present and working" },
      { label: "On Leave", value: "4", desc: "Various leave types" },
      { label: "New Joiners", value: "8", desc: "This month" }
    ],
    departments: [
      { name: "Sales", count: "48 employees" },
      { name: "After-Sales", count: "31 employees" },
      { name: "Marketing", count: "12 employees" },
      { name: "Finance", count: "10 employees" }
    ],
    actions: [
      { label: "Add Employee", action: () => alert('Add Employee form would open here!') },
      { label: "View Reports", action: () => alert('Reports dashboard would open here!'), variant: "outline" },
      { label: "Manage Leaves", action: () => alert('Leave management system would open here!'), variant: "outline" },
      { label: "Export Data", action: () => alert('Data export functionality would start here!') }
    ]
  };

  const payrollData = {
    kpis: [
      { label: "Total Gross", value: "₹1,18,25,000", desc: "Before deductions" },
      { label: "Net Pay", value: "₹99,85,000", desc: "After deductions" },
      { label: "Deductions", value: "₹18,40,000", desc: "PF, ESI, TDS, PT" },
      { label: "Headcount", value: "142", desc: "Employees processed" }
    ],
    departments: [
      { name: "Sales", count: "₹34,80,000 net pay" },
      { name: "After-Sales", count: "₹19,60,000 net pay" },
      { name: "Marketing", count: "₹9,40,000 net pay" },
      { name: "Finance", count: "₹11,20,000 net pay" }
    ],
    actions: [
      { label: "Generate Payslips", action: () => alert('Payslip generation would start here!') },
      { label: "View Compliance", action: () => alert('Compliance dashboard would open here!'), variant: "outline" },
      { label: "Bank Transfer", action: () => alert('Bank transfer reconciliation would open here!'), variant: "outline" },
      { label: "Export Reports", action: () => alert('Payroll reports would be exported here!') }
    ]
  };

  const currentData = type === 'people' ? peopleData : payrollData;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentData.kpis.map((kpi, index) => (
          <Card key={index}>
            <div className="text-sm text-gray-500">{kpi.label}</div>
            <div className="text-2xl font-bold mt-1">{kpi.value}</div>
            <div className="text-sm text-gray-600 mt-2">{kpi.desc}</div>
          </Card>
        ))}
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">
            {type === 'people' ? 'Department Distribution' : 'Department Payroll'}
          </h3>
          <div className="space-y-2">
            {currentData.departments.map((dept, index) => (
              <div key={index} className="flex justify-between">
                <span>{dept.name}</span>
                <span className="font-medium">{dept.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {currentData.actions.map((action, index) => (
              <Button 
                key={index}
                variant={action.variant || "default"}
                onClick={action.action}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<"people" | "payroll">("people");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Management Dashboard</h1>
              <p className="text-sm text-gray-600">National Group India - Zoho People & Payroll Analytics</p>
            </div>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("people")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "people"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Zoho People
              </button>
              <button
                onClick={() => setActiveTab("payroll")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "payroll"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Payroll
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "people" ? (
          <SimpleDashboard title="Zoho People Dashboard" type="people" />
        ) : (
          <SimpleDashboard title="Zoho Payroll Dashboard" type="payroll" />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Management Dashboard - Powered by Zoho People & Payroll APIs
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
