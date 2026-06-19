import React from 'react';
import { LeagueEntry } from '../types';

interface Props { top3: LeagueEntry[] }

export default function Podium({ top3 }: Props) {
  if (top3.length < 1) return null;

  const [first, second, third] = [top3[0], top3[1], top3[2]];

  const PodiumBlock = ({
    entry, position, height, gradient, label,
  }: {
    entry?: LeagueEntry; position: 1 | 2 | 3; height: string; gradient: string; label: string;
  }) => (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="w-12 h-12 rounded-full flex items-center justify-center font-cool text-xl text-white" style={{ background: gradient }}>
        {position}
      </div>
      {entry && (
        <>
          <div className="text-[11px] font-semibold text-dark text-center leading-tight">{entry.userId.teamName}</div>
          <div className="font-cool text-xs mint-gradient-text">{entry.totalPoints} pts</div>
        </>
      )}
      <div className={`w-full rounded-t-xl flex items-center justify-center text-white font-bold font-cool text-lg ${height}`} style={{ background: gradient }}>
        {label}
      </div>
    </div>
  );

  return (
    <div className="mx-4 flex items-end gap-2 mt-4">
      <PodiumBlock entry={second} position={2} height="h-20" gradient="linear-gradient(135deg, #9E9E9E, #616161)" label="2nd" />
      <PodiumBlock entry={first} position={1} height="h-28" gradient="linear-gradient(135deg, #00E676, #76FF03)" label="1st" />
      <PodiumBlock entry={third} position={3} height="h-14" gradient="linear-gradient(135deg, #CD7F32, #A0522D)" label="3rd" />
    </div>
  );
}
