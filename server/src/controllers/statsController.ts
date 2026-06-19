import { Request, Response, NextFunction } from 'express';
import Player from '../models/Player';

export const getPlayerStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const populate = { path: 'teamId', select: 'flag shortName primaryColor darkColor name' };

    const [topScorer, topAssists, mvp, topCleanSheet] = await Promise.all([
      Player.findOne({ isAvailable: true }).sort({ goals: -1, totalPoints: -1 }).populate(populate),
      Player.findOne({ isAvailable: true }).sort({ assists: -1, totalPoints: -1 }).populate(populate),
      Player.findOne({ isAvailable: true }).sort({ totalPoints: -1 }).populate(populate),
      Player.findOne({ isAvailable: true, position: { $in: ['GK', 'DEF'] } }).sort({ cleanSheets: -1, totalPoints: -1 }).populate(populate),
    ]);

    const agg = await Player.aggregate([
      { $group: { _id: null, totalGoals: { $sum: '$goals' }, totalAssists: { $sum: '$assists' }, totalCleanSheets: { $sum: '$cleanSheets' }, totalPoints: { $sum: '$totalPoints' } } },
    ]);

    const overview = agg[0] ?? { totalGoals: 0, totalAssists: 0, totalCleanSheets: 0, totalPoints: 0 };

    res.json({ success: true, topScorer, topAssists, mvp, topCleanSheet, overview });
  } catch (err) {
    next(err);
  }
};
