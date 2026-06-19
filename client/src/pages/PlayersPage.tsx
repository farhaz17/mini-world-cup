import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { playersService } from '../services/playersService';
import FIFACard from '../components/FIFACard';

const POS_FILTERS = ['ALL', 'GK', 'DEF', 'FWD'] as const;
type PosFilter = typeof POS_FILTERS[number];

const TEAM_FILTERS = [
  { short: 'ALL', flag: '🌍' },
  { short: 'ARG', flag: '🇦🇷' },
  { short: 'BRA', flag: '🇧🇷' },
  { short: 'ESP', flag: '🇪🇸' },
  { short: 'GER', flag: '🇩🇪' },
  { short: 'FRA', flag: '🇫🇷' },
];

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [pos, setPos] = useState<PosFilter>('ALL');
  const [team, setTeam] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    playersService.getAll({ sort: 'overallRating' }).then((res) => {
      // Sort by overallRating desc on client too, since endpoint might not know the field
      const sorted = [...res.players].sort((a, b) => (b.overallRating ?? 0) - (a.overallRating ?? 0));
      setPlayers(sorted);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = players.filter((p) => {
    if (pos !== 'ALL' && p.position !== pos) return false;
    if (team !== 'ALL' && p.teamId?.shortName !== team) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Header */}
      <div className="px-4 pt-5">
        <div className="font-cool text-2xl text-dark">Player Cards</div>
        <div className="text-xs text-gray-400">EA FC Style · Overall Ratings</div>
      </div>

      {/* Position filter */}
      <div className="flex gap-2 px-4">
        {POS_FILTERS.map((p) => (
          <button
            key={p}
            onClick={() => setPos(p)}
            className="flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all"
            style={pos === p
              ? { background: 'linear-gradient(135deg, #00E676, #76FF03)', border: 'none', color: '#1A1A2E' }
              : { background: '#fff', borderColor: '#EEEFF2', color: '#888' }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Team filter */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {TEAM_FILTERS.map((t) => (
          <button
            key={t.short}
            onClick={() => setTeam(t.short)}
            className="flex-shrink-0 text-lg px-3 py-1 rounded-xl border transition-all"
            style={team === t.short
              ? { background: 'linear-gradient(135deg, #00E676, #76FF03)', border: 'none' }
              : { background: '#fff', borderColor: '#EEEFF2' }}
          >
            {t.flag}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="px-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">{filtered.length} players</span>
        <div className="flex items-center gap-3 text-[10px] text-gray-400">
          <span>🟡 Elite 88+</span>
          <span>🟢 Gold 80+</span>
          <span>⚪ Silver 72+</span>
          <span>🟤 Bronze</span>
        </div>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-mint border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="px-4 grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 152px)', justifyContent: 'center' }}>
          {filtered.map((player) => (
            <FIFACard key={player._id} player={player} />
          ))}
          {!filtered.length && (
            <div className="col-span-2 text-center text-gray-400 text-sm py-12">No players found</div>
          )}
        </div>
      )}
    </div>
  );
}
