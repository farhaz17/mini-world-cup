import { Request, Response, NextFunction } from 'express';
import Squad from '../models/Squad';

export const getLeague = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const squads = await Squad.find()
      .populate('userId', 'name teamName')
      .sort({ totalPoints: -1 });
    res.json({ success: true, standings: squads });
  } catch (err) {
    next(err);
  }
};

export const getTopLeague = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const squads = await Squad.find()
      .populate('userId', 'name teamName')
      .sort({ totalPoints: -1 })
      .limit(5);
    res.json({ success: true, standings: squads });
  } catch (err) {
    next(err);
  }
};
