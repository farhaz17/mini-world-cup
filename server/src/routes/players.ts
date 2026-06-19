import { Router } from 'express';
import { getAllPlayers, getTopPlayers, getPlayerById } from '../controllers/playersController';

const router = Router();
router.get('/', getAllPlayers);
router.get('/top', getTopPlayers);
router.get('/:id', getPlayerById);
export default router;
