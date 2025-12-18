// Axios instance with authentication interceptors
import axios from 'axios';
import config from '../components/config';

const api = axios.create({
  baseURL: config.baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle authentication errors
      if (status === 401) {
        // Clear local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/sign-in' && window.location.pathname !== '/sign-up') {
          window.location.href = '/sign-in';
        }
      }
      
      // Handle validation errors
      if (status === 400 && data.errors) {
        const errorMessages = data.errors.map(err => err.msg).join('\n');
        console.error('Validation errors:', errorMessages);
      }
      
      // Handle server errors
      if (status === 500) {
        console.error('Server error:', data.message || 'Internal server error');
      }
      
      // Handle database unavailable
      if (status === 503) {
        console.error('Database unavailable');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
