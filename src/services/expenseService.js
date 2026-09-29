import api from './api';

export const expenseService = {
  async getExpenses(params = {}) {
    return await api.get('/expenses', { params });
  },

  async getExpenseById(id) {
    return await api.get(`/expenses/${id}`);
  },

  async createExpense(data) {
    return await api.post('/expenses', data);
  },

  async updateExpense(id, data) {
    return await api.put(`/expenses/${id}`, data);
  },

  async deleteExpense(id) {
    return await api.delete(`/expenses/${id}`);
  }
};
