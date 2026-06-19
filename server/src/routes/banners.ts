import { Router } from 'express';
import { getBanners } from '../controllers/bannersController';

const router = Router();
router.get('/', getBanners);
export default router;
