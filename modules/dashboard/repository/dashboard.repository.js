import { getPrisma } from "../../../config/prismaClient.js";

const prisma = getPrisma();

/**
 * إحصائيات Dashboard الشاملة
 */
export async function getDashboardStats() {
  // إجمالي الأرباح
  const totalProfitResult = await prisma.Invoice.aggregate({
    _sum: { totalProfit: true },
  });

  // عدد الفواتير
  const invoiceCount = await prisma.Invoice.count();

  // إحصائيات المخزون
  const [silkStrips, irons, wires] = await Promise.all([
    prisma.SilkStrip.findMany(),
    prisma.Iron.findMany(),
    prisma.Wire.findMany(),
  ]);

  // حساب إجمالي الرصيد (القيمة المالية) لكل نوع
  const silkStripsBalance = silkStrips.reduce((sum, item) => sum + item.balance, 0);
  const ironsBalance = irons.reduce((sum, item) => sum + item.balance, 0);
  const wiresBalance = wires.reduce((sum, item) => sum + item.balance, 0);

  // منتجات منخفضة المخزون (أقل من 10 في الكمية totalQuantity)
  const lowStockItems = [
    ...silkStrips.filter((item) => item.totalQuantity <= 10).map((item) => ({
      type: 'silk_strip',
      id: item.id,
      name: item.name || 'شريط حريري',
      quantity: item.totalQuantity,
    })),
    ...irons.filter((item) => item.totalQuantity <= 10).map((item) => ({
      type: 'iron',
      id: item.id,
      name: item.description || item.name || 'حديد',
      quantity: item.totalQuantity,
    })),
    ...wires.filter((item) => item.totalQuantity <= 10).map((item) => ({
      type: 'wire',
      id: item.id,
      name: item.description || item.name || 'واير',
      quantity: item.totalQuantity,
    })),
  ];

  // آخر 10 فواتير
  const recentInvoices = await prisma.Invoice.findMany({
    include: {
      details: true,
    },
    orderBy: { invoiceDate: 'desc' },
    take: 10,
  });

  // آخر 10 حركات مخزون
  const recentMovements = await prisma.StockMovement.findMany({
    orderBy: { movementDate: 'desc' },
    take: 10,
  });

  return {
    totalProfit: totalProfitResult._sum.totalProfit || 0,
    invoiceCount: invoiceCount,
    inventory: {
      silk_strips: {
        count: silkStrips.length,
        totalBalance: silkStripsBalance,
      },
      irons: {
        count: irons.length,
        totalBalance: ironsBalance,
      },
      wires: {
        count: wires.length,
        totalBalance: wiresBalance,
      },
    },
    totalInventoryBalance: silkStripsBalance + ironsBalance + wiresBalance,
    lowStockItems: lowStockItems,
    recentInvoices: recentInvoices,
    recentMovements: recentMovements,
  };
}

/**
 * إحصائيات الأرباح حسب الفترة الزمنية
 */
export async function getProfitsByPeriod(fromDate, toDate) {
  const where = {};

  if (fromDate && toDate) {
    where.invoiceDate = {
      gte: new Date(fromDate),
      lte: new Date(toDate),
    };
  }

  const [totalProfitResult, invoices] = await Promise.all([
    prisma.Invoice.aggregate({
      where,
      _sum: { totalProfit: true },
    }),

    prisma.Invoice.findMany({
      where,
      include: {
        details: true,
      },
      orderBy: { invoiceDate: 'desc' },
    }),
  ]);

  return {
    period: {
      from: fromDate,
      to: toDate,
    },
    totalProfit: totalProfitResult._sum.totalProfit || 0,
    invoiceCount: invoices.length,
    invoices: invoices,
  };
}

/**
 * إحصائيات المبيعات حسب نوع المنتج
 */
export async function getSalesByProductType() {
  const details = await prisma.InvoiceDetail.findMany();

  const stats = {
    silk_strip: { quantity: 0, profit: 0, transactions: 0 },
    iron: { quantity: 0, profit: 0, transactions: 0 },
    wire: { quantity: 0, profit: 0, transactions: 0 },
  };

  details.forEach((detail) => {
    // تأكد من أن productType موجود في stats (لتجنب الأخطاء في حالة وجود أنواع قديمة)
    if (stats[detail.productType]) {
      stats[detail.productType].quantity += detail.quantity;
      stats[detail.productType].profit += detail.profit;
      stats[detail.productType].transactions += 1;
    }
  });

  return stats;
}