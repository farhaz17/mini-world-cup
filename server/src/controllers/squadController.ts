import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Squad from '../models/Squad';
import Player from '../models/Player';
import { AppError } from '../utils/AppError';
import { validateAndAddPlayer, removePlayerFromSquad } from '../services/squadService';
import { z } from 'zod';

export const getSquad = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let squad = await Squad.findOne({ userId: req.user!.userId }).populate({
      path: 'players',
      populate: { path: 'teamId', select: 'name shortName flag primaryColor' },
    });
    if (!squad) {
      squad = await Squad.create({ userId: req.user!.userId });
    }
    res.json({ success: true, squad });
  } catch (err) {
    next(err);
  }
};

export const pickPlayer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { playerId } = z.object({ playerId: z.string() }).parse(req.body);
    let squad = await Squad.findOne({ userId: req.user!.userId });
    if (!squad) squad = await Squad.create({ userId: req.user!.userId });

    await validateAndAddPlayer(squad, playerId);
    await squad.save();

    const populated = await Squad.findById(squad._id).populate({
      path: 'players',
      populate: { path: 'teamId', select: 'name shortName flag primaryColor' },
    });
    res.json({ success: true, squad: populated });
  } catch (err) {
    next(err);
  }
};

export const removePlayer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let squad = await Squad.findOne({ userId: req.user!.userId });
    if (!squad) throw new AppError('Squad not found', 404);

    await removePlayerFromSquad(squad, req.params.playerId);
    await squad.save();

    const populated = await Squad.findById(squad._id).populate({
      path: 'players',
      populate: { path: 'teamId', select: 'name shortName flag primaryColor' },
    });
    res.json({ success: true, squad: populated });
  } catch (err) {
    next(err);
  }
};

export const transferPlayer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { removeId, addId } = z.object({ removeId: z.string(), addId: z.string() }).parse(req.body);
    let squad = await Squad.findOne({ userId: req.user!.userId });
    if (!squad) throw new AppError('Squad not found', 404);

    await removePlayerFromSquad(squad, removeId);

    // Extra transfer penalty
    if (squad.transfersRemaining <= 0) {
      squad.totalPoints = Math.max(0, squad.totalPoints - 4);
    } else {
      squad.transfersRemaining -= 1;
    }

    await validateAndAddPlayer(squad, addId);
    await squad.save();

    const populated = await Squad.findById(squad._id).populate({
      path: 'players',
      populate: { path: 'teamId', select: 'name shortName flag primaryColor' },
    });
    res.json({ success: true, squad: populated });
  } catch (err) {
    next(err);
  }
};
