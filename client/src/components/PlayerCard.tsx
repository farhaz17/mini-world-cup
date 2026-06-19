import React from 'react';
import { Player } from '../types';
import { getPositionColor, getLastName } from '../utils/formatters';

interface Props {
  player: Player;
  rank?: number;
}

export default function PlayerCard({ player, rank }: Props) {
  const isTop = rank === 1;
  const posColor = getPositionColor(player.position);

  return (
    <div className={`min-w-[100px] bg-white rounded-2xl border shadow-sm p-3 flex flex-col items-center gap-2 ${isTop ? 'border-mint shadow-mint/30 shadow-md' : 'border-[#EEEFF2]'}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 ${isTop ? 'border-mint' : 'border-gray-100'}`}
        style={{ background: player.teamId?.primaryColor + '22' }}>
        {player.teamId?.flag}
      </div>
      <div className="text-xs font-semibold text-dark text-center leading-tight">{getLastName(player.name)}</div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: posColor }}>
          {player.position}
        </span>
      </div>
      <div className="mint-gradient text-dark text-sm font-bold font-cool px-2 py-0.5 rounded-full">
        {player.totalPoints} pts
      </div>
    </div>
  );
}
