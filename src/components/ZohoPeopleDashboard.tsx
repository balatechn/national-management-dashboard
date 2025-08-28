import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users2,
  UserCheck,
  Calendar,
  Clock,
  TrendingUp,
  Building2,
  Award,
  AlertTriangle,
} from "lucide-react";
import { zohoAPI, ZohoEmployee } from "@/services/zohoAPI";

// Mock data for demonstration (replace with real API data)
const mockZohoData = {
  totalEmployees: 142,
  activeEmployees: 138,
  onLeave: 4,
  newJoiners: 8,
  departmentData: [
    { dept: "Sales", count: 48, active: 46 },
    { dept: "After-Sales", count: 31, active: 30 },
    { dept: "Marketing", count: 12, active: 12 },
    { dept: "Finance", count: 10, active: 10 },
    { dept: "HR", count: 9, active: 9 },
    { dept: "IT", count: 7, active: 7 },
  ],
  locationData: [
    { location: "HQ / Richmond", count: 56 },
    { location: "Shimoga", count: 30 },
    { location: "Mangalore", count: 23 },
    { location: "Hassan", count: 18 },
    { location: "Thirthahalli", count: 15 },
  ],
  attendanceData: [
    { date: "Aug 19", present: 134, absent: 8, late: 5 },
    { date: "Aug 20", present: 136, absent: 6, late: 3 },
    { date: "Aug 21", present: 138, absent: 4, late: 2 },
    { date: "Aug 22", present: 135, absent: 7, late: 4 },
    { date: "Aug 23", present: 139, absent: 3, late: 1 },
  ],
  leaveData: [
    { type: "Sick Leave", count: 12 },
    { type: "Casual Leave", count: 8 },
    { type: "Annual Leave", count: 15 },
    { type: "Emergency", count: 3 },
  ],
  performanceAlerts: [
    { employee: "John Doe", issue: "Attendance below 85%", severity: "medium" },
    { employee: "Jane Smith", issue: "Performance review overdue", severity: "high" },
    { employee: "Mike Johnson", issue: "Training completion pending", severity: "low" },
  ],
};

const StatCard = ({ icon: Icon, title, value, desc, trend }: any) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Icon className="h-4 w-4" />
            <CardDescription className="text-xs">{title}</CardDescription>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="h-3 w-3" />
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        <CardTitle className="text-2xl mt-1">{value}</CardTitle>
      </CardHeader>
      {desc && (
        <CardContent className="pt-0">
          <p className="text-sm text-gray-500">{desc}</p>
        </CardContent>
      )}
    </Card>
  </motion.div>
);

export default function ZohoPeopleDashboard() {
  const [employees, setEmployees] = useState<ZohoEmployee[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsAuthenticated(zohoAPI.isAuthenticated());
    if (zohoAPI.isAuthenticated()) {
      loadEmployeeData();
    }
  }, []);

  const loadEmployeeData = async () => {
    setLoading(true);
    try {
      const employeeData = await zohoAPI.getEmployees();
      setEmployees(employeeData);
    } catch (error) {
      console.error('Error loading employee data:', error);
      // Fall back to mock data for demo
    } finally {
      setLoading(false);
    }
  };

  const handleAuthentication = () => {
    if (isAuthenticated) {
      zohoAPI.logout();
      setIsAuthenticated(false);
      setEmployees([]);
    } else {
      // Redirect to Zoho OAuth
      window.location.href = zohoAPI.getAuthorizationUrl();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center max-w-md">
          <CardHeader>
            <CardTitle>Connect to Zoho People</CardTitle>
            <CardDescription>
              Authenticate with your Zoho People account to view employee data and analytics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAuthentication} className="w-full">
              Connect Zoho People
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              Note: This demo uses mock data. Click to see the interface.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsAuthenticated(true)} 
              className="w-full mt-2"
            >
              View Demo Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Authentication Status */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Zoho People Dashboard</h2>
          <p className="text-sm text-gray-600">
            {employees.length > 0 ? `Connected - ${employees.length} employees` : 'Using demo data'}
          </p>
        </div>
        <Button variant="outline" onClick={handleAuthentication}>
          {isAuthenticated ? 'Disconnect' : 'Connect Zoho'}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Users2} 
          title="Total Employees" 
          value={mockZohoData.totalEmployees} 
          desc="Across all departments"
          trend={5.2}
        />
        <StatCard 
          icon={UserCheck} 
          title="Active Today" 
          value={mockZohoData.activeEmployees} 
          desc="Present and working"
          trend={2.1}
        />
        <StatCard 
          icon={Calendar} 
          title="On Leave" 
          value={mockZohoData.onLeave} 
          desc="Various leave types"
          trend={-12.5}
        />
        <StatCard 
          icon={Award} 
          title="New Joiners" 
          value={mockZohoData.newJoiners} 
          desc="This month"
          trend={25.0}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Distribution by Department</CardTitle>
            <CardDescription>Active vs total headcount</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockZohoData.departmentData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dept" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Total" fill="#3b82f6" radius={[2,2,0,0]} />
                <Bar dataKey="active" name="Active" fill="#10b981" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Location-wise Distribution</CardTitle>
            <CardDescription>Employees across offices</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={mockZohoData.locationData} 
                  dataKey="count" 
                  nameKey="location" 
                  outerRadius={100} 
                  label
                >
                  {mockZohoData.locationData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Attendance & Leave Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Attendance Trend */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
            <CardDescription>Daily attendance statistics</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockZohoData.attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" name="Present" fill="#10b981" />
                <Bar dataKey="late" name="Late" fill="#f59e0b" />
                <Bar dataKey="absent" name="Absent" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leave Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Summary</CardTitle>
            <CardDescription>Current month breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockZohoData.leaveData.map((leave, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{leave.type}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">{leave.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center font-medium">
                <span>Total Leave Days</span>
                <span>{mockZohoData.leaveData.reduce((a, b) => a + b.count, 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Performance & Compliance Alerts</CardTitle>
          <CardDescription>Items requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockZohoData.performanceAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                  alert.severity === 'high' ? 'text-red-500' : 
                  alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{alert.employee}</div>
                  <div className="text-sm text-gray-600">{alert.issue}</div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  alert.severity === 'high' ? 'bg-red-100 text-red-700' : 
                  alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {alert.severity.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm">View All Alerts</Button>
            <Button size="sm" variant="outline">Generate Report</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common HR tasks and workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2">
              <Users2 className="h-5 w-5" />
              <span className="text-xs">Add Employee</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Manage Leaves</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-xs">Attendance Report</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2">
              <Building2 className="h-5 w-5" />
              <span className="text-xs">Org Chart</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
