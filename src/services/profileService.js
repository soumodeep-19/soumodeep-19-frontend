import api from './api';

export const profileService = {
  async getProfile() {
    return await api.get('/profile');
  },

  async updateProfile(data) {
    return await api.put('/profile', data);
  }
};
