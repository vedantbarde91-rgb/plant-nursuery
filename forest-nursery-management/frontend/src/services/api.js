import axios from 'axios';

const API = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL || 'https://your-backend-url.onrender.com/api'
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('nurseryUser') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Inventory
export const getPlants = () => API.get('/inventory');
export const addPlant = (data) => API.post('/inventory', data);
export const updatePlant = (id, data) => API.put(`/inventory/${id}`, data);
export const deletePlant = (id) => API.delete(`/inventory/${id}`);

// Inward
export const getInward = () => API.get('/inward');
export const addInward = (data) => API.post('/inward', data);
export const deleteInward = (id) => API.delete(`/inward/${id}`);

// Outward
export const getOutward = () => API.get('/outward');
export const addOutward = (data) => API.post('/outward', data);
export const deleteOutward = (id) => API.delete(`/outward/${id}`);

// Sites
export const getSites = () => API.get('/sites');
export const addSite = (data) => API.post('/sites', data);
export const updateSite = (id, data) => API.put(`/sites/${id}`, data);
export const deleteSite = (id) => API.delete(`/sites/${id}`);

// Deliveries
export const getDeliveries = () => API.get('/deliveries');
export const addDelivery = (data) => API.post('/deliveries', data);
export const updateDelivery = (id, data) => API.put(`/deliveries/${id}`, data);
export const deleteDelivery = (id) => API.delete(`/deliveries/${id}`);

// Messages
export const getMessages = () => API.get('/messages');
export const markRead = (id) => API.put(`/messages/${id}/read`);
export const markAllRead = () => API.put('/messages/read/all');
export const deleteMessage = (id) => API.delete(`/messages/${id}`);

// Attendance
export const getAttendance = (params) => API.get('/attendance', { params });
export const markAttendance = (data) => API.post('/attendance', data);
export const deleteAttendance = (id) => API.delete(`/attendance/${id}`);
export const getEmployees = () => API.get('/attendance/employees');
export const addEmployee = (data) => API.post('/attendance/employees', data);
export const deleteEmployee = (id) => API.delete(`/attendance/employees/${id}`);

// Reports
export const getDashboardStats = () => API.get('/reports/dashboard');
export const getReport = (params) => API.get('/reports', { params });
export const exportExcel = (type, params) =>
  API.get(`/reports/export/${type}/excel`, { params, responseType: 'blob' });
export const exportPDF = (type) =>
  API.get(`/reports/export/${type}/pdf`, { responseType: 'text' });

export default API;
