import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthPayload extends JwtPayload {
  userId: string;
  role: 'admin' | 'user';
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export type Position = 'GK' | 'DEF' | 'FWD';
export type MatchStatus = 'scheduled' | 'live' | 'completed';
export type GameweekStatus = 'upcoming' | 'active' | 'completed';
export type EventType = 'goal' | 'assist' | 'yellow' | 'red' | 'cleansheet';
