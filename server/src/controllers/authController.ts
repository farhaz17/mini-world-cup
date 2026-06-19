import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Squad from '../models/Squad';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../types';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  teamName: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function signToken(userId: string, role: string): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as string;
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, {
    expiresIn: expiresIn as import('jsonwebtoken').SignOptions['expiresIn'],
  });
}

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = registerSchema.parse(req.body);
    const existing = await User.findOne({ email: body.email });
    if (existing) throw new AppError('Email already registered', 409);

    const user = await User.create(body);

    // Auto-create empty squad
    await Squad.create({ userId: user._id });

    const token = signToken(user._id.toString(), user.role);
    res.status(201).json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = loginSchema.parse(req.body);
    const user = await User.findOne({ email: body.email }).select('+password');
    if (!user || !(await user.comparePassword(body.password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signToken(user._id.toString(), user.role);
    res.json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) throw new AppError('User not found', 404);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
