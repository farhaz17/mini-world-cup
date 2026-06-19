import api from './api';
import { Player } from '../types';

export const playersService = {
  getAll: async (params?: { position?: string; sort?: string; search?: string; teamId?: string }) => {
    const res = await api.get<{ players: Player[]; count: number }>('/players', { params });
    return res.data;
  },
  getTop: async () => {
    const res = await api.get<{ players: Player[] }>('/players/top');
    return res.data.players;
  },
};
