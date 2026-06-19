import Player, { IPlayer } from '../models/Player';
import Squad from '../models/Squad';

export const POINTS_MAP = {
  goalFWD: 5,
  goalDEF: 8,
  goalGK: 10,
  assist: 3,
  cleanSheetGK: 5,
  cleanSheetDEF: 3,
  yellowCard: -1,
  redCard: -3,
  playedUnder30: 1,
  playedOver30: 2,
};

export async function applyMatchEvent(
  playerId: string,
  eventType: 'goal' | 'assist' | 'yellow' | 'red' | 'cleansheet',
  minutePlayed?: number
): Promise<void> {
  const player = await Player.findById(playerId);
  if (!player) return;

  let pointsGained = 0;

  switch (eventType) {
    case 'goal':
      if (player.position === 'GK') pointsGained = POINTS_MAP.goalGK;
      else if (player.position === 'DEF') pointsGained = POINTS_MAP.goalDEF;
      else pointsGained = POINTS_MAP.goalFWD;
      player.goals += 1;
      break;
    case 'assist':
      pointsGained = POINTS_MAP.assist;
      player.assists += 1;
      break;
    case 'yellow':
      pointsGained = POINTS_MAP.yellowCard;
      break;
    case 'red':
      pointsGained = POINTS_MAP.redCard;
      break;
    case 'cleansheet':
      if (player.position === 'GK') pointsGained = POINTS_MAP.cleanSheetGK;
      else if (player.position === 'DEF') pointsGained = POINTS_MAP.cleanSheetDEF;
      player.cleanSheets += 1;
      break;
  }

  if (minutePlayed !== undefined) {
    pointsGained += minutePlayed >= 30 ? POINTS_MAP.playedOver30 : POINTS_MAP.playedUnder30;
  }

  player.gameweekPoints += pointsGained;
  player.totalPoints += pointsGained;
  player.form = Math.min(10, parseFloat((player.form * 0.8 + pointsGained * 0.2).toFixed(1)));
  await player.save();

  // Update all squads containing this player
  await Squad.updateMany(
    { players: player._id },
    {
      $inc: {
        gameweekPoints: pointsGained,
        totalPoints: pointsGained,
      },
    }
  );
}

export async function resetGameweekPoints(): Promise<void> {
  await Player.updateMany({}, { gameweekPoints: 0 });
  await Squad.updateMany({}, { gameweekPoints: 0, $inc: { transfersRemaining: 2 } });
}
