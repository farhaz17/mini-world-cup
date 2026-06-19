import React, { useEffect, useState } from 'react';
import { Banner, Match, Player, Team } from '../types';
import { bannersService } from '../services/bannersService';
import { matchesService } from '../services/matchesService';
import { playersService } from '../services/playersService';
import { teamsService } from '../services/teamsService';
import SponsorCarousel from '../components/SponsorCarousel';
import PointsTable from '../components/PointsTable';
import MatchCard from '../components/MatchCard';
import PlayerCard from '../components/PlayerCard';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    bannersService.getAll().then(setBanners).catch(() => {});
    matchesService.getAll().then(setMatches).catch(() => {});
    playersService.getTop().then(setTopPlayers).catch(() => {});
    teamsService.getAll().then(setTeams).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Top bar */}
      <div className="px-4 pt-5 flex items-center justify-between">
        <div>
          <div className="font-cool text-2xl text-dark leading-tight">Fantasy League</div>
          <div className="text-[10px] text-gray-400">Powered by La Perfumes</div>
        </div>
        <button
          onClick={logout}
          className="text-xs text-gray-400 border border-[#EEEFF2] px-3 py-1.5 rounded-xl"
        >
          {user?.name.split(' ')[0]} ↩
        </button>
      </div>

      {/* Sponsor carousel */}
      <SponsorCarousel banners={banners} />

      {/* Points Table */}
      <div>
        <div className="px-4 mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-dark">Standings</span>
          <span className="text-xs text-gray-400">Group Stage</span>
        </div>
        <PointsTable teams={teams} />
      </div>

      {/* Schedule */}
      <div>
        <div className="px-4 mb-2">
          <span className="text-sm font-semibold text-dark">Schedule</span>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-1">
          {matches.map((match) => (
            <MatchCard key={match._id} match={match} />
          ))}
          {!matches.length && (
            <div className="text-xs text-gray-400 py-4">No matches scheduled</div>
          )}
        </div>
      </div>

      {/* Top Players */}
      <div>
        <div className="px-4 mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-dark">Top Players</span>
          <span className="text-xs text-gray-400">This Gameweek</span>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-1">
          {topPlayers.map((player, i) => (
            <PlayerCard key={player._id} player={player} rank={i + 1} />
          ))}
          {!topPlayers.length && (
            <div className="text-xs text-gray-400 py-4">No players available</div>
          )}
        </div>
      </div>
    </div>
  );
}
