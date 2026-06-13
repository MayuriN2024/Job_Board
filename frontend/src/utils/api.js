import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobboard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, we could clear local storage, but AuthContext handles this
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jobboard_token');
      localStorage.removeItem('jobboard_session');
      // optional: reload or redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
