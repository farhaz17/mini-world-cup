import api from './api';
import { Banner } from '../types';

export const bannersService = {
  getAll: async () => {
    const res = await api.get<{ banners: Banner[] }>('/banners');
    return res.data.banners;
  },
};
