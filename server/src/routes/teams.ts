import { Router } from 'express';
import { getAllTeams, getTeamById } from '../controllers/teamsController';

const router = Router();
router.get('/', getAllTeams);
router.get('/:id', getTeamById);
export default router;
