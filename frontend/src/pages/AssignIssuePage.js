import React, { useState, useEffect } from 'react';
import { issueService, userService } from '../services/api';
import { FaTasks, FaUserFriends, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const AssignIssuePage = () => {
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignment, setAssignment] = useState({
    issueId: '',
    assigneeUserId: '',
    assignedByUserId: ''
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
      // Get only OPEN or IN_PROGRESS issues that can be assigned
      const response = await issueService.getAll({
        status: 'OPEN' // Only show OPEN issues for assignment
      });
      setIssues(response.data.data.filter(issue =>
        issue.status === 'OPEN' || issue.status === 'IN_PROGRESS'
      ));
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
      // Get assignable users (DEVELOPERS) and assigners (ADMIN/TESTER)
      setUsers(response.data.data);

      // Set default assigner if available (first ADMIN/TESTER)
      const assigners = response.data.data.filter(user =>
        user.role === 'ADMIN' || user.role === 'TESTER'
      );
      if (assigners.length > 0) {
        setAssignment(prev => ({ ...prev, assignedByUserId: assigners[0].id }));
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
    if (!assignment.issueId || !assignment.assigneeUserId || !assignment.assignedByUserId) {
      setMessage({ text: 'Please fill all required fields', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await issueService.assign(
        parseInt(assignment.issueId),
        {
          assigneeUserId: parseInt(assignment.assigneeUserId),
          assignedByUserId: parseInt(assignment.assignedByUserId)
        }
      );

      setMessage({ text: 'Issue assigned successfully!', type: 'success' });
      // Reset form but keep assigner selection
      setAssignment(prev => ({
        issueId: '',
        assigneeUserId: '',
        assignedByUserId: prev.assignedByUserId
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

  // Get assignable developers (DEVELOPERS only)
  const getAssignableDevelopers = () => {
    return users.filter(user => user.role === 'DEVELOPER');
  };

  // Get users who can assign (ADMIN/TESTER)
  const getAssigners = () => {
    return users.filter(user => user.role === 'ADMIN' || user.role === 'TESTER');
  };

  // Get open issues that can be assigned
  const getAssignableIssues = () => {
    return issues.filter(issue => issue.status === 'OPEN');
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

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <FaTasks size={45} className="text-amazon-orange mr-4" />
          <h1 className="text-4xl font-bold text-amazon-navy">Assign Issue to Developer</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Assign open issues to developers. Only ADMIN or TESTER can perform assignments.
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

      {/* Assignment Form */}
      <div className="amz-card">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amazon-lightnavy to-amazon-navy">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaUserFriends className="mr-3" /> Assign Issue
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Assigner Selection */}
            <div>
              <label htmlFor="assigner" className="block text-sm font-medium text-gray-700 mb-1.5">
                Assigned By <span className="text-red-500">*</span>
                <span className="ml-2 text-xs text-gray-500">(ADMIN or TESTER)</span>
              </label>
              {fetching.users ? (
                <div className="amz-input flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Loading users...
                </div>
              ) : (
                <select
                  id="assigner"
                  value={assignment.assignedByUserId}
                  onChange={(e) => setAssignment({...assignment, assignedByUserId: e.target.value})}
                  className="amz-select"
                  required
                >
                  <option value="">-- Select Assigner --</option>
                  {getAssigners().map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Only users with ADMIN or TESTER role can assign issues
              </p>
            </div>

            {/* Issue Selection */}
            <div>
              <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1.5">
                Issue to Assign <span className="text-red-500">*</span>
              </label>
              {fetching.issues ? (
                <div className="amz-input flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Loading issues...
                </div>
              ) : getAssignableIssues().length === 0 ? (
                <div className="amz-input bg-gray-100 text-gray-500">
                  No OPEN issues available for assignment. Create an issue first!
                </div>
              ) : (
                <select
                  id="issue"
                  value={assignment.issueId}
                  onChange={(e) => setAssignment({...assignment, issueId: e.target.value})}
                  className="amz-select"
                  required
                >
                  <option value="">-- Select Issue --</option>
                  {getAssignableIssues().map(issue => (
                    <option key={issue.id} value={issue.id}>
                      #{issue.id} - {issue.title} [{issue.priority}] {getStatusBadge(issue.status)}
                    </option>
                  ))}
                </select>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Only OPEN issues can be assigned to developers
              </p>
            </div>

            {/* Assignee Selection */}
            <div>
              <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1.5">
                Assign To (Developer) <span className="text-red-500">*</span>
              </label>
              {fetching.users ? (
                <div className="amz-input flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Loading developers...
                </div>
              ) : getAssignableDevelopers().length === 0 ? (
                <div className="amz-input bg-gray-100 text-gray-500">
                  No developers available. Create a DEVELOPER user first!
                </div>
              ) : (
                <select
                  id="assignee"
                  value={assignment.assigneeUserId}
                  onChange={(e) => setAssignment({...assignment, assigneeUserId: e.target.value})}
                  className="amz-select"
                  required
                >
                  <option value="">-- Select Developer --</option>
                  {getAssignableDevelopers().map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} (ID: {user.id})
                    </option>
                  ))}
                </select>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Only users with DEVELOPER role can be assigned issues
              </p>
            </div>

            {/* Issue Details Preview */}
            {assignment.issueId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">Selected Issue Details:</h3>
                {issues.find(i => i.id == assignment.issueId) ? (
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Title:</span> {issues.find(i => i.id == assignment.issueId).title}</p>
                    <p><span className="font-medium">Priority:</span> {issues.find(i => i.id == assignment.issueId).priority}</p>
                    <p><span className="font-medium">Status:</span> {getStatusBadge(issues.find(i => i.id == assignment.issueId).status)}</p>
                    <p><span className="font-medium">Reported By:</span> {issues.find(i => i.id == assignment.issueId).createdBy?.name || 'N/A'}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Issue details not available</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || fetching.issues || fetching.users || getAssignableIssues().length === 0}
              className="amz-btn w-full py-3 text-lg flex items-center justify-center"
            >
              {loading ? (
                <>
                  <span className="spinner mr-3"></span>
                  Assigning Issue...
                </>
              ) : (
                '✅ Assign to Developer'
              )}
            </button>
          </form>
        </div>

        <div className="p-4 bg-blue-50 border-t border-blue-200 text-sm text-blue-800">
          <p className="font-medium">💡 Assignment Rules:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Only ADMIN or TESTER can assign issues</li>
            <li>Only DEVELOPERS can be assigned issues</li>
            <li>Only OPEN issues can be assigned (IN_PROGRESS issues are already assigned)</li>
            <li>CLOSED and RESOLVED issues cannot be assigned</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AssignIssuePage;