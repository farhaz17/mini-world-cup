import { Request, Response, NextFunction } from 'express';
import Team from '../models/Team';
import Player from '../models/Player';

export const getAllTeams = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const teams = await Team.find().sort({ points: -1, goalsFor: -1 });
    res.json({ success: true, teams });
  } catch (err) {
    next(err);
  }
};

export const getTeamById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      res.status(404).json({ success: false, message: 'Team not found' });
      return;
    }
    const players = await Player.find({ teamId: team._id }).sort({ totalPoints: -1 });
    res.json({ success: true, team, players });
  } catch (err) {
    next(err);
  }
};
