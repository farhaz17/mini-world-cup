import { Router } from 'express';
import { getSquad, pickPlayer, removePlayer, transferPlayer } from '../controllers/squadController';
import { authenticate } from '../middleware/auth';
import { checkDeadline } from '../middleware/gameweekDeadline';

const router = Router();
router.use(authenticate);
router.get('/', getSquad);
router.post('/pick', checkDeadline, pickPlayer);
router.delete('/remove/:playerId', checkDeadline, removePlayer);
router.post('/transfer', checkDeadline, transferPlayer);
export default router;
