import { 
  getDashboardStats, 
  getProfitsByPeriod, 
  getSalesByProductType 
} from '../service/dashboard.service.js';
import { asyncHandler } from '../../../shared/filters/global_error.filter.js';
import { successResponse } from '../../../shared/utils/calculation.utils.js';

/**
 * GET /api/dashboard
 * Returns comprehensive dashboard statistics
 */
export const getDashboardStatsController = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();
  res.json(successResponse(stats, 'Dashboard statistics fetched successfully'));
});

/**
 * GET /api/dashboard/profits
 * Returns profits filtered by period
 */
export const getProfitsByPeriodController = asyncHandler(async (req, res) => {
  // Using English query parameters: from_date, to_date (or fallback to Arabic if frontend sends them)
  const fromDate = req.query.from_date || req.query.من_تاريخ;
  const toDate = req.query.to_date || req.query.إلى_تاريخ;
  
  const stats = await getProfitsByPeriod(fromDate, toDate);
  res.json(successResponse(stats, 'Profits statistics fetched successfully'));
});

/**
 * GET /api/dashboard/sales-by-type
 * Returns sales statistics grouped by product type
 */
export const getSalesByProductTypeController = asyncHandler(async (req, res) => {
  const stats = await getSalesByProductType();
  res.json(successResponse(stats, 'Sales by product type fetched successfully'));
});