import React, { useEffect, useState } from 'react';
import { LeagueEntry, Player, PlayerStats } from '../types';
import { leagueService } from '../services/leagueService';
import { statsService } from '../services/statsService';
import Podium from '../components/Podium';
import LeaderboardTable from '../components/LeaderboardTable';
import { getPositionColor, getLastName } from '../utils/formatters';

function StatOverviewCard({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div className="flex-1 bg-white rounded-xl border border-[#EEEFF2] p-3 flex flex-col items-center gap-1 min-w-0">
      <span className="text-lg">{icon}</span>
      <span className="font-cool text-xl text-dark">{value}</span>
      <span className="text-[10px] text-gray-400 text-center leading-tight">{label}</span>
    </div>
  );
}

function AwardCard({ title, icon, player, statLabel, statValue, color }: {
  title: string; icon: string; player: Player | null; statLabel: string; statValue: number; color: string;
}) {
  const posColor = player ? getPositionColor(player.position) : '#999';
  return (
    <div className="bg-white rounded-2xl border border-[#EEEFF2] shadow-sm overflow-hidden">
      {/* Award header */}
      <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: color + '14' }}>
        <span className="text-base">{icon}</span>
        <span className="text-xs font-bold text-dark tracking-wide">{title}</span>
        <div className="ml-auto w-2 h-2 rounded-full" style={{ background: color }} />
      </div>
      {/* Player info */}
      <div className="px-4 py-3 flex items-center gap-3">
        {player ? (
          <>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 border-2"
              style={{ background: (player.teamId?.primaryColor || '#ddd') + '22', borderColor: color + '40' }}
            >
              {player.teamId?.flag}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-dark truncate">{player.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: posColor }}>
                  {player.position}
                </span>
                <span className="text-[10px] text-gray-400">{player.teamId?.shortName}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
              <span className="font-cool text-2xl font-bold" style={{ color }}>{statValue}</span>
              <span className="text-[10px] text-gray-400">{statLabel}</span>
            </div>
          </>
        ) : (
          <div className="flex-1 text-center text-xs text-gray-300 py-2">—</div>
        )}
      </div>
    </div>
  );
}

export default function LeaguePage() {
  const [standings, setStandings] = useState<LeagueEntry[]>([]);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      leagueService.getAll(),
      statsService.getPlayerStats(),
    ]).then(([s, st]) => {
      setStandings(s);
      setStats(st);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center pt-20">
      <div className="w-8 h-8 border-4 border-mint border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const ov = stats?.overview;

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="px-4 pt-5">
        <div className="font-cool text-2xl text-dark">League</div>
        <div className="text-xs text-gray-400">Season Standings · July 4 Tournament</div>
      </div>

      {/* Podium */}
      {standings.length >= 3 && <Podium top3={standings.slice(0, 3)} />}

      {/* Leaderboard */}
      <div>
        <div className="px-4 mb-2">
          <span className="text-sm font-semibold text-dark">Leaderboard</span>
        </div>
        <LeaderboardTable standings={standings} />
      </div>

      {/* League Stats Overview */}
      <div className="px-4">
        <div className="mb-2">
          <span className="text-sm font-semibold text-dark">Tournament Stats</span>
        </div>
        <div className="flex gap-2">
          <StatOverviewCard label="Total Goals" value={ov?.totalGoals ?? 0} icon="⚽" />
          <StatOverviewCard label="Assists" value={ov?.totalAssists ?? 0} icon="🎯" />
          <StatOverviewCard label="Clean Sheets" value={ov?.totalCleanSheets ?? 0} icon="🧤" />
          <StatOverviewCard label="Fantasy Pts" value={ov?.totalPoints ?? 0} icon="⭐" />
        </div>
      </div>

      {/* Player Awards */}
      <div className="px-4">
        <div className="mb-2">
          <span className="text-sm font-semibold text-dark">Player Awards</span>
        </div>
        <div className="flex flex-col gap-3">
          <AwardCard
            title="FANTASY MVP"
            icon="👑"
            player={stats?.mvp ?? null}
            statLabel="Points"
            statValue={stats?.mvp?.totalPoints ?? 0}
            color="#C9A84C"
          />
          <AwardCard
            title="TOP SCORER"
            icon="👟"
            player={stats?.topScorer ?? null}
            statLabel="Goals"
            statValue={stats?.topScorer?.goals ?? 0}
            color="#F44336"
          />
          <AwardCard
            title="TOP ASSISTS"
            icon="🎯"
            player={stats?.topAssists ?? null}
            statLabel="Assists"
            statValue={stats?.topAssists?.assists ?? 0}
            color="#2196F3"
          />
          <AwardCard
            title="BEST KEEPER"
            icon="🧤"
            player={stats?.topCleanSheet ?? null}
            statLabel="Clean Sheets"
            statValue={stats?.topCleanSheet?.cleanSheets ?? 0}
            color="#00E676"
          />
        </div>
      </div>
    </div>
  );
}
