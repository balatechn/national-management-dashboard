import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ZohoAPICodeExamples: React.FC = () => {
  const [activeExample, setActiveExample] = useState<'employees' | 'attendance' | 'payroll' | 'projects'>('employees');

  const examples = {
    employees: {
      title: 'Fetch Employees from Zoho People',
      description: 'Get all employee records from Zoho People API',
      code: `// Import the Zoho API service
import { zohoAPI } from '../services/zohoAPI';

// Function to fetch all employees
const fetchEmployees = async () => {
  try {
    // Call the Zoho People API
    const employees = await zohoAPI.getEmployees();
    
    // Log the response to console
    console.log('Employees fetched:', employees);
    
    // The employees array contains objects like:
    // {
    //   employeeId: "12345",
    //   firstName: "John",
    //   lastName: "Doe", 
    //   email: "john.doe@company.com",
    //   department: "Engineering",
    //   designation: "Software Developer",
    //   joiningDate: "2024-01-15",
    //   status: "Active"
    // }
    
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    // Handle common errors:
    // - Authentication failed
    // - Invalid scope permissions
    // - API rate limits
    throw error;
  }
};

// Usage in React component
const [employees, setEmployees] = useState([]);

const handleFetchEmployees = async () => {
  try {
    const data = await fetchEmployees();
    setEmployees(data);
  } catch (error) {
    alert('Failed to fetch employees: ' + error.message);
  }
};`,
      apiUrl: 'GET https://people.zoho.com/people/api/forms/employee/records',
      requiredScope: 'ZohoPeople.employee.READ'
    },

    attendance: {
      title: 'Fetch Attendance Data',
      description: 'Get attendance records for employees',
      code: `// Fetch attendance data for last 30 days
const fetchAttendance = async (employeeId?: string) => {
  try {
    // Calculate date range (last 30 days)
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    const toDate = new Date();
    
    // Format dates as YYYY-MM-DD
    const from = fromDate.toISOString().split('T')[0];
    const to = toDate.toISOString().split('T')[0];
    
    // Call attendance API
    const attendance = await zohoAPI.getAttendanceData(
      employeeId, // Optional: specific employee ID
      from,       // From date
      to          // To date
    );
    
    console.log('Attendance data:', attendance);
    
    // Response contains:
    // [
    //   {
    //     employeeId: "12345",
    //     date: "2024-08-28",
    //     checkIn: "09:00:00",
    //     checkOut: "18:00:00", 
    //     workHours: 8.5,
    //     status: "Present"
    //   }
    // ]
    
    return attendance;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
};`,
      apiUrl: 'GET https://people.zoho.com/people/api/attendance/getAttendanceEntries',
      requiredScope: 'ZohoPeople.attendance.READ'
    },

    payroll: {
      title: 'Fetch Payroll Data',
      description: 'Get payslips and salary information',
      code: `// Fetch payroll data for specific employee
const fetchPayrollData = async (employeeId: string) => {
  try {
    // Get payslips for the employee
    const payrollData = await zohoAPI.getEmployeePayroll(employeeId);
    
    console.log('Payroll data:', payrollData);
    
    // Response contains payslip information:
    // [
    //   {
    //     payslipId: "PS123",
    //     employeeId: "12345",
    //     payPeriod: "August 2024",
    //     basicSalary: 50000,
    //     allowances: 10000,
    //     deductions: 5000,
    //     netSalary: 55000,
    //     payDate: "2024-08-31"
    //   }
    // ]
    
    return payrollData;
  } catch (error) {
    console.error('Error fetching payroll:', error);
    throw error;
  }
};

// Get specific payroll information
const getEmployeeCurrentSalary = async (employeeId: string) => {
  try {
    const payroll = await fetchPayrollData(employeeId);
    const latestPayslip = payroll[0]; // Most recent payslip
    return latestPayslip?.netSalary || 0;
  } catch (error) {
    console.error('Error getting salary:', error);
    return 0;
  }
};`,
      apiUrl: 'GET https://payroll.zoho.com/api/v1/employees/{employeeId}/payslips',
      requiredScope: 'ZohoPayroll.employees.READ'
    },

    projects: {
      title: 'Fetch Project Data',
      description: 'Get projects, tasks, and timesheets',
      code: `// Fetch all projects
const fetchProjects = async () => {
  try {
    const projects = await zohoAPI.getProjects();
    
    console.log('Projects:', projects);
    
    // Response contains project information:
    // [
    //   {
    //     id: "12345",
    //     name: "Website Redesign",
    //     description: "Complete website overhaul",
    //     status: "Active",
    //     startDate: "2024-08-01",
    //     endDate: "2024-12-31",
    //     clientName: "ABC Corp",
    //     budget: 100000,
    //     currency: "USD"
    //   }
    // ]
    
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Fetch tasks for a specific project
const fetchProjectTasks = async (projectId: string) => {
  try {
    const tasks = await zohoAPI.getProjectTasks(projectId);
    
    console.log('Project tasks:', tasks);
    
    // Response contains task information:
    // [
    //   {
    //     id: "TASK123",
    //     name: "Design Homepage",
    //     description: "Create new homepage design",
    //     status: "In Progress",
    //     assignee: "john.doe@company.com",
    //     startDate: "2024-08-15",
    //     dueDate: "2024-09-01",
    //     priority: "High"
    //   }
    // ]
    
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Fetch project timesheets
const fetchProjectTimesheets = async (projectId: string) => {
  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    const toDate = new Date();
    
    const timesheets = await zohoAPI.getProjectTimesheets(
      projectId,
      fromDate.toISOString().split('T')[0],
      toDate.toISOString().split('T')[0]
    );
    
    console.log('Timesheets:', timesheets);
    
    return timesheets;
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    throw error;
  }
};`,
      apiUrl: 'GET https://projectsapi.zoho.com/restapi/projects',
      requiredScope: 'ZohoProjects.projects.READ'
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Zoho API Data Fetching Guide</h2>
        <p className="text-gray-600">Learn how to fetch data from Zoho People, Payroll, and Projects</p>
      </div>

      {/* Example Selection */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(examples).map(([key, example]) => (
          <Button
            key={key}
            variant={activeExample === key ? "default" : "outline"}
            onClick={() => setActiveExample(key as 'employees' | 'attendance' | 'payroll' | 'projects')}
            className="mb-2"
          >
            {example.title}
          </Button>
        ))}
      </div>

      {/* Active Example */}
      <Card>
        <CardHeader>
          <CardTitle>{examples[activeExample].title}</CardTitle>
          <p className="text-gray-600">{examples[activeExample].description}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">
              API: {examples[activeExample].apiUrl}
            </Badge>
            <Badge variant="outline">
              Scope: {examples[activeExample].requiredScope}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm whitespace-pre-wrap">
              <code>{examples[activeExample].code}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Key Points */}
      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-1">Authentication Required</h4>
            <p className="text-blue-700 text-sm">
              All API calls require valid OAuth authentication. Make sure you've completed the OAuth flow first.
            </p>
          </div>
          
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-1">Proper Scopes</h4>
            <p className="text-amber-700 text-sm">
              Ensure your Zoho API Console has the required scopes configured for each API endpoint.
            </p>
          </div>
          
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-1">Error Handling</h4>
            <p className="text-green-700 text-sm">
              Always wrap API calls in try-catch blocks to handle authentication errors, rate limits, and network issues.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZohoAPICodeExamples;
