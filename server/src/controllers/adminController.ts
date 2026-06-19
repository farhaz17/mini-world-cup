import { Request, Response, NextFunction } from 'express';
import Player from '../models/Player';
import Match from '../models/Match';
import Team from '../models/Team';
import Banner from '../models/Banner';
import Gameweek from '../models/Gameweek';
import Squad from '../models/Squad';
import { applyMatchEvent, resetGameweekPoints } from '../services/pointsService';
import { z } from 'zod';

export const createPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json({ success: true, player });
  } catch (err) {
    next(err);
  }
};

export const updatePlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, player });
  } catch (err) {
    next(err);
  }
};

export const createMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json({ success: true, match });
  } catch (err) {
    next(err);
  }
};

export const updateMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Update team standings when match completes
    if (req.body.status === 'completed' && match) {
      const populatedMatch = await Match.findById(match._id)
        .populate('homeTeam')
        .populate('awayTeam');

      if (populatedMatch && populatedMatch.homeScore !== null && populatedMatch.awayScore !== null) {
        const homeTeam = await Team.findById(populatedMatch.homeTeam._id);
        const awayTeam = await Team.findById(populatedMatch.awayTeam._id);

        if (homeTeam && awayTeam) {
          homeTeam.played += 1;
          awayTeam.played += 1;
          homeTeam.goalsFor += populatedMatch.homeScore;
          homeTeam.goalsAgainst += populatedMatch.awayScore;
          awayTeam.goalsFor += populatedMatch.awayScore;
          awayTeam.goalsAgainst += populatedMatch.homeScore;

          if (populatedMatch.homeScore > populatedMatch.awayScore) {
            homeTeam.won += 1; homeTeam.points += 3;
            awayTeam.lost += 1;
          } else if (populatedMatch.awayScore > populatedMatch.homeScore) {
            awayTeam.won += 1; awayTeam.points += 3;
            homeTeam.lost += 1;
          } else {
            homeTeam.drawn += 1; homeTeam.points += 1;
            awayTeam.drawn += 1; awayTeam.points += 1;
          }

          await homeTeam.save();
          await awayTeam.save();
        }
      }
    }

    res.json({ success: true, match });
  } catch (err) {
    next(err);
  }
};

export const addMatchEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, playerId, minute } = z
      .object({
        type: z.enum(['goal', 'assist', 'yellow', 'red', 'cleansheet']),
        playerId: z.string(),
        minute: z.number().optional(),
      })
      .parse(req.body);

    const match = await Match.findById(req.params.id);
    if (!match) {
      res.status(404).json({ success: false, message: 'Match not found' });
      return;
    }

    match.events.push({ type, playerId: playerId as unknown as import('mongoose').Types.ObjectId, minute: minute || 0 });
    await match.save();

    await applyMatchEvent(playerId, type);

    res.json({ success: true, match });
  } catch (err) {
    next(err);
  }
};

export const advanceGameweek = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await Gameweek.updateMany({ isCurrent: true }, { isCurrent: false, status: 'completed' });
    const next_gw = await Gameweek.findOne({ status: 'upcoming' }).sort({ number: 1 });
    if (next_gw) {
      next_gw.isCurrent = true;
      next_gw.status = 'active';
      await next_gw.save();
    }
    await resetGameweekPoints();
    res.json({ success: true, message: 'Gameweek advanced', gameweek: next_gw });
  } catch (err) {
    next(err);
  }
};

export const createBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, banner });
  } catch (err) {
    next(err);
  }
};

export const seedDatabase = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json({ success: true, message: 'Use the seed script: npm run seed' });
  } catch (err) {
    next(err);
  }
};
