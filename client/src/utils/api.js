import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://real-estate-pro-2.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  // Let axios set the Content-Type automatically (needed for FormData)
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method, config.url, config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !error.config.url.includes('/auth/login') &&
      !error.config.url.includes('/favorites') &&
      !error.config.url.includes('/listings')
    ) {
      console.error('Unauthorized access at:', error.config?.url);
      // alert('Auth Error: ' + error.response.status + ' at ' + error.config.url);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

