import api from './api';

export const budgetService = {
  async getBudgets() {
    return await api.get('/budgets');
  },

  async upsertBudget(data) {
    return await api.post('/budgets', data);
  },

  async deleteBudget(id) {
    return await api.delete(`/budgets/${id}`);
  }
};
