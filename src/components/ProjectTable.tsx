import React, { useState, useMemo } from 'react';
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

interface GroupStats {
  totalProjects: number;
  completedProjects: number;
  avgCompletion: number;
  totalOpenTasks: number;
  totalClosedTasks: number;
  activeProjects: number;
}

const ProjectTable: React.FC<ProjectTableProps> = ({ searchable = true, maxRows = 10 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'completion' | 'status'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grouped'>('grouped');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Calculate group statistics
  const groupStats = useMemo(() => {
    const stats: Record<string, GroupStats> = {};
    
    PROJECT_DATA.forEach(project => {
      const group = project.group;
      if (!stats[group]) {
        stats[group] = {
          totalProjects: 0,
          completedProjects: 0,
          avgCompletion: 0,
          totalOpenTasks: 0,
          totalClosedTasks: 0,
          activeProjects: 0
        };
      }
      
      stats[group].totalProjects++;
      stats[group].totalOpenTasks += project.openTasks;
      stats[group].totalClosedTasks += project.closedTasks;
      
      const completion = parseInt(project.completion.replace('%', ''));
      if (completion >= 100) stats[group].completedProjects++;
      if (project.status === 'Active') stats[group].activeProjects++;
    });
    
    // Calculate average completion for each group
    Object.keys(stats).forEach(group => {
      const groupProjects = PROJECT_DATA.filter(p => p.group === group);
      const totalCompletion = groupProjects.reduce((sum, p) => 
        sum + parseInt(p.completion.replace('%', '')), 0);
      stats[group].avgCompletion = Math.round(totalCompletion / groupProjects.length);
    });
    
    return stats;
  }, []);

  // Group projects by group
  const groupedProjects = useMemo(() => {
    const groups: Record<string, typeof PROJECT_DATA> = {};
    PROJECT_DATA.forEach(project => {
      if (!groups[project.group]) {
        groups[project.group] = [];
      }
      groups[project.group].push(project);
    });
    return groups;
  }, []);

  // Filter and sort projects
  const filteredProjects = PROJECT_DATA.filter(project =>
    project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter by selected group if in drill-down mode
  const displayProjects = selectedGroup 
    ? filteredProjects.filter(p => p.group === selectedGroup)
    : filteredProjects;

  const sortedProjects = [...displayProjects].sort((a, b) => {
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

  const toggleGroupExpansion = (group: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  const handleGroupDrillDown = (group: string) => {
    setSelectedGroup(group);
    setViewMode('table');
    setCurrentPage(1);
  };

  const handleBackToOverview = () => {
    setSelectedGroup(null);
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

  const getCompletionColor = (completion: string | number) => {
    const percent = typeof completion === 'string' ? parseInt(completion.replace('%', '')) : completion;
    if (percent >= 90) return 'text-green-700 bg-green-100';
    if (percent >= 70) return 'text-blue-700 bg-blue-100';
    if (percent >= 50) return 'text-yellow-700 bg-yellow-100';
    if (percent >= 25) return 'text-orange-700 bg-orange-100';
    return 'text-red-700 bg-red-100';
  };

  const renderGroupedView = () => {
    return (
      <div className="space-y-4">
        {Object.entries(groupedProjects).map(([group, projects]) => {
          const stats = groupStats[group];
          const isExpanded = expandedGroups.has(group);
          
          return (
            <Card key={group} className="border border-slate-200 backdrop-blur-sm bg-white/50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleGroupExpansion(group)}
                        className="p-1 h-6 w-6 text-slate-600 hover:text-slate-800"
                      >
                        {isExpanded ? '−' : '+'}
                      </Button>
                      <CardTitle className="text-lg text-slate-800 font-semibold">
                        {group}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGroupDrillDown(group)}
                        className="text-xs border-slate-300 text-slate-600 hover:bg-slate-50"
                      >
                        Drill Down →
                      </Button>
                    </div>
                    
                    {/* Group Statistics */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">{stats.totalProjects}</div>
                        <div className="text-xs text-slate-600">Total Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.activeProjects}</div>
                        <div className="text-xs text-slate-600">Active</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getCompletionColor(stats.avgCompletion).split(' ')[0]}`}>
                          {stats.avgCompletion}%
                        </div>
                        <div className="text-xs text-slate-600">Avg Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.completedProjects}</div>
                        <div className="text-xs text-slate-600">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.totalOpenTasks}</div>
                        <div className="text-xs text-slate-600">Open Tasks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.totalClosedTasks}</div>
                        <div className="text-xs text-slate-600">Closed Tasks</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left p-2 text-sm font-medium text-slate-700">Project ID</th>
                          <th className="text-left p-2 text-sm font-medium text-slate-700">Name</th>
                          <th className="text-left p-2 text-sm font-medium text-slate-700">Owner</th>
                          <th className="text-left p-2 text-sm font-medium text-slate-700">Progress</th>
                          <th className="text-left p-2 text-sm font-medium text-slate-700">Status</th>
                          <th className="text-left p-2 text-sm font-medium text-slate-700">Tasks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.slice(0, 5).map((project) => (
                          <tr key={project.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="p-2 text-sm text-slate-800 font-medium">{project.id}</td>
                            <td className="p-2 text-sm text-slate-700 max-w-xs truncate" title={project.name}>
                              {project.name}
                            </td>
                            <td className="p-2 text-sm text-slate-600">{project.owner}</td>
                            <td className="p-2">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCompletionColor(project.completion)}`}>
                                {project.completion}
                              </span>
                            </td>
                            <td className="p-2">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="p-2 text-sm">
                              <div className="flex space-x-2">
                                <span className="text-green-600">{project.closedTasks} ✓</span>
                                <span className="text-orange-600">{project.openTasks} ⏳</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {projects.length > 5 && (
                      <div className="mt-2 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGroupDrillDown(group)}
                          className="text-xs border-slate-300 text-slate-600 hover:bg-slate-50"
                        >
                          View All {projects.length} Projects →
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="backdrop-blur-sm bg-gradient-to-br from-slate-900/90 via-purple-900/90 to-slate-900/90 border border-purple-500/20 shadow-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-4">
              <CardTitle className="text-xl text-white font-bold">
                {selectedGroup ? `${selectedGroup} Projects` : 'Project Portfolio'}
              </CardTitle>
              {selectedGroup && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToOverview}
                  className="border-purple-400/50 text-purple-300 hover:bg-purple-400/10"
                >
                  ← Back to Overview
                </Button>
              )}
            </div>
            <CardDescription className="text-purple-200">
              {selectedGroup 
                ? `Detailed view of ${selectedGroup} projects (${displayProjects.length} projects)`
                : `Comprehensive project management view (${filteredProjects.length} projects)`
              }
            </CardDescription>
          </div>
          <div className="flex items-center space-x-3">
            {!selectedGroup && (
              <div className="flex bg-slate-800/50 rounded-lg p-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="text-xs text-white"
                >
                  Table View
                </Button>
                <Button
                  variant={viewMode === 'grouped' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grouped')}
                  className="text-xs text-white"
                >
                  Group View
                </Button>
              </div>
            )}
            {searchable && (
              <div className="w-64">
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800/50 border-purple-400/30 text-white placeholder-purple-300 focus:border-purple-400"
                />
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'grouped' && !selectedGroup ? (
          renderGroupedView()
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-purple-400/20">
                    <th 
                      className="text-left p-3 font-medium text-purple-200 cursor-pointer hover:bg-purple-400/10 transition-colors"
                      onClick={() => handleSort('id')}
                    >
                      Project ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 font-medium text-purple-200 cursor-pointer hover:bg-purple-400/10 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      Project Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left p-3 font-medium text-purple-200">Owner</th>
                    <th className="text-left p-3 font-medium text-purple-200">Group</th>
                    <th 
                      className="text-left p-3 font-medium text-purple-200 cursor-pointer hover:bg-purple-400/10 transition-colors"
                      onClick={() => handleSort('completion')}
                    >
                      Progress {sortBy === 'completion' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-3 font-medium text-purple-200 cursor-pointer hover:bg-purple-400/10 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left p-3 font-medium text-purple-200">Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProjects.map((project, index) => (
                    <tr 
                      key={project.id} 
                      className={`border-b border-purple-400/10 hover:bg-purple-400/5 transition-colors ${
                        index % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/10'
                      }`}
                    >
                      <td className="p-3">
                        <span className="font-medium text-white">{project.id}</span>
                      </td>
                      <td className="p-3 max-w-xs">
                        <div className="text-white font-medium truncate" title={project.name}>
                          {project.name}
                        </div>
                      </td>
                      <td className="p-3 text-purple-200">{project.owner}</td>
                      <td className="p-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-400/20 text-purple-200 border border-purple-400/30">
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
                      <td className="p-3 text-sm text-purple-200">
                        <div className="flex space-x-2">
                          <span className="text-green-400">{project.closedTasks} ✓</span>
                          <span className="text-orange-400">{project.openTasks} ⏳</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-purple-400/20">
                <div className="text-sm text-purple-200">
                  Showing {startIndex + 1} to {Math.min(startIndex + maxRows, sortedProjects.length)} of {sortedProjects.length} projects
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-purple-400/30 text-purple-200 hover:bg-purple-400/10"
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-3 text-purple-200">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-purple-400/30 text-purple-200 hover:bg-purple-400/10"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTable;
