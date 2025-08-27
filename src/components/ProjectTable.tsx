import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

// Real project data from your system
const PROJECT_DATA = [
  { id: 'NA-110', systemId: '293012000000431259', name: 'Aug tracker', access: 'Private', customer: '-', completion: '40%', owner: 'Karthik M K', status: 'Active', openTasks: 3, closedTasks: 2, group: 'Finance', startDate: '', endDate: '', tags: '' },
  { id: 'NA-109', systemId: '293012000000372023', name: 'HR Monthly Tracker August 2025', access: 'Private', customer: '-', completion: '45%', owner: 'Shruthi Nandeesh', status: 'Active', openTasks: 23, closedTasks: 19, group: 'Ungrouped Projects', startDate: '', endDate: '', tags: '' },
  { id: 'NA-108', systemId: '293012000000351081', name: 'Under Review, Under Preparation, Dropped Opportunities', access: 'Private', customer: '-', completion: '14%', owner: 'Munavar Sheik', status: 'Active', openTasks: 18, closedTasks: 3, group: 'NIPL', startDate: '', endDate: '', tags: '' },
  { id: 'NA-107', systemId: '293012000000320136', name: 'Kimmane Resort - Bangalore', access: 'Private', customer: '-', completion: '100%', owner: 'Nirup Jayanth', status: 'Active', openTasks: 0, closedTasks: 2, group: 'Ungrouped Projects', startDate: '', endDate: '', tags: '' },
  { id: 'NA-106', systemId: '293012000000319101', name: 'Kimmane Residential', access: 'Private', customer: '-', completion: '58%', owner: 'Nirup Jayanth', status: 'Active', openTasks: 5, closedTasks: 7, group: 'Ungrouped Projects', startDate: '', endDate: '', tags: '' },
  { id: 'NA-104', systemId: '293012000000314095', name: 'Hogenakkal Upcoming construction tender', access: 'Private', customer: '-', completion: '60%', owner: 'Munavar Sheik', status: 'Active', openTasks: 2, closedTasks: 3, group: 'NIPL', startDate: '', endDate: '', tags: '' },
  { id: 'NA-103', systemId: '293012000000294563', name: 'iSky Tablespace Collaboration for Pre-leased development', access: 'Private', customer: '-', completion: '100%', owner: 'Nirup Jayanth', status: 'Active', openTasks: 0, closedTasks: 3, group: 'Ungrouped Projects', startDate: '', endDate: '', tags: '' },
  { id: 'NA-102', systemId: '293012000000294437', name: 'iSky - Healthpals Collaboration for Smart Health Kiosks', access: 'Private', customer: '-', completion: '66%', owner: 'Nirup Jayanth', status: 'Active', openTasks: 1, closedTasks: 2, group: 'Ungrouped Projects', startDate: '22/07/2025', endDate: '31/07/2025', tags: '' },
  { id: 'NA-101', systemId: '293012000000298085', name: 'Daily updation', access: 'Private', customer: '-', completion: '97%', owner: 'Prasanna Hegde', status: 'In Progress', openTasks: 1, closedTasks: 34, group: 'Consulting', startDate: '21/07/2025', endDate: '31/07/2025', tags: '' },
  { id: 'NA-99', systemId: '293012000000294049', name: 'EOI for Empanelment of electrical vending vehicles for BBMP', access: 'Private', customer: '-', completion: '83%', owner: 'Munavar Sheik', status: 'Active', openTasks: 1, closedTasks: 5, group: 'Consulting', startDate: '', endDate: '', tags: '' },
  { id: 'NA-98', systemId: '293012000000281031', name: 'D&C TWIN TUNNEL Package-2 Silk Board', access: 'Private', customer: '-', completion: '0%', owner: 'Munavar Sheik', status: 'Active', openTasks: 3, closedTasks: 0, group: 'NIPL', startDate: '15/07/2025', endDate: '02/09/2025', tags: '' },
  { id: 'NA-84', systemId: '293012000000264664', name: 'Construction Of Tech Infra At Bikaner Airport', access: 'Private', customer: '-', completion: '71%', owner: 'Munavar Sheik', status: 'Active', openTasks: 2, closedTasks: 5, group: 'NIPL', startDate: '19/06/2025', endDate: '11/08/2025', tags: 'Bikaner Airport MES' },
  { id: 'NA-87', systemId: '293012000000265745', name: 'Dal Moro - Cafe Interiors - Phoenix Market City', access: 'Private', customer: '-', completion: '8%', owner: 'Siddharth Venkat', status: 'Active', openTasks: 107, closedTasks: 10, group: 'Real Estate', startDate: '15/07/2025', endDate: '15/07/2025', tags: '' },
  { id: 'NA-45', systemId: '293012000000230905', name: 'Dal Moro\'s Marketing', access: 'Private', customer: '-', completion: '80%', owner: 'Dipti Amarnath', status: 'In Progress', openTasks: 3, closedTasks: 12, group: 'Digital Marketing', startDate: '', endDate: '', tags: '' },
  { id: 'NA-43', systemId: '293012000000230601', name: 'Rainland_Isuzu Marketing', access: 'Private', customer: '-', completion: '69%', owner: 'Dipti Amarnath', status: 'In Progress', openTasks: 8, closedTasks: 18, group: 'Digital Marketing', startDate: '', endDate: '', tags: '' },
];

