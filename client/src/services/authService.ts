import api from './api';
import { User } from '../types';

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    return res.data;
  },
  register: async (data: { name: string; email: string; password: string; teamName: string }) => {
    const res = await api.post<{ token: string; user: User }>('/auth/register', data);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get<{ user: User }>('/auth/me');
    return res.data.user;
  },
};
