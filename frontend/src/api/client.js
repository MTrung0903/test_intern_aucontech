import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const client = axios.create({
  baseURL: '/api',
});


const isValidToken = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);

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

    localStorage.removeItem('token');
  }
  return config;
});


client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      localStorage.removeItem('token');

      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;


