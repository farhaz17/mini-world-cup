import React from 'react';
import { LeagueEntry } from '../types';
import { useAuth } from '../context/AuthContext';

interface Props { standings: LeagueEntry[] }

export default function LeaderboardTable({ standings }: Props) {
  const { user } = useAuth();

  return (
    <div className="mx-4 bg-white rounded-2xl border border-[#EEEFF2] overflow-hidden shadow-sm">
      <div className="grid grid-cols-[28px_1fr_52px_52px_28px] gap-0 px-3 py-2.5 mint-gradient items-center">
        <span className="text-xs font-bold text-dark/70">#</span>
        <span className="text-xs font-bold text-dark">Manager</span>
        <span className="text-xs font-bold text-dark text-center">GW Pts</span>
        <span className="text-xs font-bold text-dark text-center">Total</span>
        <span className="text-xs font-bold text-dark text-center"></span>
      </div>
      {standings.map((entry, i) => {
        const isMe = user && entry.userId._id === user._id;
        return (
          <div
            key={entry._id}
            className={`grid grid-cols-[28px_1fr_52px_52px_28px] gap-0 px-3 py-3 items-center border-b border-[#EEEFF2] last:border-0 ${isMe ? 'bg-mint/10' : i % 2 === 1 ? 'bg-gray-50/50' : ''}`}
          >
            <span className={`text-sm font-bold font-cool ${i < 3 ? 'mint-gradient-text' : 'text-gray-400'}`}>{i + 1}</span>
            <div>
              <div className="text-xs font-semibold text-dark flex items-center gap-1">
                {isMe && <span className="text-[10px] bg-mint text-dark px-1 rounded-sm">YOU</span>}
                {entry.userId.teamName}
              </div>
              <div className="text-[10px] text-gray-400">{entry.userId.name}</div>
            </div>
            <span className="text-sm font-cool text-center text-dark">{entry.gameweekPoints}</span>
            <span className={`text-sm font-bold font-cool text-center ${i < 3 ? 'mint-gradient-text' : 'text-dark'}`}>{entry.totalPoints}</span>
            <span className="text-xs text-center text-gray-300">–</span>
          </div>
        );
      })}
    </div>
  );
}
