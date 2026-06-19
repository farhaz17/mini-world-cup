import { Request, Response, NextFunction } from 'express';
import Match from '../models/Match';

export const getAllMatches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { gameweek } = req.query;
    const filter: Record<string, unknown> = {};
    if (gameweek) filter.gameweek = Number(gameweek);

    const matches = await Match.find(filter)
      .populate('homeTeam', 'name shortName flag primaryColor')
      .populate('awayTeam', 'name shortName flag primaryColor')
      .sort({ matchTime: 1 });
    res.json({ success: true, matches });
  } catch (err) {
    next(err);
  }
};

export const getLiveMatches = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const live = await Match.find({ status: { $in: ['live', 'scheduled'] } })
      .populate('homeTeam', 'name shortName flag primaryColor')
      .populate('awayTeam', 'name shortName flag primaryColor')
      .sort({ matchTime: 1 })
      .limit(5);
    res.json({ success: true, matches: live });
  } catch (err) {
    next(err);
  }
};
