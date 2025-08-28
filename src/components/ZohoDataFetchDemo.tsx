import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { zohoAPI, ZohoEmployee, ZohoPayrollData, ZohoProject, ZohoTask } from '../services/zohoAPI';
import ZohoAPICodeExamples from './ZohoAPICodeExamples';
import { 
  Users, DollarSign, FolderOpen, Calendar, 
  Download, RefreshCw, CheckCircle, XCircle, AlertCircle, Code 
} from 'lucide-react';

interface DataFetchDemoProps {
  onClose?: () => void;
}

const ZohoDataFetchDemo: React.FC<DataFetchDemoProps> = ({ onClose }) => {
  // Data states
  const [employees, setEmployees] = useState<ZohoEmployee[]>([]);
  const [payrollData, setPayrollData] = useState<ZohoPayrollData[]>([]);
  const [projects, setProjects] = useState<ZohoProject[]>([]);
  const [tasks, setTasks] = useState<ZohoTask[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);

  // Status states
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');

  // Authentication check
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(zohoAPI.isAuthenticated());
  }, []);

  const setLoadingState = (key: string, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  const setResult = (key: string, success: boolean, data?: any, error?: string) => {
    setResults(prev => ({ 
      ...prev, 
      [key]: { success, data, error, timestamp: new Date().toLocaleTimeString() }
    }));
  };

  // === ZOHO PEOPLE DATA FETCHING ===
  
  const fetchEmployees = async () => {
    setLoadingState('employees', true);
    try {
      const data = await zohoAPI.getEmployees();
      setEmployees(data);
      setResult('employees', true, data);
      console.log('Employees fetched:', data);
    } catch (error: any) {
      setResult('employees', false, null, error.message);
      console.error('Error fetching employees:', error);
    }
    setLoadingState('employees', false);
  };

  const fetchAttendance = async () => {
    setLoadingState('attendance', true);
    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 30); // Last 30 days
      const toDate = new Date();
      
      const data = await zohoAPI.getAttendanceData(
        selectedEmployee || undefined,
        fromDate.toISOString().split('T')[0],
        toDate.toISOString().split('T')[0]
      );
      setAttendance(data);
      setResult('attendance', true, data);
      console.log('Attendance fetched:', data);
    } catch (error: any) {
      setResult('attendance', false, null, error.message);
      console.error('Error fetching attendance:', error);
    }
    setLoadingState('attendance', false);
  };

  // === ZOHO PAYROLL DATA FETCHING ===
  
  const fetchPayrollData = async () => {
    if (!selectedEmployee) {
      setResult('payroll', false, null, 'Please select an employee first');
      return;
    }

    setLoadingState('payroll', true);
    try {
      const data = await zohoAPI.getEmployeePayroll(selectedEmployee);
      setPayrollData(data);
      setResult('payroll', true, data);
      console.log('Payroll data fetched:', data);
    } catch (error: any) {
      setResult('payroll', false, null, error.message);
      console.error('Error fetching payroll:', error);
    }
    setLoadingState('payroll', false);
  };

  // === ZOHO PROJECTS DATA FETCHING ===
  
  const fetchProjects = async () => {
    setLoadingState('projects', true);
    try {
      const data = await zohoAPI.getProjects();
      setProjects(data);
      setResult('projects', true, data);
      console.log('Projects fetched:', data);
    } catch (error: any) {
      setResult('projects', false, null, error.message);
      console.error('Error fetching projects:', error);
    }
    setLoadingState('projects', false);
  };

  const fetchProjectTasks = async () => {
    if (!selectedProject) {
      setResult('tasks', false, null, 'Please select a project first');
      return;
    }

    setLoadingState('tasks', true);
    try {
      const data = await zohoAPI.getProjectTasks(selectedProject);
      setTasks(data);
      setResult('tasks', true, data);
      console.log('Project tasks fetched:', data);
    } catch (error: any) {
      setResult('tasks', false, null, error.message);
      console.error('Error fetching tasks:', error);
    }
    setLoadingState('tasks', false);
  };

  const fetchProjectTimesheets = async () => {
    if (!selectedProject) {
      setResult('timesheets', false, null, 'Please select a project first');
      return;
    }

    setLoadingState('timesheets', true);
    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 30); // Last 30 days
      const toDate = new Date();
      
      const data = await zohoAPI.getProjectTimesheets(
        selectedProject,
        fromDate.toISOString().split('T')[0],
        toDate.toISOString().split('T')[0]
      );
      setResult('timesheets', true, data);
      console.log('Project timesheets fetched:', data);
    } catch (error: any) {
      setResult('timesheets', false, null, error.message);
      console.error('Error fetching timesheets:', error);
    }
    setLoadingState('timesheets', false);
  };

  // Export data as JSON
  const exportData = (dataType: string) => {
    const dataMap: Record<string, any> = {
      employees,
      payrollData,
      projects,
      tasks,
      attendance
    };

    const data = dataMap[dataType];
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zoho_${dataType}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStatusBadge = (key: string) => {
    const result = results[key];
    if (!result) return null;

    return (
      <div className="flex items-center gap-2 text-xs">
        {result.success ? (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        ) : (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )}
        <span className="text-gray-500">{result.timestamp}</span>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Authentication Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Please authenticate with Zoho first to fetch data.
          </p>
          <Button onClick={() => window.location.href = zohoAPI.getAuthorizationUrl()}>
            Connect to Zoho
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Zoho Data Fetching Demo</h2>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close Demo
          </Button>
        )}
      </div>

      {/* Zoho People Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Zoho People Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Employees */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Fetch Employees</h4>
              <p className="text-sm text-gray-600">Get all employee records</p>
              {renderStatusBadge('employees')}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={fetchEmployees} 
                disabled={loading.employees}
                size="sm"
              >
                {loading.employees ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Fetch'}
              </Button>
              {employees.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportData('employees')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Employee Selection */}
          {employees.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-sm font-medium mb-2">Select Employee:</label>
              <select 
                value={selectedEmployee} 
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Choose an employee...</option>
                {employees.map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.firstName} {emp.lastName} - {emp.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Attendance */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Fetch Attendance (Last 30 days)</h4>
              <p className="text-sm text-gray-600">Get attendance records</p>
              {renderStatusBadge('attendance')}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={fetchAttendance} 
                disabled={loading.attendance}
                size="sm"
              >
                {loading.attendance ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Fetch'}
              </Button>
              {attendance.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportData('attendance')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zoho Payroll Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Zoho Payroll Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Fetch Payroll Data</h4>
              <p className="text-sm text-gray-600">Get payslips for selected employee</p>
              {renderStatusBadge('payroll')}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={fetchPayrollData} 
                disabled={loading.payroll || !selectedEmployee}
                size="sm"
              >
                {loading.payroll ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Fetch'}
              </Button>
              {payrollData.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportData('payrollData')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zoho Projects Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-purple-600" />
            Zoho Projects Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Projects */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Fetch Projects</h4>
              <p className="text-sm text-gray-600">Get all project records</p>
              {renderStatusBadge('projects')}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={fetchProjects} 
                disabled={loading.projects}
                size="sm"
              >
                {loading.projects ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Fetch'}
              </Button>
              {projects.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportData('projects')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Project Selection */}
          {projects.length > 0 && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <label className="block text-sm font-medium mb-2">Select Project:</label>
              <select 
                value={selectedProject} 
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Choose a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} - {project.status}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tasks */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Fetch Project Tasks</h4>
              <p className="text-sm text-gray-600">Get tasks for selected project</p>
              {renderStatusBadge('tasks')}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={fetchProjectTasks} 
                disabled={loading.tasks || !selectedProject}
                size="sm"
              >
                {loading.tasks ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Fetch'}
              </Button>
              {tasks.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportData('tasks')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Timesheets */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Fetch Project Timesheets (Last 30 days)</h4>
              <p className="text-sm text-gray-600">Get time logs for selected project</p>
              {renderStatusBadge('timesheets')}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={fetchProjectTimesheets} 
                disabled={loading.timesheets || !selectedProject}
                size="sm"
              >
                {loading.timesheets ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Fetch'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            Data Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
              <div className="text-sm text-gray-600">Employees</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{payrollData.length}</div>
              <div className="text-sm text-gray-600">Payslips</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{projects.length}</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{tasks.length}</div>
              <div className="text-sm text-gray-600">Tasks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-gray-600" />
            API Code Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ZohoAPICodeExamples />
        </CardContent>
      </Card>
    </div>
  );
};

export default ZohoDataFetchDemo;
