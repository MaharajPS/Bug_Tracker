import React, { useState, useEffect } from 'react';
import { issueService, userService } from '../services/api';
import { FaBug, FaPlus, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const CreateIssuePage = () => {
  const [users, setUsers] = useState([]);
  const [issue, setIssue] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    createdByUserId: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [fetchingUsers, setFetchingUsers] = useState(true);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const response = await userService.getAll();
      // Filter to only ADMIN and TESTER (who can create issues)
      const creators = response.data.data.filter(user =>
        user.role === 'ADMIN' || user.role === 'TESTER'
      );
      setUsers(creators);

      // Set default creator if available
      if (creators.length > 0) {
        setIssue(prev => ({ ...prev, createdByUserId: creators[0].id }));
      }
    } catch (error) {
      setMessage({
        text: 'Failed to load users: ' + (error.response?.data?.message || error.message),
        type: 'error'
      });
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issue.title.trim()) {
      setMessage({ text: 'Please enter a valid issue title', type: 'error' });
      return;
    }
    if (!issue.createdByUserId) {
      setMessage({ text: 'Please select a creator user', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await issueService.create({
        title: issue.title.trim(),
        description: issue.description.trim() || null,
        priority: issue.priority,
        createdByUserId: parseInt(issue.createdByUserId)
      });

      setMessage({ text: 'Issue created successfully! You can create another issue or view all issues.', type: 'success' });
      // Reset form but keep creator selection
      setIssue(prev => ({
        title: '',
        description: '',
        priority: 'MEDIUM',
        createdByUserId: prev.createdByUserId
      }));
    } catch (error) {
      setMessage({
        text: 'Error: ' + (error.response?.data?.message || error.response?.data?.error || error.message),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Priority display helper
  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      CRITICAL: { bg: 'bg-red-100', text: 'text-red-800', label: 'CRITICAL' },
      HIGH: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'HIGH' },
      MEDIUM: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'MEDIUM' },
      LOW: { bg: 'bg-green-100', text: 'text-green-800', label: 'LOW' }
    };
    const config = priorityConfig[priority] || priorityConfig.MEDIUM;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <FaBug size={45} className="text-red-500 mr-4" />
          <FaPlus size={40} className="text-amazon-orange mr-2" />
          <h1 className="text-4xl font-bold text-amazon-navy">Create New Issue</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Log bugs and issues with appropriate priority. Only TESTER and ADMIN roles can create issues.
        </p>
      </div>

      {/* Alert Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' ? 'alert-success' : 'alert-error'
        }`}>
          {message.type === 'success' ? (
            <FaCheckCircle className="mr-3 text-green-600 text-xl" />
          ) : (
            <FaExclamationTriangle className="mr-3 text-red-600 text-xl" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Create Issue Form */}
      <div className="amz-card">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-500 to-red-600">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaBug className="mr-3" /> Report Issue
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Creator Selection */}
            <div>
              <label htmlFor="creator" className="block text-sm font-medium text-gray-700 mb-1.5">
                Reported By <span className="text-red-500">*</span>
                <span className="ml-2 text-xs text-gray-500">(Only ADMIN/TESTER)</span>
              </label>
              {fetchingUsers ? (
                <div className="amz-input flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Loading users...
                </div>
              ) : (
                <select
                  id="creator"
                  value={issue.createdByUserId}
                  onChange={(e) => setIssue({...issue, createdByUserId: e.target.value})}
                  className="amz-select"
                  required
                >
                  <option value="">-- Select Reporter --</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Only users with ADMIN or TESTER role can report issues
              </p>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={issue.title}
                onChange={(e) => setIssue({...issue, title: e.target.value})}
                className="amz-input"
                placeholder="e.g., Login page not loading after deployment"
                required
                autoFocus
              />
              <p className="mt-1 text-xs text-gray-500">Be specific and concise</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                value={issue.description}
                onChange={(e) => setIssue({...issue, description: e.target.value})}
                className="amz-textarea"
                placeholder="Describe the issue in detail. Include steps to reproduce, expected behavior, actual behavior, and any error messages or screenshots."
              />
              <p className="mt-1 text-xs text-gray-500">Provide enough detail for developers to understand and fix the issue</p>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1.5">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                value={issue.priority}
                onChange={(e) => setIssue({...issue, priority: e.target.value})}
                className="amz-select"
                required
              >
                <option value="LOW">Low - Minor issue, no immediate impact</option>
                <option value="MEDIUM">Medium - Affects some users, workaround available</option>
                <option value="HIGH">High - Major functionality broken, affects many users</option>
                <option value="CRITICAL">Critical - System down, security breach, or data loss</option>
              </select>
              <div className="mt-2 flex flex-wrap gap-2">
                {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(prio => (
                  <div key={prio} className="flex items-center">
                    {getPriorityBadge(prio)}
                    <span className="ml-2 text-xs text-gray-600">
                      {prio === 'CRITICAL' && 'System down'}
                      {prio === 'HIGH' && 'Major bug'}
                      {prio === 'MEDIUM' && 'Moderate impact'}
                      {prio === 'LOW' && 'Minor issue'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || fetchingUsers}
              className="amz-btn w-full py-3 text-lg flex items-center justify-center"
            >
              {loading ? (
                <>
                  <span className="spinner mr-3"></span>
                  Creating Issue...
                </>
              ) : (
                '🚀 Create Issue'
              )}
            </button>
          </form>
        </div>

        <div className="p-4 bg-amber-50 border-t border-amber-200 text-sm text-amber-800">
          <p className="font-medium">💡 Business Rules:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Only ADMIN or TESTER roles can create issues</li>
            <li>New issues always start with status: OPEN</li>
            <li>Issues must be assigned to a DEVELOPER before moving to IN_PROGRESS</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateIssuePage;