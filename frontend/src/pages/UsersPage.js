import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { FaUserPlus, FaUsers, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', role: 'DEVELOPER' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [fetching, setFetching] = useState(true);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setFetching(true);
    try {
      const response = await userService.getAll();
      setUsers(response.data.data);
      setMessage({ text: '', type: '' });
    } catch (error) {
      setMessage({
        text: 'Failed to load users: ' + (error.response?.data?.message || error.message),
        type: 'error'
      });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name.trim()) {
      setMessage({ text: 'Please enter a valid name', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await userService.create({
        name: newUser.name.trim(),
        role: newUser.role
      });

      setMessage({ text: 'User created successfully!', type: 'success' });
      setNewUser({ name: '', role: 'DEVELOPER' });
      fetchUsers();
    } catch (error) {
      setMessage({
        text: 'Error: ' + (error.response?.data?.message || error.response?.data?.error || error.message),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Role display helper
  const getRoleBadge = (role) => {
    const roleConfig = {
      ADMIN: { bg: 'bg-red-100', text: 'text-red-800', label: 'ADMIN' },
      DEVELOPER: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'DEVELOPER' },
      TESTER: { bg: 'bg-green-100', text: 'text-green-800', label: 'TESTER' }
    };
    const config = roleConfig[role] || roleConfig.DEVELOPER;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <FaUsers size={45} className="text-amazon-orange mr-4" />
          <h1 className="text-4xl font-bold text-amazon-navy">User Management</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Create and manage team members with specific roles. Only TESTER and ADMIN can create issues.
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

      {/* Create User Card */}
      <div className="amz-card mb-8">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amazon-lightnavy to-amazon-navy">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaUserPlus className="mr-3" /> Add New Team Member
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="amz-input"
                placeholder="Enter user's full name (e.g., John Developer)"
                required
                autoFocus
              />
              <p className="mt-1 text-xs text-gray-500">Name must be unique and cannot be empty</p>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="amz-select"
                required
              >
                <option value="ADMIN">Admin (Full System Access)</option>
                <option value="DEVELOPER">Developer (Can work on assigned issues)</option>
                <option value="TESTER">Tester (Can create and verify issues)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {newUser.role === 'ADMIN' && 'Admins can manage all aspects of the system'}
                {newUser.role === 'DEVELOPER' && 'Developers can only work on assigned issues'}
                {newUser.role === 'TESTER' && 'Testers can create issues and verify resolutions'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="amz-btn w-full py-3 text-lg flex items-center justify-center"
            >
              {loading ? (
                <>
                  <span className="spinner mr-3"></span>
                  Creating User...
                </>
              ) : (
                'Create User Account'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Users List Card */}
      <div className="amz-card">
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50">
          <h2 className="text-2xl font-bold text-amazon-navy mb-4 md:mb-0">Team Members ({users.length})</h2>
          <div className="flex flex-wrap gap-2">
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800`}>
              ADMIN
            </span>
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800`}>
              DEVELOPER
            </span>
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800`}>
              TESTER
            </span>
          </div>
        </div>

        {fetching ? (
          <div className="p-12 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading team members...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FaUsers className="text-5xl mb-4 mx-auto text-gray-300" />
            <p className="text-xl font-medium mb-2">No team members found</p>
            <p>Create your first user to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-amazon-lightnavy">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">#{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          <p>💡 Tip: Create at least one ADMIN, one TESTER, and one DEVELOPER to test all features</p>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;