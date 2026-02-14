import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding tokens (if needed later)
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Export all API methods
export const userService = {
  getAll: () => api.get('/users'),
  create: (userData) => api.post('/users', userData),
};

export const issueService = {
  getAll: (params) => api.get('/issues', { params }),
  create: (issueData) => api.post('/issues', issueData),
  assign: (id, assignData) => api.put(`/issues/${id}/assign`, assignData),
  updateStatus: (id, statusData) => api.put(`/issues/${id}/status`, statusData),
};

export default api;