import prisma from '../../../config/prismaClient.js';

export class DashboardRepository {
  /**
   * إحصائيات Dashboard الشاملة
   */
  async getDashboardStats() {
    // إجمالي الأرباح
    const totalProfitResult = await prisma.فاتورة.aggregate({
      _sum: { إجمالي_الربح: true },
    });

    // عدد الفواتير
    const invoiceCount = await prisma.فاتورة.count();

    // إحصائيات المخزون
    const [silkStrips, irons, wires] = await Promise.all([
      prisma.شرائط_حريرية.findMany(),
      prisma.حديد.findMany(),
      prisma.ويرات.findMany(),
    ]);

    // حساب إجمالي الرصيد لكل نوع
    const إجمالي_رصيد_شرائط = silkStrips.reduce((sum, item) => sum + item.رصيد, 0);
    const إجمالي_رصيد_حديد = irons.reduce((sum, item) => sum + item.رصيد, 0);
    const إجمالي_رصيد_ويرات = wires.reduce((sum, item) => sum + item.رصيد, 0);

    // منتجات منخفضة المخزون (أقل من 10)
    const lowStockItems = [
      ...silkStrips.filter((item) => item.رصيد <= 10).map((item) => ({
        النوع: 'شرائط_حريرية',
        المعرف: item.id,
        الرصيد: item.رصيد,
      })),
      ...irons.filter((item) => item.رصيد <= 10).map((item) => ({
        النوع: 'حديد',
        المعرف: item.id,
        الوصف: item.وصف,
        الرصيد: item.رصيد,
      })),
      ...wires.filter((item) => item.رصيد <= 10).map((item) => ({
        النوع: 'ويرات',
        المعرف: item.id,
        الوصف: item.وصف,
        الرصيد: item.رصيد,
      })),
    ];

    // آخر 10 فواتير
    const recentInvoices = await prisma.فاتورة.findMany({
      include: {
        تفاصيل: true,
      },
      orderBy: { التاريخ: 'desc' },
      take: 10,
    });

    // آخر 10 حركات مخزون
    const recentMovements = await prisma.حركة_مخزون.findMany({
      orderBy: { التاريخ: 'desc' },
      take: 10,
    });

    return {
      إجمالي_الأرباح: totalProfitResult._sum.إجمالي_الربح || 0,
      عدد_الفواتير: invoiceCount,
      المخزون: {
        شرائط_حريرية: {
          العدد: silkStrips.length,
          إجمالي_الرصيد: إجمالي_رصيد_شرائط,
        },
        حديد: {
          العدد: irons.length,
          إجمالي_الرصيد: إجمالي_رصيد_حديد,
        },
        ويرات: {
          العدد: wires.length,
          إجمالي_الرصيد: إجمالي_رصيد_ويرات,
        },
      },
      إجمالي_الرصيد: إجمالي_رصيد_شرائط + إجمالي_رصيد_حديد + إجمالي_رصيد_ويرات,
      منتجات_منخفضة_المخزون: lowStockItems,
      آخر_الفواتير: recentInvoices,
      آخر_حركات_المخزون: recentMovements,
    };
  }

  /**
   * إحصائيات الأرباح حسب الفترة الزمنية
   */
  async getProfitsByPeriod(من_تاريخ, إلى_تاريخ) {
    const where = {};

    if (من_تاريخ && إلى_تاريخ) {
      where.التاريخ = {
        gte: new Date(من_تاريخ),
        lte: new Date(إلى_تاريخ),
      };
    }

    const [totalProfitResult, invoices] = await Promise.all([
      prisma.فاتورة.aggregate({
        where,
        _sum: { إجمالي_الربح: true },
      }),

      prisma.فاتورة.findMany({
        where,
        include: {
          تفاصيل: true,
        },
        orderBy: { التاريخ: 'desc' },
      }),
    ]);

    return {
      الفترة: {
        من: من_تاريخ,
        إلى: إلى_تاريخ,
      },
      إجمالي_الأرباح: totalProfitResult._sum.إجمالي_الربح || 0,
      عدد_الفواتير: invoices.length,
      الفواتير: invoices,
    };
  }

  /**
   * إحصائيات المبيعات حسب نوع المنتج
   */
  async getSalesByProductType() {
    const details = await prisma.تفاصيل_فاتورة.findMany();

    const stats = {
      شرائط_حريرية: { الكمية: 0, الأرباح: 0, عدد_العمليات: 0 },
      حديد: { الكمية: 0, الأرباح: 0, عدد_العمليات: 0 },
      ويرات: { الكمية: 0, الأرباح: 0, عدد_العمليات: 0 },
    };

    details.forEach((detail) => {
      if (stats[detail.النوع]) {
        stats[detail.النوع].الكمية += detail.الكمية;
        stats[detail.النوع].الأرباح += detail.الربح;
        stats[detail.النوع].عدد_العمليات += 1;
      }
    });

    return stats;
  }
}
