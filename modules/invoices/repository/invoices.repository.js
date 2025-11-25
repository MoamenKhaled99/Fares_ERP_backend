import { getPrisma } from "../../../config/prismaClient.js";

const prisma = getPrisma();

// جلب جميع الفواتير
// جلب جميع الفواتير (with optional date filtering)
export async function getAllInvoices(filters = {}) {
  const whereClause = {};
  
  // Add date range filtering if provided
  if (filters.from_date || filters.to_date) {
    whereClause.invoiceDate = {};
    if (filters.from_date) {
      whereClause.invoiceDate.gte = new Date(filters.from_date);
    }
    if (filters.to_date) {
      whereClause.invoiceDate.lte = new Date(filters.to_date);
    }
  }
  
  const invoices = await prisma.Invoice.findMany({
    where: whereClause,
    include: {
      details: true,
    },
    orderBy: { invoiceDate: 'desc' },
  });

  return await enrichInvoicesWithProductNames(invoices);
}
// جلب فاتورة بواسطة ID
export async function getInvoiceById(id) {
  const invoice = await prisma.Invoice.findUnique({
    where: { id: parseInt(id) },
    include: {
      details: true,
    },
  });
  if (!invoice) return null;
  const [enriched] = await enrichInvoicesWithProductNames([invoice]);
  return enriched;
}

// إنشاء فاتورة جديدة
export async function createInvoice(data) {
  return await prisma.Invoice.create({
    data: {
      invoiceDate: data.invoiceDate || new Date(), // Always provide invoiceDate
      invoiceType: data.invoiceType || 'regular',
      totalProfit: data.totalProfit || 0,
      notes: data.notes,
      details: {
        create: data.details || [],
      },
    },
    include: {
      details: true,
    },
  });
}

// تحديث فاتورة
export async function updateInvoice(id, data) {
  return await prisma.Invoice.update({
    where: { id: parseInt(id) },
    data: {
      totalProfit: data.totalProfit,
      notes: data.notes,
    },
    include: {
      details: true,
    },
  });
}

// حذف فاتورة
export async function deleteInvoice(id) {
  return await prisma.Invoice.delete({
    where: { id: parseInt(id) },
  });
}

// حساب إجمالي الأرباح
export async function calculateTotalProfits() {
  const result = await prisma.Invoice.aggregate({
    _sum: {
      totalProfit: true,
    },
  });
  return result._sum.totalProfit || 0;
}

// Helper: enrich invoices' details with product names (displayName / description) when missing
async function enrichInvoicesWithProductNames(invoices) {
  // Collect needed product IDs per type only where productName is null/empty
  const silkIds = new Set();
  const ironIds = new Set();
  const wireIds = new Set();

  for (const inv of invoices) {
    for (const d of inv.details) {
      if (!d.productName || d.productName.trim() === '') {
        if (d.productId && d.productType === 'silk_strip') silkIds.add(d.productId);
        else if (d.productId && d.productType === 'iron') ironIds.add(d.productId);
        else if (d.productId && d.productType === 'wire') wireIds.add(d.productId);
      }
    }
  }

  // Fetch only required products
  const [silks, irons, wires] = await Promise.all([
    silkIds.size ? prisma.SilkStrip.findMany({ where: { id: { in: [...silkIds] } }, select: { id: true, displayName: true } }) : Promise.resolve([]),
    ironIds.size ? prisma.Iron.findMany({ where: { id: { in: [...ironIds] } }, select: { id: true, description: true } }) : Promise.resolve([]),
    wireIds.size ? prisma.Wire.findMany({ where: { id: { in: [...wireIds] } }, select: { id: true, description: true } }) : Promise.resolve([]),
  ]);

  const silkMap = new Map(silks.map(s => [s.id, s.displayName || `شريط حريري #${s.id}`]));
  const ironMap = new Map(irons.map(i => [i.id, i.description || `حدايد #${i.id}`]));
  const wireMap = new Map(wires.map(w => [w.id, w.description || `واير #${w.id}`]));

  for (const inv of invoices) {
    for (const d of inv.details) {
      if (!d.productName || d.productName.trim() === '') {
        if (d.productType === 'silk_strip' && silkMap.has(d.productId)) d.productName = silkMap.get(d.productId);
        else if (d.productType === 'iron' && ironMap.has(d.productId)) d.productName = ironMap.get(d.productId);
        else if (d.productType === 'wire' && wireMap.has(d.productId)) d.productName = wireMap.get(d.productId);
      }
    }
  }
  return invoices;
}

