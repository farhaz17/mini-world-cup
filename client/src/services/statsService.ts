import api from './api';
import { PlayerStats } from '../types';

export const statsService = {
  getPlayerStats: async (): Promise<PlayerStats> => {
    const res = await api.get<PlayerStats & { success: boolean }>('/stats');
    return res.data;
  },
};
