import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const client = axios.create({
  baseURL: '/api',
});

// Helper function to validate token
const isValidToken = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && isValidToken(token)) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
  } else if (token) {
    // Remove invalid token
    localStorage.removeItem('token');
  }
  return config;
});

// Response interceptor to handle 401 errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      localStorage.removeItem('token');
      // Optionally redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;


