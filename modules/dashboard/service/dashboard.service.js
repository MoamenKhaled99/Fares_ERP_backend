import { 
  getDashboardStats as getDashboardStatsRepo, 
  getProfitsByPeriod as getProfitsByPeriodRepo, 
  getSalesByProductType as getSalesByProductTypeRepo 
} from '../repository/dashboard.repository.js';

/**
 * Service to get dashboard statistics
 * @param {Object} filters - Filter object { day, month, year }
 */
export async function getDashboardStats(filters = {}) {
  return await getDashboardStatsRepo(filters);
}

/**
 * Service to get profits by period
 */
export async function getProfitsByPeriod(fromDate, toDate) {
  return await getProfitsByPeriodRepo(fromDate, toDate);
}

/**
 * Service to get sales by product type
 */
export async function getSalesByProductType() {
  return await getSalesByProductTypeRepo();
}