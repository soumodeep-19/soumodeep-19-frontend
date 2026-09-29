import api from './api';

export const dashboardService = {
  async getDashboard() {
    return await api.get('/dashboard');
  },

  async getAnalytics() {
    return await api.get('/dashboard/analytics');
  },

  async getInsights() {
    return await api.get('/dashboard/insights');
  }
};
