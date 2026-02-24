import React, { useState, useEffect } from 'react';
import { issueService, userService } from '../services/api';
import { FaList, FaFilter, FaSearch, FaSync, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const IssueListPage = () => {
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    assignedTo: '',
    createdBy: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [fetchingUsers, setFetchingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();

    fetchIssues();
  }, []);

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const response = await userService.getAll();
      setUsers(response.data.data);
    } catch (error) {
      setMessage({
        text: 'Failed to load users: ' + (error.response?.data?.message || error.message),
        type: 'error'
      });
    } finally {
      setFetchingUsers(false);
    }
  };

  const fetchIssues = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Build query params
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.assignedTo) params.assignedTo = filters.assignedTo;
      if (filters.createdBy) params.createdBy = filters.createdBy;

      const response = await issueService.getAll(params);
      setIssues(response.data.data);

      if (response.data.data.length === 0) {
        setMessage({
          text: 'No issues found matching the selected filters. Try adjusting your filters.',
          type: 'info'
        });
      }
    } catch (error) {
      setMessage({
        text: 'Error loading issues: ' + (error.response?.data?.message || error.message),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  const handleClearFilters = () => {
    setFilters({ status: '', assignedTo: '', createdBy: '' });
    fetchIssues();
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    const statusConfig = {
      OPEN: 'status-open',
      IN_PROGRESS: 'status-in_progress',
      RESOLVED: 'status-resolved',
      CLOSED: 'status-closed'
    };
    return (
      <span className={`status-badge ${statusConfig[status] || 'status-open'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  // Priority badge helper
  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      CRITICAL: 'bg-red-100 text-red-800 border border-red-200',
      HIGH: 'bg-orange-100 text-orange-800 border border-orange-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      LOW: 'bg-green-100 text-green-800 border border-green-200'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[priority] || priorityConfig.MEDIUM}`}>
        {priority}
      </span>
    );
  };

  // Get user name by ID
  const getUserName = (userId) => {
    if (!userId) return 'Unassigned';
    const user = users.find(u => u.id === userId);
    return user ? user.name : `User #${userId}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <FaList size={45} className="text-amazon-orange mr-4" />
          <h1 className="text-4xl font-bold text-amazon-navy">Issue Dashboard</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          View and filter all issues by status, assignee, or creator. Real-time tracking of issue lifecycle.
        </p>
      </div>

      {/* Alert Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' ? 'alert-success' :
          message.type === 'error' ? 'alert-error' : 'alert-info'
        }`}>
          {message.type === 'success' && <FaCheckCircle className="mr-3 text-green-600 text-xl" />}
          {message.type === 'error' && <FaExclamationTriangle className="mr-3 text-red-600 text-xl" />}
          {message.type === 'info' && <FaInfoCircle className="mr-3 text-blue-600 text-xl" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filters Card */}
      <div className="amz-card mb-8">
        <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-amazon-lightnavy to-amazon-navy">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FaFilter className="mr-2" /> Filter Issues
          </h2>
        </div>
        <div className="p-5">
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="amz-select"
              >
                <option value="">All Statuses</option>
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            {/* Assigned To Filter */}
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1.5">
                Assigned To
              </label>
              {fetchingUsers ? (
                <div className="amz-input flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                </div>
              ) : (
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={filters.assignedTo}
                  onChange={handleFilterChange}
                  className="amz-select"
                >
                  <option value="">All Developers</option>
                  <option value="0">Unassigned</option>
                  {users.filter(u => u.role === 'DEVELOPER').map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Created By Filter */}
            <div>
              <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700 mb-1.5">
                Created By
              </label>
              {fetchingUsers ? (
                <div className="amz-input flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                </div>
              ) : (
                <select
                  id="createdBy"
                  name="createdBy"
                  value={filters.createdBy}
                  onChange={handleFilterChange}
                  className="amz-select"
                >
                  <option value="">All Users</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 md:space-y-0 md:items-end md:justify-end">
              <button
                type="submit"
                disabled={loading}
                className="amz-btn w-full md:w-auto flex items-center justify-center"
              >
                <FaSearch className="mr-2" /> Search Issues
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="amz-btn-secondary w-full md:w-auto"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Issues Table Card */}
      <div className="amz-card">
        <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-amazon-navy mb-3 md:mb-0">Issue List ({issues.length})</h2>
          <button
            onClick={fetchIssues}
            disabled={loading}
            className="amz-btn-secondary flex items-center px-4 py-2"
          >
            <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FaList className="text-6xl mb-4 mx-auto text-gray-300" />
            <p className="text-2xl font-medium mb-2">No Issues Found</p>
            <p className="mb-4">Try adjusting your filters or create a new issue</p>
            <a
              href="/issues/create"
              className="amz-btn inline-block px-6 py-2.5"
            >
              Create New Issue
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-amazon-lightnavy">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Updated</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {issues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      #{issue.id}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-xs truncate">
                      {issue.title}
                      {issue.description && (
                        <p className="text-gray-500 text-xs mt-1 line-clamp-1">{issue.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(issue.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(issue.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserName(issue.assignedTo?.id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserName(issue.createdBy?.id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {issue.updatedAt ? new Date(issue.updatedAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 bg-blue-50 border-t border-blue-200 text-sm text-blue-800">
          <p className="font-medium">💡 Tips:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Filter by "Unassigned" to find issues needing assignment</li>
            <li>Filter by status "OPEN" to see issues ready for development</li>
            <li>Filter by your name to see issues assigned to you</li>
            <li>Refresh the list after creating/updating issues to see changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IssueListPage;


