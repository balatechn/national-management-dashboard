import axios from 'axios';

// Zoho API Configuration
const ZOHO_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_ZOHO_CLIENT_ID || '',
  CLIENT_SECRET: import.meta.env.VITE_ZOHO_CLIENT_SECRET || '',
  REDIRECT_URI: import.meta.env.VITE_ZOHO_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  SCOPES: 'ZohoPeople.employee.ALL,ZohoPayroll.employees.ALL,ZohoProjects.projects.ALL,ZohoCRM.modules.ALL',
  PEOPLE_BASE_URL: 'https://people.zoho.com/people/api',
  PAYROLL_BASE_URL: 'https://payroll.zoho.com/api/v1',
  PROJECTS_BASE_URL: 'https://projectsapi.zoho.com/restapi',
  CRM_BASE_URL: 'https://www.zohoapis.com/crm/v2',
};

// Interfaces for different Zoho modules
export interface ZohoEmployee {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  employeeStatus: string;
  location: string;
  reportingTo?: string;
}

export interface ZohoPayrollData {
  employeeId: string;
  basicSalary: number;
  grossSalary: number;
  netSalary: number;
  deductions: {
    pf: number;
    esi: number;
    tax: number;
    pt: number;
  };
  allowances: {
    hra: number;
    transport: number;
    medical: number;
    other: number;
  };
  payPeriod: string;
  payDate: string;
}

export interface ZohoProject {
  id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  owner: string;
  team: string[];
  progress: number;
  priority: 'High' | 'Medium' | 'Low';
  client?: string;
}

export interface ZohoTask {
  id: string;
  name: string;
  description: string;
  projectId: string;
  assignee: string;
  status: 'Open' | 'InProgress' | 'Completed' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  startDate: string;
  dueDate: string;
  progress: number;
  estimatedHours: number;
  actualHours: number;
}

export interface ZohoCRMContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  designation: string;
  leadSource: string;
  stage: string;
  value: number;
  createdDate: string;
  modifiedDate: string;
  owner: string;
}

export interface ZohoCRMDeal {
  id: string;
  dealName: string;
  contactName: string;
  accountName: string;
  stage: string;
  amount: number;
  closingDate: string;
  probability: number;
  leadSource: string;
  owner: string;
  description: string;
  createdDate: string;
}

export interface ZohoTimesheet {
  id: string;
  employeeId: string;
  projectId: string;
  taskId: string;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
}

