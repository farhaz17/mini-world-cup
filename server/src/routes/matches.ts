import { Router } from 'express';
import { getAllMatches, getLiveMatches } from '../controllers/matchesController';

const router = Router();
router.get('/', getAllMatches);
router.get('/live', getLiveMatches);
export default router;
