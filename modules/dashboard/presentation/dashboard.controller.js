import { DashboardService } from '../service/dashboard.service.js';
import { asyncHandler } from '../../../shared/filters/global_error.filter.js';
import { successResponse } from '../../../shared/utils/calculation.utils.js';

export class DashboardController {
  constructor() {
    this.service = new DashboardService();
  }

  /**
   * GET /api/dashboard
   * إحصائيات Dashboard الشاملة
   */
  getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await this.service.getDashboardStats();
    res.json(successResponse(stats, 'تم جلب إحصائيات Dashboard بنجاح'));
  });

  /**
   * GET /api/dashboard/profits
   * إحصائيات الأرباح حسب الفترة الزمنية
   */
  getProfitsByPeriod = asyncHandler(async (req, res) => {
    const { من_تاريخ, إلى_تاريخ } = req.query;
    const stats = await this.service.getProfitsByPeriod(من_تاريخ, إلى_تاريخ);
    res.json(successResponse(stats, 'تم جلب إحصائيات الأرباح بنجاح'));
  });

  /**
   * GET /api/dashboard/sales-by-type
   * إحصائيات المبيعات حسب نوع المنتج
   */
  getSalesByProductType = asyncHandler(async (req, res) => {
    const stats = await this.service.getSalesByProductType();
    res.json(successResponse(stats, 'تم جلب إحصائيات المبيعات حسب النوع بنجاح'));
  });
}