class ZohoAPIService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Try to get tokens from localStorage
    this.accessToken = localStorage.getItem('zoho_access_token');
    this.refreshToken = localStorage.getItem('zoho_refresh_token');
  }

  // Step 1: Generate OAuth URL for user authorization
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: ZOHO_CONFIG.CLIENT_ID,
      scope: ZOHO_CONFIG.SCOPES,
      redirect_uri: ZOHO_CONFIG.REDIRECT_URI,
      access_type: 'offline',
    });

    return `https://accounts.zoho.com/oauth/v2/auth?${params.toString()}`;
  }

  // Step 2: Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<void> {
    try {
      const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', {
        grant_type: 'authorization_code',
        client_id: ZOHO_CONFIG.CLIENT_ID,
        client_secret: ZOHO_CONFIG.CLIENT_SECRET,
        redirect_uri: ZOHO_CONFIG.REDIRECT_URI,
        code,
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;

      // Store tokens
      localStorage.setItem('zoho_access_token', this.accessToken!);
      localStorage.setItem('zoho_refresh_token', this.refreshToken!);
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  // Refresh access token when it expires
  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', {
        grant_type: 'refresh_token',
        client_id: ZOHO_CONFIG.CLIENT_ID,
        client_secret: ZOHO_CONFIG.CLIENT_SECRET,
        refresh_token: this.refreshToken,
      });

      this.accessToken = response.data.access_token;
      localStorage.setItem('zoho_access_token', this.accessToken!);
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  // Make authenticated API requests
  private async makeRequest(url: string, options: any = {}) {
    if (!this.accessToken) {
      throw new Error('No access token available. Please authenticate first.');
    }

    try {
      const response = await axios({
        url,
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token expired, try to refresh
        await this.refreshAccessToken();
        
        // Retry the request
        const response = await axios({
          url,
          headers: {
            'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });

        return response.data;
      }
      throw error;
    }
  }

  // Fetch all employees from Zoho People
  async getEmployees(): Promise<ZohoEmployee[]> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.PEOPLE_BASE_URL}/forms/employee/records`);
    return data.response.result || [];
  }

  // Fetch employee details by ID
  async getEmployeeById(employeeId: string): Promise<ZohoEmployee> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.PEOPLE_BASE_URL}/forms/employee/records/${employeeId}`);
    return data.response.result;
  }

  // Fetch payroll data for an employee
  async getEmployeePayroll(employeeId: string, payPeriod?: string): Promise<ZohoPayrollData[]> {
    let url = `${ZOHO_CONFIG.PAYROLL_BASE_URL}/employees/${employeeId}/payslips`;
    if (payPeriod) {
      url += `?pay_period=${payPeriod}`;
    }
    
    const data = await this.makeRequest(url);
    return data.payslips || [];
  }

  // Fetch attendance data
  async getAttendanceData(employeeId?: string, from?: string, to?: string) {
    let url = `${ZOHO_CONFIG.PEOPLE_BASE_URL}/attendance/getAttendanceEntries`;
    const params = new URLSearchParams();
    
    if (employeeId) params.append('empId', employeeId);
    if (from) params.append('fromDate', from);
    if (to) params.append('toDate', to);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const data = await this.makeRequest(url);
    return data.response.result || [];
  }

  // === ZOHO PROJECTS API METHODS ===
  
  // Fetch all projects
  async getProjects(): Promise<ZohoProject[]> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.PROJECTS_BASE_URL}/projects`);
    return data.projects || [];
  }

  // Fetch project details by ID
  async getProjectById(projectId: string): Promise<ZohoProject> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.PROJECTS_BASE_URL}/projects/${projectId}`);
    return data.project;
  }

  // Fetch tasks for a project
  async getProjectTasks(projectId: string): Promise<ZohoTask[]> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.PROJECTS_BASE_URL}/projects/${projectId}/tasks`);
    return data.tasks || [];
  }

  // Create a new project
  async createProject(projectData: Partial<ZohoProject>): Promise<ZohoProject> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.PROJECTS_BASE_URL}/projects`, {
      method: 'POST',
      data: projectData
    });
    return data.project;
  }

  // Update project
  async updateProject(projectId: string, projectData: Partial<ZohoProject>): Promise<ZohoProject> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.PROJECTS_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      data: projectData
    });
    return data.project;
  }

  // Fetch project timesheets
  async getProjectTimesheets(projectId: string, from?: string, to?: string): Promise<ZohoTimesheet[]> {
    let url = `${ZOHO_CONFIG.PROJECTS_BASE_URL}/projects/${projectId}/logs`;
    const params = new URLSearchParams();
    
    if (from) params.append('from_date', from);
    if (to) params.append('to_date', to);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const data = await this.makeRequest(url);
    return data.timelogs || [];
  }

  // === ZOHO CRM API METHODS ===
  
  // Fetch all contacts
  async getCRMContacts(page: number = 1, perPage: number = 200): Promise<ZohoCRMContact[]> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.CRM_BASE_URL}/Contacts?page=${page}&per_page=${perPage}`);
    return data.data || [];
  }

  // Fetch all deals
  async getCRMDeals(page: number = 1, perPage: number = 200): Promise<ZohoCRMDeal[]> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.CRM_BASE_URL}/Deals?page=${page}&per_page=${perPage}`);
    return data.data || [];
  }

  // Fetch contact by ID
  async getCRMContactById(contactId: string): Promise<ZohoCRMContact> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.CRM_BASE_URL}/Contacts/${contactId}`);
    return data.data[0];
  }

  // Fetch deal by ID
  async getCRMDealById(dealId: string): Promise<ZohoCRMDeal> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.CRM_BASE_URL}/Deals/${dealId}`);
    return data.data[0];
  }

  // Create new contact
  async createCRMContact(contactData: Partial<ZohoCRMContact>): Promise<ZohoCRMContact> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.CRM_BASE_URL}/Contacts`, {
      method: 'POST',
      data: { data: [contactData] }
    });
    return data.data[0];
  }

  // Create new deal
  async createCRMDeal(dealData: Partial<ZohoCRMDeal>): Promise<ZohoCRMDeal> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.CRM_BASE_URL}/Deals`, {
      method: 'POST',
      data: { data: [dealData] }
    });
    return data.data[0];
  }

  // Update contact
  async updateCRMContact(contactId: string, contactData: Partial<ZohoCRMContact>): Promise<ZohoCRMContact> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.CRM_BASE_URL}/Contacts/${contactId}`, {
      method: 'PUT',
      data: { data: [contactData] }
    });
    return data.data[0];
  }

  // Update deal
  async updateCRMDeal(dealId: string, dealData: Partial<ZohoCRMDeal>): Promise<ZohoCRMDeal> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.CRM_BASE_URL}/Deals/${dealId}`, {
      method: 'PUT',
      data: { data: [dealData] }
    });
    return data.data[0];
  }

  // === ZOHO PAYROLL ENHANCED METHODS ===
  
  // Get payroll summary for all employees
  async getPayrollSummary(payPeriod?: string): Promise<any> {
    let url = `${ZOHO_CONFIG.PAYROLL_BASE_URL}/payslips`;
    if (payPeriod) {
      url += `?pay_period=${payPeriod}`;
    }
    
    const data = await this.makeRequest(url);
    return data;
  }

  // Get employee salary details
  async getEmployeeSalaryDetails(employeeId: string): Promise<any> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.PAYROLL_BASE_URL}/employees/${employeeId}/salary`);
    return data;
  }

  // Get leave details for an employee
  async getEmployeeLeaves(employeeId: string, year?: number): Promise<any> {
    let url = `${ZOHO_CONFIG.PEOPLE_BASE_URL}/forms/leave/records`;
    if (employeeId) {
      url += `?employee_id=${employeeId}`;
      if (year) {
        url += `&year=${year}`;
      }
    }
    
    const data = await this.makeRequest(url);
    return data.response.result || [];
  }

  // === ANALYTICS AND REPORTING METHODS ===
  
  // Get project analytics
  async getProjectAnalytics(): Promise<any> {
    const projects = await this.getProjects();
    const analytics = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'Active').length,
      completedProjects: projects.filter(p => p.status === 'Completed').length,
      totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
      totalSpent: projects.reduce((sum, p) => sum + (p.spent || 0), 0),
      projectsByStatus: projects.reduce((acc: any, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      }, {})
    };
    return analytics;
  }

  // Get CRM analytics
  async getCRMAnalytics(): Promise<any> {
    const [contacts, deals] = await Promise.all([
      this.getCRMContacts(),
      this.getCRMDeals()
    ]);

    const analytics = {
      totalContacts: contacts.length,
      totalDeals: deals.length,
      totalDealValue: deals.reduce((sum, d) => sum + (d.amount || 0), 0),
      dealsByStage: deals.reduce((acc: any, d) => {
        acc[d.stage] = (acc[d.stage] || 0) + 1;
        return acc;
      }, {}),
      averageDealValue: deals.length > 0 ? deals.reduce((sum, d) => sum + (d.amount || 0), 0) / deals.length : 0
    };
    return analytics;
  }

  // Get HR analytics
  async getHRAnalytics(): Promise<any> {
    const employees = await this.getEmployees();
    
    const analytics = {
      totalEmployees: employees.length,
      departmentWise: employees.reduce((acc: any, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
        return acc;
      }, {}),
      locationWise: employees.reduce((acc: any, emp) => {
        acc[emp.location] = (acc[emp.location] || 0) + 1;
        return acc;
      }, {}),
      activeEmployees: employees.filter(emp => emp.employeeStatus === 'Active').length
    };
    return analytics;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Clear authentication
  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('zoho_access_token');
    localStorage.removeItem('zoho_refresh_token');
  }
}

export const zohoAPI = new ZohoAPIService();
