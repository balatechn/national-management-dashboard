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
  const [viewMode, setViewMode] = useState<'table' | 'grouped' | 'graphical'>('graphical');
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
      default: return 'text-amber-700 bg-amber-50';
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

  const renderGraphicalView = () => {
    const categoryIcons: { [key: string]: string } = {
      'NIPL': '🏗️',
      'Real Estate': '🏢',
      'Consulting': '💼',
      'Digital Marketing': '📱',
      'Finance': '💰',
      'Ungrouped Projects': '📋'
    };

    const categoryColors: { [key: string]: string } = {
      'NIPL': 'from-blue-500 to-indigo-600',
      'Real Estate': 'from-green-500 to-emerald-600',
      'Consulting': 'from-purple-500 to-violet-600',
      'Digital Marketing': 'from-pink-500 to-rose-600',
      'Finance': 'from-yellow-500 to-amber-600',
      'Ungrouped Projects': 'from-gray-500 to-slate-600'
    };

    return (
      <div className="space-y-8">
        {/* Project Categories Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-amber-200/50 shadow-2xl">
          <div className="mb-6">
            <h3 className="text-2xl font-display font-bold text-amber-800 mb-2">Project Categories</h3>
            <p className="text-amber-600 font-serif">Click on items to explore detailed insights</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(groupedProjects).map(([group], index) => {
              const stats = groupStats[group];
              const icon = categoryIcons[group] || '📁';
              const colorClass = categoryColors[group] || 'from-amber-500 to-yellow-600';
              
              return (
                <div
                  key={group}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r ${colorClass} p-6 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fadeInUp`}
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => handleGroupDrillDown(group)}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-4xl">{icon}</span>
                        <div>
                          <h4 className="text-white font-bold text-lg">{group}</h4>
                          <p className="text-white/80 text-sm">{stats.totalProjects} active projects</p>
                        </div>
                      </div>
                      <span className="text-white/60 text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{stats.activeProjects}</div>
                        <div className="text-xs text-white/80 uppercase tracking-wide">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{stats.avgCompletion}%</div>
                        <div className="text-xs text-white/80 uppercase tracking-wide">Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{stats.totalOpenTasks}</div>
                        <div className="text-xs text-white/80 uppercase tracking-wide">Tasks</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-12 translate-y-12 group-hover:scale-125 transition-transform duration-500"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-amber-200/50 shadow-2xl">
          <div className="mb-6">
            <h3 className="text-2xl font-display font-bold text-amber-800 mb-2">Quick Actions</h3>
            <p className="text-amber-600 font-serif">Intelligent tools for enhanced productivity</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl p-6 group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Generate Reports</h4>
                  <p className="text-white/80 text-sm">Create comprehensive analytics</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl p-6 group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Interactive Analysis</h4>
                  <p className="text-white/80 text-sm">Explore data insights</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl p-6 group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Manage Data</h4>
                  <p className="text-white/80 text-sm">Configure and optimize</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl p-6 group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <span className="text-2xl">📦</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Bulk Operations</h4>
                  <p className="text-white/80 text-sm">Import and process data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGroupedView = () => {
    return (
      <div className="space-y-4">
        {Object.entries(groupedProjects).map(([group, projects]) => {
          const stats = groupStats[group];
          const isExpanded = expandedGroups.has(group);
          
          return (
            <Card key={group} className="border border-amber-300/50 backdrop-blur-sm bg-amber-50/80">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleGroupExpansion(group)}
                        className="p-1 h-6 w-6 text-amber-700 hover:text-amber-900 font-bold"
                      >
                        {isExpanded ? '−' : '+'}
                      </Button>
                      <CardTitle className="text-xl text-amber-800 font-light tracking-wide bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">
                        {group}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGroupDrillDown(group)}
                        className="text-xs border-amber-300 text-amber-700 hover:bg-amber-100/50 font-semibold tracking-wider"
                      >
                        Drill Down →
                      </Button>
                    </div>
                    
                    {/* Group Statistics */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-extralight bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">{stats.totalProjects}</div>
                        <div className="text-xs text-amber-700 font-semibold tracking-wider uppercase">Total Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-extralight text-emerald-600">{stats.activeProjects}</div>
                        <div className="text-xs text-amber-700 font-semibold tracking-wider uppercase">Active</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-3xl font-extralight ${getCompletionColor(stats.avgCompletion).split(' ')[0]}`}>
                          {stats.avgCompletion}%
                        </div>
                        <div className="text-xs text-amber-700 font-semibold tracking-wider uppercase">Avg Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-extralight text-purple-600">{stats.completedProjects}</div>
                        <div className="text-xs text-amber-700 font-semibold tracking-wider uppercase">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-extralight text-orange-600">{stats.totalOpenTasks}</div>
                        <div className="text-xs text-amber-700 font-semibold tracking-wider uppercase">Open Tasks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-extralight text-emerald-600">{stats.totalClosedTasks}</div>
                        <div className="text-xs text-amber-700 font-semibold tracking-wider uppercase">Closed Tasks</div>
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
    <Card className="backdrop-blur-xl bg-gradient-to-br from-white/95 via-amber-50/90 to-yellow-50/90 border border-amber-300/40 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fadeInUp">
      <CardHeader className="pb-6 pt-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl shadow-lg animate-bounceIn">
                  <span className="text-white text-2xl">📊</span>
                </div>
                <div>
                  <CardTitle className="text-3xl font-display font-bold bg-gradient-to-r from-amber-700 via-yellow-600 to-orange-700 bg-clip-text text-transparent tracking-wide animate-slideInLeft">
                    {selectedGroup ? `${selectedGroup} Projects` : 'Project Portfolio'}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full animate-shimmer"></div>
                    <span className="text-amber-600 text-sm font-semibold">
                      {selectedGroup ? 'Department View' : 'Enterprise Dashboard'}
                    </span>
                  </div>
                </div>
              </div>
              {selectedGroup && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToOverview}
                  className="border-amber-300/50 text-amber-700 hover:bg-amber-100/50 animate-fadeInUp animation-delay-400"
                >
                  ← Back to Overview
                </Button>
              )}
            </div>
            <CardDescription className="text-amber-700 font-serif text-lg leading-relaxed animate-fadeInUp animation-delay-200">
              {selectedGroup 
                ? `Detailed analysis of ${selectedGroup} department projects with comprehensive metrics and insights (${displayProjects.length} active projects)`
                : `Comprehensive project management dashboard with advanced analytics and real-time monitoring (${filteredProjects.length} projects across multiple departments)`
              }
            </CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-4 animate-fadeInUp animation-delay-600">
            {!selectedGroup && (
              <div className="flex bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-2 border border-amber-200/50 shadow-lg">
                <Button
                  variant={viewMode === 'graphical' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('graphical')}
                  className={`text-sm font-semibold transition-all duration-300 ${
                    viewMode === 'graphical' 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg' 
                      : 'text-amber-700 hover:bg-amber-100/50'
                  }`}
                >
                  🎨 Visual Dashboard
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className={`text-sm font-semibold transition-all duration-300 ${
                    viewMode === 'table' 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg' 
                      : 'text-amber-700 hover:bg-amber-100/50'
                  }`}
                >
                  📋 Table View
                </Button>
                <Button
                  variant={viewMode === 'grouped' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grouped')}
                  className={`text-sm font-semibold transition-all duration-300 ${
                    viewMode === 'grouped' 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg' 
                      : 'text-amber-700 hover:bg-amber-100/50'
                  }`}
                >
                  🗂️ Group View
                </Button>
              </div>
            )}
            {searchable && (
              <div className="relative">
                <Input
                  placeholder="🔍 Search projects, owners, or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 bg-white/90 border-amber-200/60 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl pl-4 pr-12 py-3 text-amber-800 placeholder:text-amber-600/70 font-medium shadow-lg backdrop-blur-sm"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800 h-8 w-8 p-0"
                  >
                    ✕
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'graphical' && !selectedGroup ? (
          renderGraphicalView()
        ) : viewMode === 'grouped' && !selectedGroup ? (
          renderGroupedView()
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-amber-200/50">
                    <th 
                      className="text-left p-4 font-serif font-bold text-amber-800 cursor-pointer hover:bg-amber-100/30 transition-colors tracking-wide text-sm antialiased"
                      onClick={() => handleSort('id')}
                    >
                      Project ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-4 font-serif font-bold text-amber-800 cursor-pointer hover:bg-amber-100/30 transition-colors tracking-wide text-sm antialiased"
                      onClick={() => handleSort('name')}
                    >
                      Project Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left p-4 font-serif font-bold text-amber-800 tracking-wide text-sm antialiased">Owner</th>
                    <th className="text-left p-4 font-serif font-bold text-amber-800 tracking-wide text-sm antialiased">Group</th>
                    <th 
                      className="text-left p-4 font-serif font-bold text-amber-800 cursor-pointer hover:bg-amber-100/30 transition-colors tracking-wide text-sm antialiased"
                      onClick={() => handleSort('completion')}
                    >
                      Progress {sortBy === 'completion' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="text-left p-4 font-serif font-bold text-amber-800 cursor-pointer hover:bg-amber-100/30 transition-colors tracking-wide text-sm antialiased"
                      onClick={() => handleSort('status')}
                    >
                      Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left p-4 font-serif font-bold text-amber-800 tracking-wide text-sm antialiased">Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProjects.map((project, index) => (
                    <tr 
                      key={project.id} 
                      className={`border-b border-amber-200/30 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-yellow-50/50 transition-all duration-300 animate-fadeInUp group ${
                        index % 2 === 0 ? 'bg-white/70' : 'bg-amber-50/30'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="p-4">
                        <span className="font-semibold text-amber-800 group-hover:text-amber-900 transition-colors font-display tracking-wide">
                          {project.id}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="text-amber-900 font-medium truncate group-hover:text-amber-950 transition-colors antialiased" title={project.name}>
                          {project.name}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-amber-700 font-medium group-hover:text-amber-800 transition-colors">
                          {project.owner}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-300/60 shadow-sm font-semibold tracking-wide hover:shadow-md transition-all duration-200">
                          📁 {project.group}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-amber-100 rounded-full h-2 overflow-hidden shadow-inner">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500 rounded-full"
                              style={{ width: project.completion }}
                            ></div>
                          </div>
                          <span className={`text-sm px-2 py-1 rounded-full font-bold shadow-sm ${getCompletionColor(project.completion)}`}>
                            {project.completion}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center text-sm px-3 py-1.5 rounded-full font-semibold shadow-sm border transition-all duration-200 hover:shadow-md ${getStatusColor(project.status)}`}>
                          {project.status === 'Active' && '🟢'}
                          {project.status === 'In Progress' && '🔵'}
                          {project.status === 'Completed' && '🟣'}
                          {project.status === 'On Hold' && '🟡'}
                          {project.status === 'Delayed' && '🔴'}
                          <span className="ml-1">{project.status}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-lg border border-green-200/50">
                            <span className="text-green-700 font-semibold text-sm">{project.closedTasks}</span>
                            <span className="text-green-600 text-xs">✓</span>
                          </div>
                          <div className="flex items-center space-x-1 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200/50">
                            <span className="text-orange-700 font-semibold text-sm">{project.openTasks}</span>
                            <span className="text-orange-600 text-xs">⏳</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gradient-to-r from-amber-300/40 to-yellow-300/40">
                <div className="text-sm font-medium text-amber-700 bg-amber-50/50 px-4 py-2 rounded-lg border border-amber-200/50">
                  📊 Showing <span className="font-bold text-amber-800">{startIndex + 1}</span> to <span className="font-bold text-amber-800">{Math.min(startIndex + maxRows, sortedProjects.length)}</span> of <span className="font-bold text-amber-800">{sortedProjects.length}</span> projects
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-amber-300/60 text-amber-700 hover:bg-gradient-to-r hover:from-amber-100 hover:to-yellow-100 disabled:opacity-50 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    ← Previous
                  </Button>
                  <div className="flex items-center bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 rounded-lg border border-amber-300/50 shadow-sm">
                    <span className="text-amber-800 font-semibold">
                      Page <span className="font-bold text-amber-900">{currentPage}</span> of <span className="font-bold text-amber-900">{totalPages}</span>
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-amber-300/60 text-amber-700 hover:bg-gradient-to-r hover:from-amber-100 hover:to-yellow-100 disabled:opacity-50 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Next →
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
