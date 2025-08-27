import axios from 'axios';

// Zoho API Configuration
const ZOHO_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_ZOHO_CLIENT_ID || '',
  CLIENT_SECRET: import.meta.env.VITE_ZOHO_CLIENT_SECRET || '',
  REDIRECT_URI: import.meta.env.VITE_ZOHO_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  SCOPES: 'ZohoPeople.employee.ALL,ZohoPayroll.employees.ALL',
  BASE_URL: 'https://people.zoho.com/people/api',
  PAYROLL_BASE_URL: 'https://payroll.zoho.com/api/v1',
};

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
    const data = await this.makeRequest(`${ZOHO_CONFIG.BASE_URL}/forms/employee/records`);
    return data.response.result || [];
  }

  // Fetch employee details by ID
  async getEmployeeById(employeeId: string): Promise<ZohoEmployee> {
    const data = await this.makeRequest(`${ZOHO_CONFIG.BASE_URL}/forms/employee/records/${employeeId}`);
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
    let url = `${ZOHO_CONFIG.BASE_URL}/attendance/getAttendanceEntries`;
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
