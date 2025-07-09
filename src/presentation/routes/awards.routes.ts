import { Router } from 'express';
import { AwardController } from '../controllers/AwardController';

const router = Router();
router.get('/intervals', AwardController.getIntervals);
router.get('/', AwardController.getAll);
router.get('/:id', AwardController.getAwardById);
router.post('/', AwardController.insertAward);
router.put('/:id', AwardController.updateAward);
router.delete('/:id', AwardController.deleteAward);

export default router;
