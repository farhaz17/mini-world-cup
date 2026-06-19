import { Request, Response, NextFunction } from 'express';
import Player from '../models/Player';

export const getAllPlayers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { position, sort = 'totalPoints', search, teamId } = req.query;
    const filter: Record<string, unknown> = { isAvailable: true };

    if (position) filter.position = position;
    if (teamId) filter.teamId = teamId;
    if (search) filter.name = { $regex: String(search), $options: 'i' };

    const sortField = sort === 'price' ? 'price' : sort === 'form' ? 'form' : 'totalPoints';
    const players = await Player.find(filter)
      .populate('teamId', 'name shortName flag primaryColor')
      .sort({ [sortField]: -1 });

    res.json({ success: true, players, count: players.length });
  } catch (err) {
    next(err);
  }
};

export const getTopPlayers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const players = await Player.find({ isAvailable: true })
      .populate('teamId', 'name shortName flag primaryColor')
      .sort({ totalPoints: -1 })
      .limit(8);
    res.json({ success: true, players });
  } catch (err) {
    next(err);
  }
};

export const getPlayerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const player = await Player.findById(req.params.id).populate('teamId', 'name shortName flag primaryColor');
    if (!player) {
      res.status(404).json({ success: false, message: 'Player not found' });
      return;
    }
    res.json({ success: true, player });
  } catch (err) {
    next(err);
  }
};
