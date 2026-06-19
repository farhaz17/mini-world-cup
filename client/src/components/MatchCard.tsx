import React from 'react';
import { Match } from '../types';
import { formatDate, formatTime } from '../utils/formatters';

interface Props { match: Match }

export default function MatchCard({ match }: Props) {
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';

  return (
    <div className="min-w-[160px] bg-white rounded-2xl border border-[#EEEFF2] shadow-sm p-3 flex flex-col items-center gap-2">
      <div className="flex items-center justify-between w-full gap-2">
        {/* Home */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-2xl">{match.homeTeam.flag}</span>
          <span className="text-xs font-semibold text-dark">{match.homeTeam.shortName}</span>
        </div>
        {/* Score / Time */}
        <div className="flex flex-col items-center">
          {isCompleted || isLive ? (
            <div className="font-cool text-lg text-dark">
              {match.homeScore ?? 0} – {match.awayScore ?? 0}
            </div>
          ) : (
            <div className="text-xs text-gray-500 font-medium">{formatTime(match.matchTime)}</div>
          )}
          {isLive && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-red-500 font-bold">{match.minute ?? 0}'</span>
            </div>
          )}
          {!isLive && !isCompleted && (
            <div className="text-[10px] text-gray-400 mt-0.5">{formatDate(match.matchTime)}</div>
          )}
          {isCompleted && (
            <span className="text-[10px] text-gray-400 mt-0.5">FT</span>
          )}
        </div>
        {/* Away */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-2xl">{match.awayTeam.flag}</span>
          <span className="text-xs font-semibold text-dark">{match.awayTeam.shortName}</span>
        </div>
      </div>
      <div className="text-[10px] text-gray-400">GW{match.gameweek}</div>
    </div>
  );
}
