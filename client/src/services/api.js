import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Hardcoded for local dev for now
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getExpenses = (params) => api.get('/expenses', { params });
export const createExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export const getMonthlyReport = () => api.get('/reports/monthly');
export const getCategoryReport = () => api.get('/reports/category');

export default api;
