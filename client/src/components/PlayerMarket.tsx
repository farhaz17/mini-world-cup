import React, { useState, useEffect } from 'react';
import { Player, Squad } from '../types';
import { playersService } from '../services/playersService';
import { getPositionColor, formatPrice } from '../utils/formatters';

interface Props {
  squad: Squad | null;
  onAdd: (playerId: string) => void;
  onRemove: (playerId: string) => void;
}

const POSITIONS = ['ALL', 'GK', 'DEF', 'FWD'];
const TEAMS = [
  { shortName: 'ALL', flag: '🌍' },
  { shortName: 'ARG', flag: '🇦🇷' },
  { shortName: 'BRA', flag: '🇧🇷' },
  { shortName: 'ESP', flag: '🇪🇸' },
  { shortName: 'GER', flag: '🇩🇪' },
  { shortName: 'FRA', flag: '🇫🇷' },
];

export default function PlayerMarket({ squad, onAdd, onRemove }: Props) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState('ALL');
  const [teamFilter, setTeamFilter] = useState('ALL');
  const [sort, setSort] = useState('totalPoints');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = { sort };
        if (posFilter !== 'ALL') params.position = posFilter;
        if (search) params.search = search;
        const res = await playersService.getAll(params);
        setPlayers(res.players);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchPlayers, 300);
    return () => clearTimeout(timer);
  }, [search, posFilter, sort]);

  const squadPlayerIds = new Set(squad?.players.map((p) => p._id) || []);

  const filteredPlayers = teamFilter === 'ALL'
    ? players
    : players.filter((p) => p.teamId?.shortName === teamFilter);

  const canAdd = (player: Player): boolean => {
    if (!squad) return false;
    if (squad.budget < player.price) return false;
    if (squad.players.length >= 7) return false;
    const posCount = squad.players.filter((p) => p.position === player.position).length;
    const limits: Record<string, number> = { GK: 1, DEF: 3, FWD: 3 };
    if (posCount >= limits[player.position]) return false;
    const teamCount = squad.players.filter((p) => p.teamId?._id === player.teamId?._id).length;
    if (teamCount >= 2) return false;
    return true;
  };

  return (
    <div className="px-4 flex flex-col gap-3">
      {/* Search */}
      <input
        type="text"
        placeholder="Search players..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-[#EEEFF2] rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-mint transition-colors"
      />

      {/* Position filter */}
      <div className="flex gap-2">
        {POSITIONS.map((pos) => (
          <button
            key={pos}
            onClick={() => setPosFilter(pos)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all ${posFilter === pos ? 'mint-gradient border-transparent text-dark' : 'bg-white border-[#EEEFF2] text-gray-500'}`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Team filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TEAMS.map((t) => (
          <button
            key={t.shortName}
            onClick={() => setTeamFilter(t.shortName)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm border transition-all ${teamFilter === t.shortName ? 'mint-gradient border-transparent' : 'bg-white border-[#EEEFF2]'}`}
          >
            {t.flag}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex gap-2">
        {[['totalPoints', 'Points'], ['price', 'Price'], ['form', 'Form']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setSort(val)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${sort === val ? 'bg-dark text-white border-dark' : 'bg-white border-[#EEEFF2] text-gray-500'}`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 self-center">{filteredPlayers.length} players</span>
      </div>

      {/* Player list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-mint border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredPlayers.map((player) => {
            const inSquad = squadPlayerIds.has(player._id);
            const addable = !inSquad && canAdd(player);
            const posColor = getPositionColor(player.position);

            return (
              <div key={player._id} className="bg-white rounded-xl border border-[#EEEFF2] p-3 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: player.teamId?.primaryColor + '22' }}
                >
                  {player.teamId?.flag}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-dark truncate">{player.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold px-1 py-0.5 rounded text-white" style={{ background: posColor }}>{player.position}</span>
                    <span className="text-[10px] text-gray-400">{player.teamId?.shortName}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span className="font-cool text-sm font-bold mint-gradient-text">{player.totalPoints}</span>
                  <span className="text-[10px] text-gray-400">{formatPrice(player.price)}</span>
                </div>
                <button
                  onClick={() => inSquad ? onRemove(player._id) : onAdd(player._id)}
                  disabled={!inSquad && !addable}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex-shrink-0 ${
                    inSquad
                      ? 'bg-red-50 text-red-500 border border-red-200'
                      : addable
                        ? 'mint-gradient text-dark'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {inSquad ? 'Remove' : 'Add'}
                </button>
              </div>
            );
          })}
          {!filteredPlayers.length && (
            <div className="text-center text-gray-400 text-sm py-8">No players found</div>
          )}
        </div>
      )}
    </div>
  );
}
