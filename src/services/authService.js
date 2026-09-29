import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    if (res.data?.token) {
      localStorage.setItem('teenspend_token', res.data.token);
      localStorage.setItem('teenspend_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  async login(data) {
    const res = await api.post('/auth/login', data);
    if (res.data?.token) {
      localStorage.setItem('teenspend_token', res.data.token);
      localStorage.setItem('teenspend_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  async getMe() {
    return await api.get('/auth/me');
  },

  logout() {
    localStorage.removeItem('teenspend_token');
    localStorage.removeItem('teenspend_user');
  }
};
