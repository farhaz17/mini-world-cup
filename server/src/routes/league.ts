import { Router } from 'express';
import { getLeague, getTopLeague } from '../controllers/leagueController';

const router = Router();
router.get('/', getLeague);
router.get('/top', getTopLeague);
export default router;
