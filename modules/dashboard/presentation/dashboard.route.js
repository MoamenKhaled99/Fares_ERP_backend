import { Router } from 'express';
import { DashboardController } from './dashboard.controller.js';

const router = Router();
const controller = new DashboardController();

// Routes
router.get('/', controller.getDashboardStats);
router.get('/profits', controller.getProfitsByPeriod);
router.get('/sales-by-type', controller.getSalesByProductType);

export default router;