interface ProjectTableProps {
  searchable?: boolean;
  maxRows?: number;
}

const ProjectTable: React.FC<ProjectTableProps> = ({ searchable = true, maxRows = 10 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'completion' | 'status'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort projects
  const filteredProjects = PROJECT_DATA.filter(project =>
    project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'completion') {
      const aValue = parseInt(a.completion.replace('%', ''));
      const bValue = parseInt(b.completion.replace('%', ''));
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedProjects.length / maxRows);
  const startIndex = (currentPage - 1) * maxRows;
  const currentProjects = sortedProjects.slice(startIndex, startIndex + maxRows);

  const handleSort = (column: 'id' | 'name' | 'completion' | 'status') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'In Progress': return 'text-blue-600 bg-blue-50';
      case 'Completed': return 'text-purple-600 bg-purple-50';
      case 'On Hold': return 'text-orange-600 bg-orange-50';
      case 'Delayed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCompletionColor = (completion: string) => {
    const percent = parseInt(completion.replace('%', ''));
    if (percent >= 90) return 'text-green-700 bg-green-100';
    if (percent >= 70) return 'text-blue-700 bg-blue-100';
    if (percent >= 50) return 'text-yellow-700 bg-yellow-100';
    if (percent >= 25) return 'text-orange-700 bg-orange-100';
    return 'text-red-700 bg-red-100';
  };

  return (
    <Card className="bg-gradient-to-br from-white via-amber-50 to-yellow-50 border-amber-200 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-amber-800">Project Portfolio</CardTitle>
            <CardDescription className="text-amber-700">
              Comprehensive view of all active projects ({filteredProjects.length} projects)
            </CardDescription>
          </div>
          {searchable && (
            <div className="w-64">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-amber-300 focus:border-amber-500"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-amber-200">
                <th 
                  className="text-left p-3 font-medium text-amber-800 cursor-pointer hover:bg-amber-100 transition-colors"
                  onClick={() => handleSort('id')}
                >
                  Project ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-left p-3 font-medium text-amber-800 cursor-pointer hover:bg-amber-100 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Project Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 font-medium text-amber-800">Owner</th>
                <th className="text-left p-3 font-medium text-amber-800">Group</th>
                <th 
                  className="text-left p-3 font-medium text-amber-800 cursor-pointer hover:bg-amber-100 transition-colors"
                  onClick={() => handleSort('completion')}
                >
                  Progress {sortBy === 'completion' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-left p-3 font-medium text-amber-800 cursor-pointer hover:bg-amber-100 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 font-medium text-amber-800">Tasks</th>
              </tr>
            </thead>
            <tbody>
              {currentProjects.map((project, index) => (
                <tr 
                  key={project.id} 
                  className={`border-b border-amber-100 hover:bg-amber-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-amber-25'
                  }`}
                >
                  <td className="p-3">
                    <span className="font-medium text-amber-900">{project.id}</span>
                  </td>
                  <td className="p-3 max-w-xs">
                    <div className="text-amber-900 font-medium truncate" title={project.name}>
                      {project.name}
                    </div>
                  </td>
                  <td className="p-3 text-amber-700">{project.owner}</td>
                  <td className="p-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                      {project.group}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-sm px-2 py-1 rounded-full font-medium ${getCompletionColor(project.completion)}`}>
                      {project.completion}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-sm px-2 py-1 rounded-full font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-amber-700">
                    <div className="flex space-x-2">
                      <span className="text-green-600">{project.closedTasks} ✓</span>
                      <span className="text-orange-600">{project.openTasks} ⏳</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-amber-200">
            <div className="text-sm text-amber-700">
              Showing {startIndex + 1} to {Math.min(startIndex + maxRows, sortedProjects.length)} of {sortedProjects.length} projects
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-amber-300 text-amber-800 hover:bg-amber-50"
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-amber-800">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-amber-300 text-amber-800 hover:bg-amber-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTable;
