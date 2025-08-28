import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zohoAPI, ZohoProject, ZohoCRMDeal, ZohoEmployee } from "@/services/zohoAPI";
import ZohoSetupGuide from "./ZohoSetupGuide";
import { 
  Users, BarChart3, UserCheck,
  Target, AlertCircle, RefreshCw
} from "lucide-react";

interface DashboardProps {
  module: 'overview' | 'project' | 'crm' | 'people' | 'finance' | 'setup';
}

export default function ZohoIntegratedDashboard({ module }: DashboardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Data states
  const [projects, setProjects] = useState<ZohoProject[]>([]);
  const [deals, setDeals] = useState<ZohoCRMDeal[]>([]);
  const [employees, setEmployees] = useState<ZohoEmployee[]>([]);
  const [analytics, setAnalytics] = useState<any>({});

  const fetchData = async () => {
    if (!zohoAPI.isAuthenticated()) {
      setError("Please authenticate with Zoho first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      switch (module) {
        case 'overview':
          const [projectAnalytics, crmAnalytics, hrAnalytics] = await Promise.all([
            zohoAPI.getProjectAnalytics(),
            zohoAPI.getCRMAnalytics(),
            zohoAPI.getHRAnalytics()
          ]);
          setAnalytics({ project: projectAnalytics, crm: crmAnalytics, hr: hrAnalytics });
          break;

        case 'project':
          const [projectList, projectAnalyticsData] = await Promise.all([
            zohoAPI.getProjects(),
            zohoAPI.getProjectAnalytics()
          ]);
          setProjects(projectList);
          setAnalytics(projectAnalyticsData);
          break;

        case 'crm':
          const [dealList, crmAnalyticsData] = await Promise.all([
            zohoAPI.getCRMDeals(),
            zohoAPI.getCRMAnalytics()
          ]);
          setDeals(dealList);
          setAnalytics(crmAnalyticsData);
          break;

        case 'people':
          const [employeeList, hrAnalyticsData] = await Promise.all([
            zohoAPI.getEmployees(),
            zohoAPI.getHRAnalytics()
          ]);
          setEmployees(employeeList);
          setAnalytics(hrAnalyticsData);
          break;
      }

      setLastSync(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data from Zoho');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [module]);

  const renderOverviewDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Active Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">
              {analytics.project?.activeProjects || 0}
            </div>
            <p className="text-xs text-amber-600">
              Total: {analytics.project?.totalProjects || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Total Deals</CardTitle>
            <Target className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">
              {analytics.crm?.totalDeals || 0}
            </div>
            <p className="text-xs text-amber-600">
              Value: ₹{(analytics.crm?.totalDealValue || 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">
              {analytics.hr?.totalEmployees || 0}
            </div>
            <p className="text-xs text-amber-600">
              Active: {analytics.hr?.activeEmployees || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Total Contacts</CardTitle>
            <UserCheck className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">
              {analytics.crm?.totalContacts || 0}
            </div>
            <p className="text-xs text-amber-600">
              Avg Deal: ₹{(analytics.crm?.averageDealValue || 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProjectDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Active</span>
                <span className="font-bold">{analytics.activeProjects || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed</span>
                <span className="font-bold">{analytics.completedProjects || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Budget</span>
                <span className="font-bold">₹{(analytics.totalBudget || 0).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-amber-800">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-gray-600">{project.status}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">₹{project.budget?.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{project.progress}% complete</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCRMDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Deals Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(analytics.dealsByStage || {}).map(([stage, count]) => (
                <div key={stage} className="flex justify-between">
                  <span>{stage}</span>
                  <span className="font-bold">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Recent Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deals.slice(0, 5).map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{deal.dealName}</h3>
                    <p className="text-sm text-gray-600">{deal.stage}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">₹{deal.amount?.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{deal.probability}% probability</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPeopleDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Department Wise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(analytics.departmentWise || {}).map(([dept, count]) => (
                <div key={dept} className="flex justify-between">
                  <span>{dept}</span>
                  <span className="font-bold">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Recent Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employees.slice(0, 5).map((employee) => (
                <div key={employee.employeeId} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{employee.firstName} {employee.lastName}</h3>
                    <p className="text-sm text-gray-600">{employee.designation}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{employee.department}</div>
                    <div className="text-xs text-gray-500">{employee.employeeStatus}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (module) {
      case 'overview':
        return renderOverviewDashboard();
      case 'project':
        return renderProjectDashboard();
      case 'crm':
        return renderCRMDashboard();
      case 'people':
        return renderPeopleDashboard();
      case 'setup':
        return <ZohoSetupGuide />;
      default:
        return renderOverviewDashboard();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-amber-800 capitalize">
            {module === 'overview' ? 'Dashboard Overview' : `${module} Dashboard`}
          </h2>
          <p className="text-amber-600">
            {zohoAPI.isAuthenticated() ? 'Connected to Zoho' : 'Not connected to Zoho'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {lastSync && (
            <div className="text-sm text-amber-600">
              Last sync: {lastSync.toLocaleTimeString()}
            </div>
          )}
          <Button 
            onClick={fetchData} 
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Syncing...' : 'Sync Data'}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Authentication Required */}
      {!zohoAPI.isAuthenticated() && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-amber-800 mb-2">
                Zoho Authentication Required
              </h3>
              <p className="text-amber-600 mb-4">
                Connect to Zoho to view live data from your Projects, CRM, People, and Payroll modules.
              </p>
              <Button 
                onClick={() => window.open(zohoAPI.getAuthorizationUrl(), '_blank')}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Connect to Zoho
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Content */}
      {zohoAPI.isAuthenticated() && !error && (
        <div className={loading ? 'opacity-50 pointer-events-none' : ''}>
          {renderContent()}
        </div>
      )}
    </div>
  );
}
