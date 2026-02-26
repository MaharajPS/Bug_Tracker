import React, { useState, useEffect } from 'react';
import { issueService, userService } from '../services/api';
import { FaSync, FaPlay, FaCheck, FaBan, FaUndo, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const UpdateStatusPage = () => {
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [updateData, setUpdateData] = useState({
    issueId: '',
    newStatus: '',
    userId: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [fetching, setFetching] = useState({ issues: true, users: true });

  // Fetch issues and users on mount
  useEffect(() => {
    fetchIssues();
    fetchUsers();
  }, []);

  const fetchIssues = async () => {
    setFetching(prev => ({ ...prev, issues: true }));
    try {
      const response = await issueService.getAll();
      // Filter to only issues that can have status updated (not CLOSED)
      setIssues(response.data.data.filter(issue => issue.status !== 'CLOSED'));
    } catch (error) {
      setMessage({
        text: 'Failed to load issues: ' + (error.response?.data?.message || error.message),
        type: 'error'
      });
    } finally {
      setFetching(prev => ({ ...prev, issues: false }));
    }
  };

  const fetchUsers = async () => {
    setFetching(prev => ({ ...prev, users: true }));
    try {
      const response = await userService.getAll();
      setUsers(response.data.data);

      // Set default user if available
      if (response.data.data.length > 0) {
        setUpdateData(prev => ({ ...prev, userId: response.data.data[0].id }));
      }
    } catch (error) {
      setMessage({
        text: 'Failed to load users: ' + (error.response?.data?.message || error.message),
        type: 'error'
      });
    } finally {
      setFetching(prev => ({ ...prev, users: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!updateData.issueId || !updateData.newStatus || !updateData.userId) {
      setMessage({ text: 'Please fill all required fields', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await issueService.updateStatus(
        parseInt(updateData.issueId),
        {
          newStatus: updateData.newStatus,
          userId: parseInt(updateData.userId)
        }
      );

      setMessage({ text: 'Status updated successfully!', type: 'success' });
      // Reset form but keep user selection
      setUpdateData(prev => ({
        issueId: '',
        newStatus: '',
        userId: prev.userId
      }));
      fetchIssues(); // Refresh issues list
    } catch (error) {
      setMessage({
        text: 'Error: ' + (error.response?.data?.message || error.response?.data?.error || error.message),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Get valid next statuses based on current status
  const getValidNextStatuses = (currentStatus) => {
    const transitions = {
      OPEN: ['IN_PROGRESS'],
      IN_PROGRESS: ['RESOLVED'],
      RESOLVED: ['CLOSED', 'OPEN'],
      CLOSED: []
    };
    return transitions[currentStatus] || [];
  };

  // Get users who can perform the transition based on new status
  const getEligibleUsers = (currentStatus, newStatus) => {
    if (!currentStatus || !newStatus) return users;

    // OPEN → IN_PROGRESS: Only assigned developer
    if (currentStatus === 'OPEN' && newStatus === 'IN_PROGRESS') {
      const issue = issues.find(i => i.id == updateData.issueId);
      return issue?.assignedTo ? [issue.assignedTo] : [];
    }

    // IN_PROGRESS → RESOLVED: Only assigned developer
    if (currentStatus === 'IN_PROGRESS' && newStatus === 'RESOLVED') {
      const issue = issues.find(i => i.id == updateData.issueId);
      return issue?.assignedTo ? [issue.assignedTo] : [];
    }

    // RESOLVED → CLOSED or OPEN: Only ADMIN/TESTER
    if (currentStatus === 'RESOLVED' && (newStatus === 'CLOSED' || newStatus === 'OPEN')) {
      return users.filter(user => user.role === 'ADMIN' || user.role === 'TESTER');
    }

    return users;
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

  // Status icon helper
  const getStatusIcon = (status) => {
    switch(status) {
      case 'OPEN': return <FaSync className="text-red-600" />;
      case 'IN_PROGRESS': return <FaPlay className="text-yellow-600" />;
      case 'RESOLVED': return <FaCheck className="text-green-600" />;
      case 'CLOSED': return <FaBan className="text-gray-600" />;
      default: return <FaSync />;
    }
  };

  // Get current issue details
  const getCurrentIssue = () => {
    return issues.find(i => i.id == updateData.issueId);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <FaSync size={45} className="text-amazon-orange mr-4" />
          <h1 className="text-4xl font-bold text-amazon-navy">Update Issue Status</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Move issues through their lifecycle with strict business rule enforcement.
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

      {/* Status Update Form */}
      <div className="amz-card">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-amber-600">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaSync className="mr-3" /> Status Workflow
          </h2>
        </div>
        <div className="p-6">
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-bold text-amber-900 mb-2 flex items-center">
              <FaSync className="mr-2 text-amber-600" /> Valid Status Transitions:
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
              <div className="flex items-center">
                <span className="status-badge status-open px-4 py-2">OPEN</span>
                <span className="mx-3 text-amber-700 font-bold">→</span>
              </div>
              <div className="flex items-center">
                <span className="status-badge status-in_progress px-4 py-2">IN_PROGRESS</span>
                <span className="mx-3 text-amber-700 font-bold">→</span>
              </div>
              <div className="flex items-center">
                <span className="status-badge status-resolved px-4 py-2">RESOLVED</span>
                <div className="flex flex-col items-center mx-3">
                  <span className="text-amber-700 font-bold">↙↘</span>
                  <div className="flex space-x-2 mt-1">
                    <span className="status-badge status-closed px-3 py-1">CLOSED</span>
                    <span className="status-badge status-open px-3 py-1 flex items-center">
                      <FaUndo className="mr-1 text-xs" /> REOPEN
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User Selection */}
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1.5">
                Updated By <span className="text-red-500">*</span>
              </label>
              {fetching.users ? (
                <div className="amz-input flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Loading users...
                </div>
              ) : (
                <select
                  id="user"
                  value={updateData.userId}
                  onChange={(e) => setUpdateData({...updateData, userId: e.target.value})}
                  className="amz-select"
                  required
                >
                  <option value="">-- Select User --</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              )}
              <p className="mt-1 text-xs text-gray-500">
                User performing the status update (must have appropriate permissions)
              </p>
            </div>

            {/* Issue Selection */}
            <div>
              <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1.5">
                Issue to Update <span className="text-red-500">*</span>
              </label>
              {fetching.issues ? (
                <div className="amz-input flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Loading issues...
                </div>
              ) : issues.length === 0 ? (
                <div className="amz-input bg-gray-100 text-gray-500">
                  No updatable issues found. Create and assign issues first!
                </div>
              ) : (
                <select
                  id="issue"
                  value={updateData.issueId}
                  onChange={(e) => {
                    const issueId = e.target.value;
                    const issue = issues.find(i => i.id == issueId);
                    // Auto-select valid next status if only one option
                    const nextStatuses = getValidNextStatuses(issue?.status || '');
                    setUpdateData({
                      issueId: issueId,
                      newStatus: nextStatuses.length === 1 ? nextStatuses[0] : '',
                      userId: updateData.userId
                    });
                  }}
                  className="amz-select"
                  required
                >
                  <option value="">-- Select Issue --</option>
                  {issues.map(issue => (
                    <option key={issue.id} value={issue.id}>
                      #{issue.id} - {issue.title} | Current: {getStatusBadge(issue.status)}
                    </option>
                  ))}
                </select>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Only issues with valid next statuses are shown (CLOSED issues excluded)
              </p>
            </div>

            {/* New Status Selection */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">
                New Status <span className="text-red-500">*</span>
              </label>
              {updateData.issueId ? (
                <select
                  id="status"
                  value={updateData.newStatus}
                  onChange={(e) => setUpdateData({...updateData, newStatus: e.target.value})}
                  className="amz-select"
                  required
                >
                  <option value="">-- Select New Status --</option>
                  {getValidNextStatuses(getCurrentIssue()?.status || '').map(status => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')} {getStatusIcon(status)}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="amz-input bg-gray-100 text-gray-500">
                  Select an issue first to see valid status transitions
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Status transitions follow strict business rules
              </p>
            </div>

            {/* Eligible Users Notice */}
            {updateData.issueId && updateData.newStatus && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="font-medium text-blue-900 mb-1">Eligible Users for this Transition:</p>
                <div className="flex flex-wrap gap-2">
                  {getEligibleUsers(getCurrentIssue()?.status, updateData.newStatus).length > 0 ? (
                    getEligibleUsers(getCurrentIssue()?.status, updateData.newStatus).map(user => (
                      <span key={user.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {user.name} ({user.role})
                      </span>
                    ))
                  ) : (
                    <span className="text-red-600">No eligible users! Check assignment and permissions.</span>
                  )}
                </div>
              </div>
            )}

            {/* Issue Details Preview */}
            {getCurrentIssue() && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-green-900 mb-2">Issue Details:</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Title:</span> {getCurrentIssue().title}</p>
                  <p><span className="font-medium">Current Status:</span> {getStatusBadge(getCurrentIssue().status)}</p>
                  <p><span className="font-medium">Priority:</span> {getCurrentIssue().priority}</p>
                  <p><span className="font-medium">Assigned To:</span> {getCurrentIssue().assignedTo?.name || 'Not assigned'}</p>
                  <p><span className="font-medium">Reported By:</span> {getCurrentIssue().createdBy?.name || 'N/A'}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || fetching.issues || fetching.users || !updateData.newStatus}
              className="amz-btn w-full py-3 text-lg flex items-center justify-center"
            >
              {loading ? (
                <>
                  <span className="spinner mr-3"></span>
                  Updating Status...
                </>
              ) : (
                '🔄 Update Status'
              )}
            </button>
          </form>
        </div>

        <div className="p-4 bg-purple-50 border-t border-purple-200 text-sm text-purple-800">
          <p className="font-medium">💡 Business Rules Enforcement:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>OPEN → IN_PROGRESS: Only assigned DEVELOPER can start work</li>
            <li>IN_PROGRESS → RESOLVED: Only assigned DEVELOPER can mark as resolved</li>
            <li>RESOLVED → CLOSED: Only ADMIN/TESTER can close resolved issues</li>
            <li>RESOLVED → OPEN: Only ADMIN/TESTER can reopen resolved issues</li>
            <li>No direct transitions from OPEN to CLOSED allowed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusPage;