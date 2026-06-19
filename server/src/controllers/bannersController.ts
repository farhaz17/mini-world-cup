import { Request, Response, NextFunction } from 'express';
import Banner from '../models/Banner';

export const getBanners = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, banners });
  } catch (err) {
    next(err);
  }
};
