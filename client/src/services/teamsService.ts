import api from './api';
import { Team } from '../types';

export const teamsService = {
  getAll: async () => {
    const res = await api.get<{ teams: Team[] }>('/teams');
    return res.data.teams;
  },
};
