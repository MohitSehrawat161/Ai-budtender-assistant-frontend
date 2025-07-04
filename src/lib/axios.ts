import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token from cookies to every request
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
