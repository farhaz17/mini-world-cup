import React from 'react';
import { Team } from '../types';

interface Props { teams: Team[] }

export default function PointsTable({ teams: rawTeams }: Props) {
  const teams = [...rawTeams].sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));

  return (
    <div className="mx-4 bg-white rounded-2xl border border-[#EEEFF2] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="grid grid-cols-[28px_1fr_28px_28px_28px_28px_32px_32px] gap-0 px-3 py-2.5 mint-gradient items-center">
        <span className="text-xs font-bold text-dark/70">#</span>
        <span className="text-xs font-bold text-dark">Team</span>
        <span className="text-xs font-bold text-dark text-center">P</span>
        <span className="text-xs font-bold text-dark text-center">W</span>
        <span className="text-xs font-bold text-dark text-center">D</span>
        <span className="text-xs font-bold text-dark text-center">L</span>
        <span className="text-xs font-bold text-dark text-center">GD</span>
        <span className="text-xs font-bold text-dark text-center">Pts</span>
      </div>
      {/* Rows */}
      {teams.map((team, i) => {
        const gd = team.goalsFor - team.goalsAgainst;
        const isTop3 = i < 3;
        return (
          <div
            key={team._id}
            className={`grid grid-cols-[28px_1fr_28px_28px_28px_28px_32px_32px] gap-0 px-3 py-2.5 items-center border-b border-[#EEEFF2] last:border-0 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}
          >
            <span className={`text-sm font-bold font-cool ${isTop3 ? 'mint-gradient-text' : 'text-gray-400'}`}>{i + 1}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base">{team.flag}</span>
              <span className="text-xs font-semibold text-dark">{team.shortName}</span>
            </div>
            <span className="text-xs text-center text-gray-600">{team.played}</span>
            <span className="text-xs text-center text-gray-600">{team.won}</span>
            <span className="text-xs text-center text-gray-600">{team.drawn}</span>
            <span className="text-xs text-center text-gray-600">{team.lost}</span>
            <span className="text-xs text-center text-gray-600">{gd > 0 ? `+${gd}` : gd}</span>
            <span className={`text-sm font-bold font-cool text-center ${isTop3 ? 'mint-gradient-text' : 'text-dark'}`}>{team.points}</span>
          </div>
        );
      })}
    </div>
  );
}
