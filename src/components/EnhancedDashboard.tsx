import React, { useState, useRef } from 'react';
import { useAuth, UserRole } from '../lib/authContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import ProjectTable from './ProjectTable';

interface DrillDownData {
  department: string;
  employees: Array<{
    id: string;
    name: string;
    position: string;
    salary: string;
    status: string;
  }>;
}

const DRILL_DOWN_DATA: Record<string, DrillDownData> = {
  Sales: {
    department: 'Sales',
    employees: [
      { id: '1', name: 'John Smith', position: 'Sales Manager', salary: '₹85,000', status: 'Active' },
      { id: '2', name: 'Sarah Johnson', position: 'Sales Executive', salary: '₹55,000', status: 'Active' },
      { id: '3', name: 'Mike Wilson', position: 'Sales Associate', salary: '₹45,000', status: 'On Leave' },
      { id: '4', name: 'Emily Davis', position: 'Senior Sales Executive', salary: '₹65,000', status: 'Active' },
    ]
  },
  'After-Sales': {
    department: 'After-Sales',
    employees: [
      { id: '5', name: 'David Brown', position: 'Service Manager', salary: '₹75,000', status: 'Active' },
      { id: '6', name: 'Lisa Anderson', position: 'Customer Support', salary: '₹40,000', status: 'Active' },
      { id: '7', name: 'Tom Miller', position: 'Technical Support', salary: '₹50,000', status: 'Active' },
    ]
  },
  Marketing: {
    department: 'Marketing',
    employees: [
      { id: '8', name: 'Jennifer Taylor', position: 'Marketing Head', salary: '₹90,000', status: 'Active' },
      { id: '9', name: 'Robert Lee', position: 'Digital Marketer', salary: '₹60,000', status: 'Active' },
      { id: '10', name: 'Amanda White', position: 'Content Creator', salary: '₹45,000', status: 'Active' },
    ]
  },
  Finance: {
    department: 'Finance',
    employees: [
      { id: '11', name: 'Christopher Clark', position: 'Finance Manager', salary: '₹95,000', status: 'Active' },
      { id: '12', name: 'Michelle Rodriguez', position: 'Accountant', salary: '₹55,000', status: 'Active' },
      { id: '13', name: 'Kevin Martinez', position: 'Finance Assistant', salary: '₹35,000', status: 'Active' },
    ]
  }
};

const PROJECT_DRILL_DOWN_DATA: Record<string, any> = {
  "NIPL Infrastructure": {
    department: 'NIPL Infrastructure',
    projects: [
      { id: 'NA-110', name: 'Aug tracker', owner: 'Karthik M K', status: 'Active', completion: '40%', group: 'Finance' },
      { id: 'NA-104', name: 'Hogenakkal Construction tender', owner: 'Munavar Sheik', status: 'Active', completion: '60%', group: 'NIPL' },
      { id: 'NA-98', name: 'D&C TWIN TUNNEL Package-2', owner: 'Munavar Sheik', status: 'Active', completion: '0%', group: 'NIPL' },
      { id: 'NA-97', name: 'D&C TWIN TUNNEL Package-1', owner: 'Munavar Sheik', status: 'Active', completion: '0%', group: 'NIPL' },
      { id: 'NA-84', name: 'Bikaner Airport MES Phase-II', owner: 'Munavar Sheik', status: 'Active', completion: '71%', group: 'NIPL' }
    ]
  },
  "Real Estate": {
    department: 'Real Estate',
    projects: [
      { id: 'NA-107', name: 'Kimmane Resort - Bangalore', owner: 'Nirup Jayanth', status: 'Active', completion: '100%', group: 'Ungrouped' },
      { id: 'NA-106', name: 'Kimmane Residential', owner: 'Nirup Jayanth', status: 'Active', completion: '58%', group: 'Ungrouped' },
      { id: 'NA-87', name: 'Dal Moro - Cafe Interiors', owner: 'Siddharth Venkat', status: 'Active', completion: '8%', group: 'Real Estate' },
      { id: 'NA-27', name: 'Padmanabha Nagar', owner: 'Nirup Jayanth', status: 'In Progress', completion: '60%', group: 'Real Estate' },
      { id: 'NA-17', name: 'Kimmane Residential - Shimoga', owner: 'Nirup Jayanth', status: 'In Progress', completion: '85%', group: 'Real Estate' }
    ]
  },
  "Consulting": {
    department: 'Consulting',
    projects: [
      { id: 'NA-101', name: 'Daily updation', owner: 'Prasanna Hegde', status: 'In Progress', completion: '97%', group: 'Consulting' },
      { id: 'NA-85', name: 'BBMP DPR Development', owner: 'Munavar Sheik', status: 'Active', completion: '0%', group: 'Consulting' },
      { id: 'NA-69', name: 'Ahmedabad Master Plan Development', owner: 'Munavar Sheik', status: 'Active', completion: '0%', group: 'Consulting' },
      { id: 'NA-52', name: 'Meroz Khan - Anand Rao Circle', owner: 'Nirup Jayanth', status: 'In Progress', completion: '88%', group: 'Consulting' },
      { id: 'NA-36', name: 'Hogenekal PMC work', owner: 'Munavar Sheik', status: 'In Progress', completion: '0%', group: 'Consulting' }
    ]
  },
  "Digital Marketing": {
    department: 'Digital Marketing',
    projects: [
      { id: 'NA-63', name: 'NRPL Marketing', owner: 'Dipti Amarnath', status: 'In Progress', completion: '33%', group: 'Digital Marketing' },
      { id: 'NA-45', name: 'Dal Moro\'s Marketing', owner: 'Dipti Amarnath', status: 'In Progress', completion: '80%', group: 'Digital Marketing' },
      { id: 'NA-43', name: 'Rainland_Isuzu', owner: 'Dipti Amarnath', status: 'In Progress', completion: '69%', group: 'Digital Marketing' },
      { id: 'NA-42', name: 'National Group', owner: 'Dipti Amarnath', status: 'In Progress', completion: '64%', group: 'Digital Marketing' },
      { id: 'NA-40', name: 'iSky Marketing', owner: 'Dipti Amarnath', status: 'In Progress', completion: '42%', group: 'Digital Marketing' }
    ]
  }
};

