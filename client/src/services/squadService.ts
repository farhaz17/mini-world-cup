import api from './api';
import { Squad } from '../types';

export const squadService = {
  getSquad: async () => {
    const res = await api.get<{ squad: Squad }>('/squad');
    return res.data.squad;
  },
  pickPlayer: async (playerId: string) => {
    const res = await api.post<{ squad: Squad }>('/squad/pick', { playerId });
    return res.data.squad;
  },
  removePlayer: async (playerId: string) => {
    const res = await api.delete<{ squad: Squad }>(`/squad/remove/${playerId}`);
    return res.data.squad;
  },
  transfer: async (removeId: string, addId: string) => {
    const res = await api.post<{ squad: Squad }>('/squad/transfer', { removeId, addId });
    return res.data.squad;
  },
};
