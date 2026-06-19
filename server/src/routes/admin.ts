import { Router } from 'express';
import {
  createPlayer, updatePlayer, createMatch, updateMatch, addMatchEvent,
  advanceGameweek, createBanner, seedDatabase,
} from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/auth';

const router = Router();
router.use(authenticate, requireAdmin);
router.post('/players', createPlayer);
router.put('/players/:id', updatePlayer);
router.post('/matches', createMatch);
router.put('/matches/:id', updateMatch);
router.put('/matches/:id/event', addMatchEvent);
router.post('/advance-gameweek', advanceGameweek);
router.post('/banners', createBanner);
router.post('/seed', seedDatabase);
export default router;
