import api from './api';
import { LeagueEntry } from '../types';

export const leagueService = {
  getAll: async () => {
    const res = await api.get<{ standings: LeagueEntry[] }>('/league');
    return res.data.standings;
  },
};
