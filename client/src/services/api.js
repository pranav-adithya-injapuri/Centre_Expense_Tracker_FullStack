import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://centre-expense-api.onrender.com/api',
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
