import { Router } from 'express';
import { 
  getDashboardStatsController, 
  getProfitsByPeriodController, 
  getSalesByProductTypeController 
} from './dashboard.controller.js';

const router = Router();

// Define routes mapping to controller functions
router.get('/', getDashboardStatsController);
router.get('/profits', getProfitsByPeriodController);
router.get('/sales-by-type', getSalesByProductTypeController);

export default router;