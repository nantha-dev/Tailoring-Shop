import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const isAuthRoute = window.location.pathname === '/login';
    const isAuthRequest =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/me') ||
      error.config?.url?.includes('/auth/logout');

    if (status === 401 && !isAuthRoute && !isAuthRequest) {
      localStorage.removeItem('token');
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default api;