interface DashboardProps {
  title: string;
  type: 'people' | 'payroll' | 'project' | 'crm' | 'finance';
}

const EnhancedDashboard: React.FC<DashboardProps> = ({ title, type }) => {
  const { user, permissions, hasPermission } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const peopleData = {
    kpis: [
      { label: "Total Employees", value: "142", desc: "Across all departments", editable: true },
      { label: "Active Today", value: "138", desc: "Present and working", editable: true },
      { label: "On Leave", value: "4", desc: "Various leave types", editable: true },
      { label: "New Joiners", value: "8", desc: "This month", editable: true }
    ],
    departments: [
      { name: "Sales", count: "48 employees", clickable: true },
      { name: "After-Sales", count: "31 employees", clickable: true },
      { name: "Marketing", count: "12 employees", clickable: true },
      { name: "Finance", count: "10 employees", clickable: true }
    ]
  };

  const payrollData = {
    kpis: [
      { label: "Total Gross", value: "₹1,18,25,000", desc: "Before deductions", editable: true },
      { label: "Net Pay", value: "₹99,85,000", desc: "After deductions", editable: true },
      { label: "Deductions", value: "₹18,40,000", desc: "PF, ESI, TDS, PT", editable: true },
      { label: "Headcount", value: "142", desc: "Employees processed", editable: true }
    ],
    departments: [
      { name: "Sales", count: "₹34,80,000 net pay", clickable: true },
      { name: "After-Sales", count: "₹19,60,000 net pay", clickable: true },
      { name: "Marketing", count: "₹9,40,000 net pay", clickable: true },
      { name: "Finance", count: "₹11,20,000 net pay", clickable: true }
    ]
  };

  const projectData = {
    kpis: [
      { label: "Active Projects", value: "89", desc: "Currently in progress", editable: true },
      { label: "Completed Projects", value: "21", desc: "Successfully finished", editable: true },
      { label: "Total Value", value: "₹628Cr+", desc: "Combined project value", editable: true },
      { label: "Success Rate", value: "87%", desc: "Project completion rate", editable: true }
    ],
    departments: [
      { name: "NIPL Infrastructure", count: "35 active projects", clickable: true },
      { name: "Real Estate", count: "28 active projects", clickable: true },
      { name: "Consulting", count: "15 active projects", clickable: true },
      { name: "Digital Marketing", count: "11 active projects", clickable: true }
    ]
  };

  const crmData = {
    kpis: [
      { label: "Total Customers", value: "1,248", desc: "Active customer base", editable: true },
      { label: "New Leads", value: "87", desc: "This month", editable: true },
      { label: "Conversion Rate", value: "24%", desc: "Lead to customer", editable: true },
      { label: "Revenue Pipeline", value: "₹1.2Cr", desc: "Potential deals", editable: true }
    ],
    departments: [
      { name: "Hot Leads", count: "23 prospects", clickable: true },
      { name: "Warm Leads", count: "45 prospects", clickable: true },
      { name: "Cold Leads", count: "19 prospects", clickable: true },
      { name: "Customers", count: "1,248 active", clickable: true }
    ]
  };

  const financeData = {
    kpis: [
      { label: "Monthly Revenue", value: "₹45.2L", desc: "Current month", editable: true },
      { label: "Expenses", value: "₹32.8L", desc: "Operating expenses", editable: true },
      { label: "Profit Margin", value: "27.4%", desc: "Net profit margin", editable: true },
      { label: "Cash Flow", value: "₹12.4L", desc: "Available cash", editable: true }
    ],
    departments: [
      { name: "Accounts Receivable", count: "₹18.5L pending", clickable: true },
      { name: "Accounts Payable", count: "₹12.3L pending", clickable: true },
      { name: "Bank Balance", count: "₹45.2L available", clickable: true },
      { name: "Investments", count: "₹25.8L portfolio", clickable: true }
    ]
  };

  const getCurrentData = () => {
    switch (type) {
      case 'people':
      case 'payroll':
        return type === 'people' ? peopleData : payrollData;
      case 'project':
        return projectData;
      case 'crm':
        return crmData;
      case 'finance':
        return financeData;
      default:
        return peopleData;
    }
  };

  const currentData = getCurrentData();

  const handleDepartmentClick = (deptName: string) => {
    if (!hasPermission('canDrillDown')) {
      alert('You need Interactive or Admin access to drill down into department details.');
      return;
    }
    setSelectedDepartment(deptName);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!hasPermission('canUpload')) {
      alert('You need Admin access to upload files.');
      return;
    }

    if (!file.name.endsWith('.csv')) {
      setUploadStatus('Error: Please upload a CSV file only.');
      return;
    }

    setUploadStatus('Uploading...');
    
    // Simulate file upload
    setTimeout(() => {
      setUploadStatus(`Success: ${file.name} uploaded successfully!`);
      setTimeout(() => setUploadStatus(''), 3000);
    }, 2000);
  };

  const handleEdit = () => {
    if (!hasPermission('canEdit')) {
      alert('You need Admin access to edit dashboard data.');
      return;
    }
    setEditMode(!editMode);
  };

  const getRoleInfo = () => {
    switch (user?.role) {
      case UserRole.VIEWER:
        return { color: 'bg-amber-100 text-amber-800 border-amber-300', label: 'Viewer' };
      case UserRole.INTERACTIVE:
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Interactive' };
      case UserRole.ADMIN:
        return { color: 'bg-gradient-to-r from-amber-200 to-yellow-200 text-amber-900 border-amber-400', label: 'Admin' };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-300', label: 'Unknown' };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="space-y-8">
      {/* Elegant Header */}
      <div className="bg-gradient-to-r from-white via-amber-50/30 to-yellow-50/30 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-amber-100/50">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h2 className="text-4xl font-light bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-amber-600/80 text-lg font-light">
              Welcome back, <span className="font-medium text-amber-700">{user?.username}</span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`px-6 py-3 rounded-xl text-sm font-medium border-2 shadow-lg backdrop-blur-sm ${roleInfo.color}`}>
              {roleInfo.label} Access
            </div>
            {hasPermission('canEdit') && (
              <Button
                variant={editMode ? "destructive" : "outline"}
                size="sm"
                onClick={handleEdit}
                className="border-amber-300 text-amber-800 hover:bg-amber-50 shadow-lg backdrop-blur-sm"
              >
                {editMode ? 'Exit Edit' : 'Edit Mode'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* File Upload Section - Only for Admin */}
      {hasPermission('canUpload') && (
        <Card className="bg-gradient-to-r from-white to-amber-50 border-amber-300 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-amber-800">CSV File Upload</CardTitle>
            <CardDescription className="text-amber-700">Upload CSV files to update dashboard data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="max-w-xs border-amber-300 focus:border-amber-500"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-amber-400 text-amber-800 hover:bg-amber-50"
              >
                Choose CSV File
              </Button>
            </div>
            {uploadStatus && (
              <div className={`mt-3 p-3 rounded-md text-sm ${
                uploadStatus.includes('Error') 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : uploadStatus.includes('Success')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {uploadStatus}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Elegant KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {currentData.kpis.map((kpi, index) => (
          <Card 
            key={index} 
            className={`group bg-gradient-to-br from-white/80 via-amber-50/50 to-yellow-50/50 backdrop-blur-sm border border-amber-100/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 ${
              editMode && hasPermission('canEdit') ? 'ring-2 ring-amber-300' : ''
            }`}
          >
            <CardContent className="pt-8 pb-6 px-6">
              <div className="text-sm text-amber-600/80 font-medium uppercase tracking-wider">{kpi.label}</div>
              <div className="text-4xl font-light mt-3 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800 bg-clip-text text-transparent">
                {editMode && hasPermission('canEdit') ? (
                  <Input 
                    defaultValue={kpi.value} 
                    className="text-4xl font-light border-none p-0 h-auto bg-transparent"
                  />
                ) : (
                  kpi.value
                )}
              </div>
              <div className="text-sm text-amber-500/70 mt-3 font-light">{kpi.desc}</div>
              {editMode && hasPermission('canEdit') && (
                <div className="text-xs text-amber-600 mt-3 bg-amber-100/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                  ✏️ Editable in Admin mode
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Elegant Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Data */}
        <Card className="group bg-gradient-to-br from-white/80 via-amber-50/30 to-yellow-50/30 backdrop-blur-sm border border-amber-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-light text-amber-800">
              {type === 'people' || type === 'payroll' ? 'Department Distribution' : 
               type === 'project' ? 'Project Categories' :
               type === 'crm' ? 'Lead Pipeline' : 'Financial Overview'}
            </CardTitle>
            <CardDescription className="text-amber-600/80 font-light">
              {hasPermission('canDrillDown') 
                ? 'Click on items to explore detailed insights' 
                : 'Overview dashboard with comprehensive metrics'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentData.departments.map((dept, index) => (
                <div 
                  key={index} 
                  className={`group/item flex justify-between items-center p-5 rounded-xl transition-all duration-300 ${
                    hasPermission('canDrillDown') 
                      ? 'hover:bg-gradient-to-r hover:from-amber-100/50 hover:to-yellow-100/50 cursor-pointer border border-amber-200/50 hover:border-amber-300 hover:shadow-lg hover:scale-102' 
                      : 'bg-gradient-to-r from-amber-50/50 to-yellow-50/50 border border-amber-200/50'
                  }`}
                  onClick={() => hasPermission('canDrillDown') && handleDepartmentClick(dept.name)}
                >
                  <span className="font-medium text-amber-800">{dept.name}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-amber-700 font-light">{dept.count}</span>
                    {hasPermission('canDrillDown') && (
                      <span className="text-amber-600/60 text-sm group-hover/item:text-amber-600 transition-colors">→</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Elegant Quick Actions */}
        <Card className="group bg-gradient-to-br from-white/80 via-amber-50/30 to-yellow-50/30 backdrop-blur-sm border border-amber-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-light text-amber-800">Quick Actions</CardTitle>
            <CardDescription className="text-amber-600/80 font-light">Intelligent tools for enhanced productivity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="default"
                onClick={() => alert('Report generation would start here!')}
                disabled={!permissions.canView}
                className="group bg-gradient-to-r from-amber-500/90 to-yellow-500/90 hover:from-amber-600 hover:to-yellow-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl py-6 text-left justify-start backdrop-blur-sm border border-amber-300/20"
              >
                <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">📊</span>
                <div>
                  <div className="font-medium">Generate Reports</div>
                  <div className="text-xs opacity-90">Create comprehensive analytics</div>
                </div>
              </Button>
              
              <Button 
                variant={permissions.canInteract ? "default" : "secondary"}
                onClick={() => permissions.canInteract 
                  ? alert('Interactive analysis would open here!') 
                  : alert('Interactive features require Interactive/Admin access')
                }
                className={permissions.canInteract 
                  ? "group bg-gradient-to-r from-amber-400/90 to-yellow-400/90 hover:from-amber-500 hover:to-yellow-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl py-6 text-left justify-start backdrop-blur-sm border border-amber-300/20" 
                  : "bg-amber-100/50 text-amber-700 border-amber-300/50 rounded-xl py-6 text-left justify-start backdrop-blur-sm"
                }
              >
                <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">📈</span>
                <div>
                  <div className="font-medium">Interactive Analysis</div>
                  <div className="text-xs opacity-90">Explore data insights</div>
                </div>
              </Button>
              
              <Button 
                variant={permissions.canEdit ? "default" : "secondary"}
                onClick={() => permissions.canEdit 
                  ? alert('Data management panel would open here!') 
                  : alert('Data management requires Admin access')
                }
                className={permissions.canEdit 
                  ? "group bg-gradient-to-r from-amber-600/90 to-yellow-600/90 hover:from-amber-700 hover:to-yellow-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl py-6 text-left justify-start backdrop-blur-sm border border-amber-300/20" 
                  : "bg-amber-100/50 text-amber-700 border-amber-300/50 rounded-xl py-6 text-left justify-start backdrop-blur-sm"
                }
              >
                <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">🔧</span>
                <div>
                  <div className="font-medium">Manage Data</div>
                  <div className="text-xs opacity-90">Configure and optimize</div>
                </div>
              </Button>
              
              <Button 
                variant={permissions.canUpload ? "default" : "secondary"}
                onClick={() => permissions.canUpload 
                  ? alert('Bulk operations panel would open here!') 
                  : alert('Bulk operations require Admin access')
                }
                className={permissions.canUpload 
                  ? "group bg-gradient-to-r from-amber-700/90 to-yellow-700/90 hover:from-amber-800 hover:to-yellow-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl py-6 text-left justify-start backdrop-blur-sm border border-amber-300/20" 
                  : "bg-amber-100/50 text-amber-700 border-amber-300/50 rounded-xl py-6 text-left justify-start backdrop-blur-sm"
                }
              >
                <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">📤</span>
                <div>
                  <div className="font-medium">Bulk Operations</div>
                  <div className="text-xs opacity-90">Import and process data</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Portfolio Table - Only for Project Module */}
      {type === 'project' && (
        <div className="mt-6">
          <ProjectTable searchable={true} maxRows={15} />
        </div>
      )}

      {/* Drill Down Modal/Panel */}
      {selectedDepartment && hasPermission('canDrillDown') && (
        <Card className="border-amber-300 bg-gradient-to-br from-amber-50 via-white to-yellow-50 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-amber-800">
                  {selectedDepartment} {type === 'project' ? 'Projects' : 'Department'} Details
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Detailed {type === 'project' ? 'project' : 'employee'} information for {selectedDepartment}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDepartment(null)}
                className="border-amber-300 text-amber-800 hover:bg-amber-100"
              >
                ✕ Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {type === 'project' && PROJECT_DRILL_DOWN_DATA[selectedDepartment] ? (
                // Project drill-down
                PROJECT_DRILL_DOWN_DATA[selectedDepartment].projects.map((project: any) => (
                  <div 
                    key={project.id} 
                    className="bg-white p-4 rounded-lg border border-amber-200 flex justify-between items-center shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div>
                      <div className="font-medium text-amber-900">{project.id}: {project.name}</div>
                      <div className="text-sm text-amber-700">Owner: {project.owner} | Group: {project.group}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-amber-800">{project.completion}</div>
                      <div className={`text-sm ${
                        project.status === 'Active' ? 'text-green-600' : 
                        project.status === 'Completed' ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {project.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Employee drill-down (for people/payroll modules)
                DRILL_DOWN_DATA[selectedDepartment]?.employees.map((employee) => (
                  <div 
                    key={employee.id} 
                    className="bg-white p-4 rounded-lg border border-amber-200 flex justify-between items-center shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div>
                      <div className="font-medium text-amber-900">{employee.name}</div>
                      <div className="text-sm text-amber-700">{employee.position}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-amber-800">{employee.salary}</div>
                      <div className={`text-sm ${
                        employee.status === 'Active' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {employee.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {hasPermission('canEdit') && (
              <div className="mt-6 pt-4 border-t border-amber-200">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-amber-400 text-amber-800 hover:bg-amber-50"
                >
                  📝 Edit {type === 'project' ? 'Project' : 'Employee'} Data
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedDashboard;
