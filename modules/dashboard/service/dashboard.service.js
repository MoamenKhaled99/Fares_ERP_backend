import { DashboardRepository } from '../repository/dashboard.repository.js';

export class DashboardService {
  constructor() {
    this.repository = new DashboardRepository();
  }

  /**
   * إحصائيات Dashboard الشاملة
   */
  async getDashboardStats() {
    return await this.repository.getDashboardStats();
  }

  /**
   * إحصائيات الأرباح حسب الفترة الزمنية
   */
  async getProfitsByPeriod(من_تاريخ, إلى_تاريخ) {
    return await this.repository.getProfitsByPeriod(من_تاريخ, إلى_تاريخ);
  }

  /**
   * إحصائيات المبيعات حسب نوع المنتج
   */
  async getSalesByProductType() {
    return await this.repository.getSalesByProductType();
  }
}
