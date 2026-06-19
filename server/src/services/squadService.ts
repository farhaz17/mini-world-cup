import mongoose from 'mongoose';
import Player, { IPlayer } from '../models/Player';
import Squad, { ISquad } from '../models/Squad';
import { AppError } from '../utils/AppError';

export async function validateAndAddPlayer(
  squad: ISquad,
  playerId: string
): Promise<void> {
  if (squad.players.length >= 7) {
    throw new AppError('Squad is full (max 7 players)', 400);
  }

  const playerObjectId = new mongoose.Types.ObjectId(playerId);
  if (squad.players.some((p) => p.equals(playerObjectId))) {
    throw new AppError('Player already in squad', 400);
  }

  const player = await Player.findById(playerId);
  if (!player) throw new AppError('Player not found', 404);
  if (!player.isAvailable) throw new AppError('Player is unavailable', 400);

  // Position check
  const currentPlayers = await Player.find({ _id: { $in: squad.players } });
  const positionCounts = { GK: 0, DEF: 0, FWD: 0 };
  currentPlayers.forEach((p) => positionCounts[p.position]++);

  const limits = { GK: 1, DEF: 3, FWD: 3 };
  if (positionCounts[player.position] >= limits[player.position]) {
    throw new AppError(`Position ${player.position} is full`, 400);
  }

  // Max 2 per team
  const teamCount = currentPlayers.filter((p) =>
    p.teamId.equals(player.teamId)
  ).length;
  if (teamCount >= 2) {
    throw new AppError('Maximum 2 players from the same team', 400);
  }

  // Budget check
  if (squad.budget < player.price) {
    throw new AppError('Insufficient budget', 400);
  }

  squad.players.push(playerObjectId);
  squad.budget = parseFloat((squad.budget - player.price).toFixed(1));
}

export async function removePlayerFromSquad(
  squad: ISquad,
  playerId: string
): Promise<void> {
  const playerObjectId = new mongoose.Types.ObjectId(playerId);
  const index = squad.players.findIndex((p) => p.equals(playerObjectId));
  if (index === -1) throw new AppError('Player not in squad', 400);

  const player = await Player.findById(playerId);
  if (!player) throw new AppError('Player not found', 404);

  squad.players.splice(index, 1);
  squad.budget = parseFloat((squad.budget + player.price).toFixed(1));
}
