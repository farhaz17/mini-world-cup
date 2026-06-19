import api from './api';
import { Match } from '../types';

export const matchesService = {
  getAll: async (gameweek?: number) => {
    const res = await api.get<{ matches: Match[] }>('/matches', { params: gameweek ? { gameweek } : {} });
    return res.data.matches;
  },
  getLive: async () => {
    const res = await api.get<{ matches: Match[] }>('/matches/live');
    return res.data.matches;
  },
};
