import React, { useEffect, useState } from 'react';
import { Squad } from '../types';
import { squadService } from '../services/squadService';
import PitchView from '../components/PitchView';
import PlayerMarket from '../components/PlayerMarket';
import { formatPrice } from '../utils/formatters';

export default function FantasyPage() {
  const [squad, setSquad] = useState<Squad | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMarket, setShowMarket] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    squadService.getSquad().then(setSquad).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (playerId: string) => {
    setError('');
    try {
      const updated = await squadService.pickPlayer(playerId);
      setSquad(updated);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to add player');
    }
  };

  const handleRemove = async (playerId: string) => {
    setError('');
    try {
      const updated = await squadService.removePlayer(playerId);
      setSquad(updated);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to remove player');
    }
  };

  if (loading) return (
    <div className="flex justify-center pt-20">
      <div className="w-8 h-8 border-4 border-mint border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const players = squad?.players || [];
  const gkCount = players.filter((p) => p.position === 'GK').length;
  const defCount = players.filter((p) => p.position === 'DEF').length;
  const fwdCount = players.filter((p) => p.position === 'FWD').length;

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Header */}
      <div className="px-4 pt-5 flex items-center justify-between">
        <div>
          <div className="font-cool text-2xl text-dark">My Squad</div>
          <div className="text-xs text-gray-400">7-a-side · 1-3-3</div>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div className="font-cool text-lg mint-gradient-text">{squad?.totalPoints || 0} pts</div>
          <div className="text-xs text-gray-400">Budget: <span className="font-semibold text-dark">{formatPrice(squad?.budget || 50)}</span></div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      {/* Position pills */}
      <div className="flex gap-2 px-4">
        {[
          { label: 'GK', count: gkCount, max: 1, color: '#FF9800' },
          { label: 'DEF', count: defCount, max: 3, color: '#2196F3' },
          { label: 'FWD', count: fwdCount, max: 3, color: '#F44336' },
        ].map((pos) => (
          <div
            key={pos.label}
            className="flex-1 bg-white rounded-xl border border-[#EEEFF2] px-2 py-2 text-center"
          >
            <div className="text-[10px] font-bold mb-1" style={{ color: pos.color }}>{pos.label}</div>
            <div className="text-xs font-semibold text-dark">{pos.count}<span className="text-gray-300">/{pos.max}</span></div>
            <div className="flex gap-0.5 justify-center mt-1">
              {Array.from({ length: pos.max }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-1 rounded-full"
                  style={{ background: i < pos.count ? pos.color : '#EEEFF2' }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pitch view */}
      <PitchView squad={squad} onRemovePlayer={handleRemove} />

      {/* Transfers info */}
      {squad && (
        <div className="mx-4 bg-white rounded-xl border border-[#EEEFF2] px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">Free Transfers</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: i < squad.transfersRemaining ? '#00E676' : '#EEEFF2' }}
              >
                {i < squad.transfersRemaining && <div className="w-2 h-2 rounded-full bg-mint" />}
              </div>
            ))}
            <span className="text-xs text-gray-400 ml-1">{squad.transfersRemaining}/2</span>
          </div>
        </div>
      )}

      {/* Market button */}
      <div className="px-4">
        <button
          onClick={() => setShowMarket(!showMarket)}
          className="w-full mint-gradient text-dark font-semibold py-3 rounded-xl text-sm"
        >
          {showMarket ? '✕ Close Player Market' : '⚽ Open Player Market'}
        </button>
      </div>

      {/* Player Market */}
      {showMarket && (
        <PlayerMarket squad={squad} onAdd={handleAdd} onRemove={handleRemove} />
      )}

      {/* Squad list (when market closed) */}
      {!showMarket && players.length > 0 && (
        <div className="px-4 flex flex-col gap-2">
          <span className="text-sm font-semibold text-dark">Squad</span>
          {players.map((player) => (
            <div key={player._id} className="bg-white rounded-xl border border-[#EEEFF2] p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: player.teamId?.primaryColor + '22' }}>
                {player.teamId?.flag}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-dark truncate">{player.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold px-1 py-0.5 rounded text-white" style={{ background: player.position === 'GK' ? '#FF9800' : player.position === 'DEF' ? '#2196F3' : '#F44336' }}>{player.position}</span>
                  <span className="text-[10px] text-gray-400">{formatPrice(player.price)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-cool text-sm mint-gradient-text">{player.totalPoints}</span>
                <button
                  onClick={() => handleRemove(player._id)}
                  className="text-xs text-red-400 border border-red-200 px-2 py-1 rounded-lg"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
