
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useLocation } from 'react-router-dom';
import { 
  Users, 
  MapPin, 
  CheckCircle, 
  X, 
  Edit, 
  Trash, 
  Search,
  Filter,
  Eye,
  Download,
  UserPlus
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'service-provider' | 'super-admin' | 'vice-chancellor' | 'administration' | 'student-union' | 'warden';
  status: 'active' | 'inactive';
  joinDate: string;
}

interface PendingApproval {
  id: string;
  type: 'booking' | 'event-plan';
  title: string;
  requester: string;
  requestedBy: string;
  venue: string;
  date: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
}

const AdminTools: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'users' | 'approvals' | 'logs'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Roy',
      email: 'superadmin@university.edu',
      role: 'super-admin',
      status: 'active',
      joinDate: '2025-01-01'
    },
    {
      id: '2',
      name: 'Shalini Weerathunga',
      email: 'shalini@university.edu',
      role: 'student',
      status: 'active',
      joinDate: '2025-02-17'
    },
    {
      id: '3',
      name: 'Prof. K.M.D.S. Perera',
      email: 'perera@university.edu',
      role: 'faculty',
      status: 'active',
      joinDate: '2025-03-15'
    },
    {
      id: '4',
      name: 'Nishantha Nanayakara',
      email: 'nishantha@university.edu',
      role: 'student',
      status: 'inactive',
      joinDate: '2025-06-01'
    }
  ]);

  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([
    {
      id: '1',
      type: 'booking',
      title: 'Research Conference 2025',
      requester: 'Chamali Kumari',
      requestedBy: 'chamali@university.edu',
      venue: 'Main Lecture Theater-MLT',
      date: '2025-05-20',
      details: 'Annual research conference with 200 participants',
      status: 'pending'
    },
    {
      id: '2',
      type: 'event-plan',
      title: 'Social Night',
      requester: 'Student Union',
      requestedBy: 'SU@university.edu',
      venue: 'Open Ground',
      date: '2025-04-15',
      details: 'Cultural event with stage performances and food stalls',
      status: 'pending'
    }
  ]);

  const systemLogs = [
    {
      id: '1',
      timestamp: '2025-05-20 10:30:00',
      user: 'Chamali Kumari',
      action: 'Booking Created',
      target: 'Research Conference 2025',
      details: 'Created new booking for Main Lecture Theater-MLT'
    },
    {
      id: '2',
      timestamp: '2025-06-01 09:15:00',
      user: 'Admin',
      action: 'User Status Changed',
      target: 'Nishantha Nanayakara',
      details: 'Changed user status from active to inactive'
    },
    {
      id: '3',
      timestamp: '2024-01-14 16:45:00',
      user: 'Prof.K.M.D.S. Perera',
      action: 'Event Plan Submitted',
      target: 'InnoveX Seminar',
      details: 'Submitted event plan for review'
    }
  ];

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student' as User['role'],
    status: 'active' as User['status']
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'approvals' || tab === 'users' || tab === 'logs') {
      setActiveTab(tab as 'users' | 'approvals' | 'logs');
    }
  }, [location.search]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleApproval = (approvalId: string, action: 'approve' | 'reject') => {
    setPendingApprovals(pendingApprovals.map(approval => 
      approval.id === approvalId 
        ? { ...approval, status: action === 'approve' ? 'approved' : 'rejected' }
        : approval
    ));
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...editingUser, ...newUser }
          : user
      ));
    } else {
      // Add new user
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, user]);
    }
    
    setShowUserForm(false);
    setEditingUser(null);
    setNewUser({ name: '', email: '', role: 'student', status: 'active' });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setShowUserForm(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'bg-red-100 text-red-800';
      case 'faculty':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      case 'service-provider':
        return 'bg-orange-100 text-orange-800';
      case 'vice-chancellor':
        return 'bg-indigo-100 text-indigo-800';
      case 'administration':
        return 'bg-teal-100 text-teal-800';
      case 'student-union':
        return 'bg-pink-100 text-pink-800';
      case 'warden':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderUsersTab = () => (
    <div className="space-y-6">
      {/* User Management Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <button
          onClick={() => setShowUserForm(true)}
          className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl flex items-center hover:bg-white/20 transition-colors border border-white/20"
        >
          <UserPlus size={20} className="mr-2" />
          Add New User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/60 backdrop-blur-sm text-white border border-white/20 rounded-xl pl-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-black/60 backdrop-blur-sm text-white border border-white/20 rounded-xl py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Roles</option>
              <optgroup label="Public Roles">
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </optgroup>
              <optgroup label="Authority Roles">
                <option value="super-admin">Super Admin</option>
                <option value="service-provider">Service Provider</option>
                <option value="vice-chancellor">Vice Chancellor</option>
                <option value="administration">Administration of UWU</option>
                <option value="student-union">Student Union</option>
                <option value="warden">Warden</option>
              </optgroup>
            </select>
          </div>
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
              }}
              className="bg-white/10 backdrop-blur-sm text-white w-full px-4 py-2 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/60 backdrop-blur-sm">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-white">User</th>
                <th className="text-left py-3 px-6 font-medium text-white">Role</th>
                <th className="text-left py-3 px-6 font-medium text-white">Status</th>
                <th className="text-left py-3 px-6 font-medium text-white">Join Date</th>
                <th className="text-left py-3 px-6 font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-white/70">{user.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    
                      user.role === 'super-admin' ? 'bg-red-900/60 text-red-200 border-red-500/30' :
                      user.role === 'faculty' ? 'bg-blue-900/60 text-blue-200 border-blue-500/30' :
                      user.role === 'student' ? 'bg-green-900/60 text-green-200 border-green-500/30' :
                      user.role === 'service-provider' ? 'bg-orange-900/60 text-orange-200 border-orange-500/30' :
                      user.role === 'vice-chancellor' ? 'bg-indigo-900/60 text-indigo-200 border-indigo-500/30' :
                      user.role === 'administration' ? 'bg-teal-900/60 text-teal-200 border-teal-500/30' :
                      user.role === 'student-union' ? 'bg-pink-900/60 text-pink-200 border-pink-500/30' :
                      user.role === 'warden' ? 'bg-yellow-900/60 text-yellow-200 border-yellow-500/30' :
                      'bg-gray-900/60 text-gray-200 border-gray-500/30'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.status === 'active' ? 'bg-green-900/60 text-green-200 border-green-500/30' : user.status === 'inactive' ? 'bg-red-900/60 text-red-200 border-red-500/30' : 'bg-yellow-900/60 text-yellow-200 border-yellow-500/30'}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-white/70">
                    {user.joinDate}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-400 hover:text-blue-200 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`${user.status === 'active' ? 'text-red-400 hover:text-red-200' : 'text-green-400 hover:text-green-200'} transition-colors`}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-200 transition-colors"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderApprovalsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Pending Approvals</h2>
      
      <div className="space-y-4">
        {pendingApprovals.filter(approval => approval.status === 'pending').map((approval) => (
          <div key={approval.id} className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${approval.type === 'booking' ? 'bg-blue-900/60 text-blue-200 border-blue-500/30' : 'bg-purple-900/60 text-purple-200 border-purple-500/30'}`}>{approval.type === 'booking' ? 'Booking Request' : 'Event Plan'}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${approval.status === 'pending' ? 'bg-yellow-900/60 text-yellow-200 border-yellow-500/30' : approval.status === 'approved' ? 'bg-green-900/60 text-green-200 border-green-500/30' : 'bg-red-900/60 text-red-200 border-red-500/30'}`}>{approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{approval.title}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80 mb-3">
                  <div><span className="font-medium">Requester:</span> {approval.requester}</div>
                  <div><span className="font-medium">Email:</span> {approval.requestedBy}</div>
                  <div><span className="font-medium">Venue:</span> {approval.venue}</div>
                  <div><span className="font-medium">Date:</span> {approval.date}</div>
                </div>
                
                <p className="text-white/90 mb-4">{approval.details}</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleApproval(approval.id, 'approve')}
                  className="bg-green-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center hover:bg-green-800/80 border border-green-500/30"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => handleApproval(approval.id, 'reject')}
                  className="bg-red-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center hover:bg-red-800/80 border border-red-500/30"
                >
                  <X size={16} className="mr-2" />
                  Reject
                </button>
                <button className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-medium flex items-center hover:bg-white/20 transition-colors border border-white/20">
                  <Eye size={16} className="mr-2" />
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLogsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-white">System Logs</h2>
        <button className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl flex items-center hover:bg-white/20 transition-colors border border-white/20">
          <Download size={20} className="mr-2" />
          Export Logs
        </button>
      </div>
      
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/60 backdrop-blur-sm">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-white">Timestamp</th>
                <th className="text-left py-3 px-6 font-medium text-white">User</th>
                <th className="text-left py-3 px-6 font-medium text-white">Action</th>
                <th className="text-left py-3 px-6 font-medium text-white">Target</th>
                <th className="text-left py-3 px-6 font-medium text-white">Details</th>
              </tr>
            </thead>
            <tbody>
              {systemLogs.map((log) => (
                <tr key={log.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 text-sm text-white/70">{log.timestamp}</td>
                  <td className="py-4 px-6 font-medium text-white">{log.user}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded border border-white/20 hover:bg-white/20 transition-colors">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-white/70">{log.target}</td>
                  <td className="py-4 px-6 text-sm text-white/70">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <Layout showSidebar={true}>
      <div className="min-h-screen w-full flex flex-col items-stretch" style={{ backgroundColor: '#bd7880' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8 animate-fade-in text-white">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white">Admin Tools</h1>
              <p className="text-lg text-white/90">Manage users, approvals, and system activities</p>
            </div>

            {/* Tabs */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
              <div className="border-b border-white/10">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'users', name: 'User Management', icon: Users },
                    { id: 'approvals', name: 'Approvals Queue', icon: CheckCircle },
                    { id: 'logs', name: 'System Logs', icon: Eye }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-white'
                          : 'border-transparent text-white/70 hover:text-blue-300 hover:border-blue-300'
                      }`}
                    >
                      <tab.icon size={20} className="mr-2" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === 'users' && renderUsersTab()}
                {activeTab === 'approvals' && renderApprovalsTab()}
                {activeTab === 'logs' && renderLogsTab()}
              </div>
            </div>

            {/* User Form Modal */}
            {showUserForm && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-black/90 backdrop-blur-sm rounded-2xl max-w-md w-full text-white border border-white/10 shadow-2xl">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white">
                        {editingUser ? 'Edit User' : 'Add New User'}
                      </h2>
                      <button
                        onClick={() => {
                          setShowUserForm(false);
                          setEditingUser(null);
                          setNewUser({ name: '', email: '', role: 'student', status: 'active' });
                        }}
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <form onSubmit={handleUserSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          className="bg-black/60 backdrop-blur-sm text-white border border-white/20 rounded-xl py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          className="bg-black/60 backdrop-blur-sm text-white border border-white/20 rounded-xl py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Role
                        </label>
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value as User['role']})}
                          className="bg-black/60 backdrop-blur-sm text-white border border-white/20 rounded-xl py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          {/* Public Roles */}
                          <optgroup label="Public Roles">
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                          </optgroup>
                          
                          {/* Authority Roles */}
                          <optgroup label="Authority Roles">
                            <option value="service-provider">Service Provider</option>
                            <option value="super-admin">Super Admin</option>
                            <option value="vice-chancellor">Vice Chancellor</option>
                            <option value="administration">Administration of UWU</option>
                            <option value="student-union">Student Union</option>
                            <option value="warden">Warden</option>
                          </optgroup>
                        </select>
                        <p className="mt-1 text-xs text-gray-400">
                          Public roles can self-register. Authority roles require admin creation.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Status
                        </label>
                        <select
                          value={newUser.status}
                          onChange={(e) => setNewUser({...newUser, status: e.target.value as User['status']})}
                          className="bg-black/60 backdrop-blur-sm text-white border border-white/20 rounded-xl py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="flex justify-end space-x-4 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserForm(false);
                            setEditingUser(null);
                            setNewUser({ name: '', email: '', role: 'student', status: 'active' });
                          }}
                          className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                        >
                          {editingUser ? 'Update User' : 'Add User'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminTools;
