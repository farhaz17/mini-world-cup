import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Gameweek from '../models/Gameweek';
import { AppError } from '../utils/AppError';

export const checkDeadline = async (
  _req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const current = await Gameweek.findOne({ isCurrent: true });
    if (current && new Date() > current.deadline) {
      return next(new AppError('Gameweek deadline has passed. Squad changes are locked.', 403));
    }
    next();
  } catch (err) {
    next(err);
  }
};
