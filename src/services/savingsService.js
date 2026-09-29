import api from './api';

export const savingsService = {
  async getSavingsGoals() {
    return await api.get('/savings-goals');
  },

  async createSavingsGoal(data) {
    return await api.post('/savings-goals', data);
  },

  async updateSavingsGoal(id, data) {
    return await api.put(`/savings-goals/${id}`, data);
  },

  async deleteSavingsGoal(id) {
    return await api.delete(`/savings-goals/${id}`);
  }
};
