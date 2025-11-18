import { getPrisma } from "../../../config/prismaClient.js";

const prisma = getPrisma();

// جلب جميع الفواتير
export async function getAllInvoices() {
  return await prisma.Invoice.findMany({
    include: {
      details: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

// جلب فاتورة بواسطة ID
export async function getInvoiceById(id) {
  return await prisma.Invoice.findUnique({
    where: { id: parseInt(id) },
    include: {
      details: true,
    },
  });
}

// إنشاء فاتورة جديدة
export async function createInvoice(data) {
  return await prisma.Invoice.create({
    data: {
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
