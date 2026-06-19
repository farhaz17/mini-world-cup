import React from 'react';
import { Player } from '../types';
import { getLastName } from '../utils/formatters';

interface Props { player: Player }

function getRarity(ovr: number): { card: string; accent: string; shine: string; label: string } {
  if (ovr >= 88) return {
    card: 'linear-gradient(160deg, #1A1200 0%, #3D2B00 30%, #2A1C00 60%, #1A1200 100%)',
    accent: '#F5D77B',
    shine: 'linear-gradient(135deg, rgba(245,215,123,0.22) 0%, transparent 55%, rgba(245,215,123,0.1) 100%)',
    label: 'ELITE',
  };
  if (ovr >= 80) return {
    card: 'linear-gradient(160deg, #0A1300 0%, #1C2E00 30%, #142000 60%, #0A1300 100%)',
    accent: '#00E676',
    shine: 'linear-gradient(135deg, rgba(0,230,118,0.18) 0%, transparent 55%, rgba(0,230,118,0.08) 100%)',
    label: 'GOLD',
  };
  if (ovr >= 72) return {
    card: 'linear-gradient(160deg, #0A0A14 0%, #1A1A2E 30%, #12121F 60%, #0A0A14 100%)',
    accent: '#90A4AE',
    shine: 'linear-gradient(135deg, rgba(144,164,174,0.18) 0%, transparent 55%, rgba(144,164,174,0.08) 100%)',
    label: 'SILVER',
  };
  return {
    card: 'linear-gradient(160deg, #0D0704 0%, #1F1008 30%, #150C05 60%, #0D0704 100%)',
    accent: '#CD7F32',
    shine: 'linear-gradient(135deg, rgba(205,127,50,0.18) 0%, transparent 55%, rgba(205,127,50,0.08) 100%)',
    label: 'BRONZE',
  };
}

function getStatLabels(position: string): string[] {
  if (position === 'GK')  return ['SPD', 'KIC', 'POS', 'REF', 'HAN'];
  if (position === 'DEF') return ['PAC', 'SHO', 'PAS', 'DEF', 'PHY'];
  return ['PAC', 'SHO', 'PAS', 'DEF', 'PHY'];
}

function getStatValues(player: Player): number[] {
  if (player.position === 'GK') {
    return [player.pace, player.shooting, player.passing, player.defending, player.physical];
  }
  return [player.pace, player.shooting, player.passing, player.defending, player.physical];
}

function getPositionBg(position: string): string {
  switch (position) {
    case 'GK': return '#FF9800';
    case 'DEF': return '#2196F3';
    default: return '#F44336';
  }
}

function PlayerAvatar({ flag, primaryColor, position }: { flag: string; primaryColor: string; position: string }) {
  const emoji = position === 'GK' ? '🧤' : position === 'DEF' ? '🛡️' : '⚡';
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="text-3xl">{flag}</div>
      <div className="text-xl opacity-70">{emoji}</div>
    </div>
  );
}

export default function FIFACard({ player }: Props) {
  const ovr = player.overallRating ?? 70;
  const rarity = getRarity(ovr);
  const statLabels = getStatLabels(player.position);
  const statValues = getStatValues(player);
  const lastName = getLastName(player.name);

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        width: '152px',
        height: '218px',
        borderRadius: '14px',
        background: rarity.card,
        boxShadow: `0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px ${rarity.accent}30, inset 0 1px 0 ${rarity.accent}20`,
      }}
    >
      {/* Shine overlay */}
      <div className="absolute inset-0 rounded-[14px]" style={{ background: rarity.shine }} />

      {/* Corner accent lines */}
      <div className="absolute top-0 left-0 w-6 h-6"
        style={{ borderTop: `2px solid ${rarity.accent}60`, borderLeft: `2px solid ${rarity.accent}60`, borderRadius: '14px 0 0 0' }} />
      <div className="absolute top-0 right-0 w-6 h-6"
        style={{ borderTop: `2px solid ${rarity.accent}60`, borderRight: `2px solid ${rarity.accent}60`, borderRadius: '0 14px 0 0' }} />

      {/* Top section */}
      <div className="relative px-3 pt-3 pb-1">
        {/* OVR + flag row */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <span
              className="font-cool leading-none"
              style={{ fontSize: '38px', color: rarity.accent, textShadow: `0 0 20px ${rarity.accent}60` }}
            >
              {ovr}
            </span>
            <span
              className="text-[10px] font-bold tracking-widest mt-0.5 px-1.5 py-0.5 rounded"
              style={{ color: '#0A0A0A', background: rarity.accent }}
            >
              {player.position}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1 mt-0.5">
            <span className="text-2xl">{player.teamId?.flag}</span>
            <span
              className="text-[9px] font-bold tracking-widest"
              style={{ color: rarity.accent + 'AA' }}
            >
              {rarity.label}
            </span>
          </div>
        </div>

        {/* Avatar center */}
        <div className="flex items-center justify-center py-2">
          <PlayerAvatar
            flag={player.teamId?.flag ?? '⚽'}
            primaryColor={player.teamId?.primaryColor ?? '#333'}
            position={player.position}
          />
        </div>

        {/* Player name */}
        <div
          className="text-center font-bold text-[11px] tracking-wider pb-1 truncate"
          style={{ color: 'rgba(255,255,255,0.92)' }}
        >
          {lastName.toUpperCase()}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px" style={{ background: `linear-gradient(90deg, transparent, ${rarity.accent}50, transparent)` }} />

      {/* Stats section */}
      <div className="px-3 pt-2">
        <div className="grid grid-cols-5 gap-0.5">
          {statLabels.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <span
                className="font-cool text-[14px] leading-none font-bold"
                style={{ color: rarity.accent }}
              >
                {statValues[i] ?? 0}
              </span>
              <span className="text-[8px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom team strip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1.5 opacity-60"
        style={{ background: `linear-gradient(90deg, ${player.teamId?.primaryColor ?? rarity.accent}80, ${rarity.accent}60)` }}
      />
    </div>
  );
}
