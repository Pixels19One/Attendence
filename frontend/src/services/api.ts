import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string, role?: string) =>
    api.post('/auth/register', { name, email, password, role }),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (name: string, email: string) =>
    api.put('/auth/profile', { name, email }),
};

export const attendanceAPI = {
  checkIn: () =>
    api.post('/attendance/checkin'),
  
  checkOut: () =>
    api.post('/attendance/checkout'),
  
  getTodayStatus: () =>
    api.get('/attendance/today'),
  
  getHistory: (limit?: number, offset?: number) =>
    api.get('/attendance/history', { params: { limit, offset } }),
  
  getStatistics: (startDate?: string, endDate?: string, userId?: number) =>
    api.get('/attendance/statistics', { params: { startDate, endDate, userId } }),
  
  getDashboard: () =>
    api.get('/attendance/dashboard'),
  
  getAllAttendance: (limit?: number, offset?: number, userId?: number) =>
    api.get('/attendance/all', { params: { limit, offset, userId } }),
};

export const userAPI = {
  getAllUsers: () =>
    api.get('/users'),
  
  getUser: (id: number) =>
    api.get(`/users/${id}`),
};

export default api;