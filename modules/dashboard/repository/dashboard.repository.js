import { getPrisma } from "../../../config/prismaClient.js";

const prisma = getPrisma();

/**
 * إحصائيات Dashboard الشاملة مع الفلاتر
 */
export async function getDashboardStats(filters = {}) {
  const { day, month, year } = filters;
  
  // بناء where clause للفلترة حسب التاريخ
  const invoiceWhere = {};
  if (day && month && year) {
    // Filter by specific day
    const startDate = new Date(year, month - 1, day, 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 59);
    invoiceWhere.invoiceDate = {
      gte: startDate,
      lte: endDate,
    };
  } else if (month && year) {
    // Filter by month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    invoiceWhere.invoiceDate = {
      gte: startDate,
      lte: endDate,
    };
  } else if (year) {
    // Filter by year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);
    invoiceWhere.invoiceDate = {
      gte: startDate,
      lte: endDate,
    };
  }

  // إجمالي الأرباح (مع الفلتر)
  const totalProfitResult = await prisma.invoice.aggregate({
    where: invoiceWhere,
    _sum: { totalProfit: true },
  });

  // إجمالي المبيعات (sellingPrice * quantity) والتكاليف (purchasePrice * quantity)
  // لكن نستثني الفواتير من نوع non-stock من المبيعات والتكاليف
  const invoiceDetails = await prisma.invoiceDetail.findMany({
    where: {
      invoice: invoiceWhere,
    },
    include: {
      invoice: {
        select: { invoiceType: true },
      },
    },
  });

  let totalSales = 0;
  let totalCost = 0;
  
  invoiceDetails.forEach((detail) => {
    // Only count sales and cost for regular invoices
    if (!detail.invoice.invoiceType || detail.invoice.invoiceType === 'regular') {
      totalSales += detail.sellingPrice * detail.quantity;
      totalCost += detail.purchasePrice * detail.quantity;
    }
    // Non-stock invoices: profit is already counted in totalProfit aggregate
  });

  // عدد الفواتير (مع الفلتر)
  const invoiceCount = await prisma.invoice.count({
    where: invoiceWhere,
  });

  // إحصائيات المخزون (بدون فلتر - دائماً الحالة الحالية)
  const [silkStrips, irons, wires] = await Promise.all([
    prisma.silkStrip.findMany(),
    prisma.iron.findMany(),
    prisma.wire.findMany(),
  ]);

  // حساب إجمالي قيمة المخزون (الرصيد)
  const silkStripsBalance = silkStrips.reduce((sum, item) => sum + item.balance, 0);
  const ironsBalance = irons.reduce((sum, item) => sum + item.balance, 0);
  const wiresBalance = wires.reduce((sum, item) => sum + item.balance, 0);
  const totalStockValue = silkStripsBalance + ironsBalance + wiresBalance;

  // منتجات منخفضة المخزون (أقل من 10 في الكمية totalQuantity)
  const lowStockItems = [
    ...silkStrips.filter((item) => item.totalQuantity <= 10).map((item) => ({
      type: 'silk_strip',
      id: item.id,
      name: item.displayName || `${item.loadCapacity}x${item.unitMeter}x${item.safetyFactor}`,
      quantity: item.totalQuantity,
    })),
    ...irons.filter((item) => item.totalQuantity <= 10).map((item) => ({
      type: 'iron',
      id: item.id,
      name: item.description || 'حدايد',
      quantity: item.totalQuantity,
    })),
    ...wires.filter((item) => item.totalQuantity <= 10).map((item) => ({
      type: 'wire',
      id: item.id,
      name: item.description || 'واير',
      quantity: item.totalQuantity,
    })),
  ];

  // آخر 10 فواتير (مع الفلتر)
  const recentInvoices = await prisma.invoice.findMany({
    where: invoiceWhere,
    include: {
      details: true,
    },
    orderBy: { invoiceDate: 'desc' },
    take: 10,
  });

  // آخر 10 حركات مخزون
  const recentMovements = await prisma.stockMovement.findMany({
    orderBy: { movementDate: 'desc' },
    take: 10,
  });

  return {
    // Financial Metrics
    totalProfit: totalProfitResult._sum.totalProfit || 0,
    totalSales: totalSales,
    totalCost: totalCost,
    totalStockValue: totalStockValue,
    
    // Invoice Stats
    invoiceCount: invoiceCount,
    
    // Inventory Stats
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
    
    // Additional Data
    lowStockItems: lowStockItems,
    recentInvoices: recentInvoices,
    recentMovements: recentMovements,
    
    // Applied Filters
    appliedFilters: filters,
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