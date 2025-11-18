import { 
  getDashboardStats as getDashboardStatsRepo, 
  getProfitsByPeriod as getProfitsByPeriodRepo, 
  getSalesByProductType as getSalesByProductTypeRepo 
} from '../repository/dashboard.repository.js';

/**
 * Service to get dashboard statistics
 */
export async function getDashboardStats() {
  return await getDashboardStatsRepo();
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