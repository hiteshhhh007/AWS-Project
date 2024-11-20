import { api } from './api';

export const userService = {
  async getUserProfile(userId) {
    return api.get(`/user/${userId}`);
  },

  async updateProfile(updates) {
    return api.put('/user', updates);
  }
};
