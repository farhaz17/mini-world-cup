import React from 'react';
import { Player, Squad } from '../types';
import { getLastName } from '../utils/formatters';

interface Props {
  squad: Squad | null;
  onRemovePlayer: (playerId: string) => void;
}

function PlayerSlot({ player, onRemove }: { player?: Player; onRemove?: () => void }) {
  if (player) {
    return (
      <button
        onClick={onRemove}
        className="flex flex-col items-center gap-0.5 group"
      >
        <div className="relative">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 border-white shadow"
            style={{ background: player.teamId?.primaryColor + '44' || '#ddd' }}
          >
            {player.teamId?.flag || '⚽'}
          </div>
          <div className="absolute -top-1 -right-1 mint-gradient text-dark text-[9px] font-bold font-cool px-1 rounded-full min-w-[18px] text-center">
            {player.gameweekPoints}
          </div>
        </div>
        <div className="text-white text-[10px] font-semibold bg-dark/60 px-1.5 py-0.5 rounded-full max-w-[64px] truncate">
          {getLastName(player.name)}
        </div>
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/50 flex items-center justify-center">
        <span className="text-white/50 text-xl">+</span>
      </div>
      <div className="text-white/40 text-[10px]">Empty</div>
    </div>
  );
}

export default function PitchView({ squad, onRemovePlayer }: Props) {
  const players = squad?.players || [];
  const gks  = players.filter((p) => p.position === 'GK');
  const defs = players.filter((p) => p.position === 'DEF');
  const fwds = players.filter((p) => p.position === 'FWD');

  const renderRow = (pos: 'GK' | 'DEF' | 'FWD', filledPlayers: Player[], total: number) => {
    const slots = Array.from({ length: total });
    return (
      <div className="flex justify-center gap-3">
        {slots.map((_, i) => (
          <PlayerSlot
            key={i}
            player={filledPlayers[i]}
            onRemove={filledPlayers[i] ? () => onRemovePlayer(filledPlayers[i]._id) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="mx-4 rounded-2xl overflow-hidden relative py-6 flex flex-col gap-5"
      style={{
        background: 'linear-gradient(180deg, #1a7a1a 0%, #1e8c1e 30%, #22a022 60%, #1e8c1e 80%, #1a7a1a 100%)',
        minHeight: '260px',
      }}
    >
      {/* Field markings */}
      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-px bg-white/20" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/20" />

      {/* FWD row */}
      {renderRow('FWD', fwds, 3)}
      {/* DEF row */}
      {renderRow('DEF', defs, 3)}
      {/* GK row */}
      {renderRow('GK', gks, 1)}

      {/* Goalkeeper box */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-6 border border-white/20 rounded-sm" />
    </div>
  );
}
