import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  calculateTotalProfits,
} from "../repository/invoices.repository.js";
import { createStockMovement, getProductBalance, updateProductBalance } from "../../stock/repository/stock.repository.js";
import { getPrisma } from "../../../config/prismaClient.js";

const prisma = getPrisma();

// جلب جميع الفواتير
export async function fetchAllInvoices() {
  return await getAllInvoices();
}

// جلب فاتورة بواسطة ID
export async function getInvoiceByIdService(id) {
  const invoice = await getInvoiceById(id);
  if (!invoice) {
    const err = {
      message: "Invoice not found",
      type: "NotFoundError",
    };
    throw err;
  }
  return invoice;
}

// إنشاء فاتورة جديدة
export async function createInvoiceService(data) {
  // التحقق من البيانات
  if (!data.details || data.details.length === 0) {
    const err = {
      message: "Invoice details are required",
      type: "ValidationError",
    };
    throw err;
  }

  // معالجة التفاصيل: جلب purchasePrice من المنتج إذا لم تكن موجودة
  const processedDetails = [];
  let totalProfit = 0;

  for (const detail of data.details) {
    const { productType, productId, quantity, sellingPrice } = detail;
    
    // جلب purchasePrice من المنتج
    let purchasePrice = detail.purchasePrice;
    if (!purchasePrice) {
      const product = await getProductBalance(productType, productId);
      if (!product) {
        const err = {
          message: `Product not found: ${productType} ID ${productId}`,
          type: "NotFoundError",
        };
        throw err;
      }
      // الحصول على unitPrice من المنتج
      let unitPrice = 0;
      if (productType === 'silk_strip') {
        const silkStrip = await prisma.SilkStrip.findUnique({ where: { id: productId } });
        unitPrice = silkStrip?.unitPrice || 0;
      } else if (productType === 'iron') {
        const iron = await prisma.Iron.findUnique({ where: { id: productId } });
        unitPrice = iron?.unitPrice || 0;
      } else if (productType === 'wire') {
        const wire = await prisma.Wire.findUnique({ where: { id: productId } });
        unitPrice = wire?.unitPrice || 0;
      }
      purchasePrice = unitPrice;
    }

    // حساب الربح
    const profit = (sellingPrice - purchasePrice) * quantity;
    totalProfit += profit;

    processedDetails.push({
      productType,
      productId,
      quantity,
      purchasePrice,
      sellingPrice,
      profit,
    });
  }

  // إنشاء الفاتورة مع التفاصيل
  // Pass details as an array to match repository.createInvoice expectations
  const invoice = await createInvoice({
    totalProfit,
    notes: data.notes,
    details: processedDetails,
  });

  // لكل عنصر في الفاتورة: تقليل الكمية من المنتج وإنشاء حركة مخزون
  for (const detail of processedDetails) {
    const { productType, productId, quantity, purchasePrice } = detail;

    // الحصول على رصيد المنتج الحالي
    const currentBalance = await getProductBalance(productType, productId);
    if (currentBalance) {
      // حساب الكمية والرصيد الجديدة
      const newQuantity = Math.max(0, currentBalance.totalQuantity - quantity);
      const newBalance = newQuantity * purchasePrice;

      // تحديث رصيد المنتج
      await updateProductBalance(productType, productId, newQuantity, newBalance);

      // إنشاء حركة مخزون (خروج)
      await createStockMovement({
        productType,
        productId,
        quantity,
        movementType: 'out',
        purchasePrice,
        notes: `Invoice #${invoice.id} - Outgoing movement`,
      });
    }
  }

  return invoice;
}

// تحديث فاتورة
export async function updateInvoiceService(id, data) {
  const invoice = await getInvoiceById(id);
  if (!invoice) {
    const err = {
      message: "Invoice not found",
      type: "NotFoundError",
    };
    throw err;
  }

  return await updateInvoice(id, data);
}

// حذف فاتورة
export async function deleteInvoiceService(id) {
  const invoice = await getInvoiceById(id);
  if (!invoice) {
    const err = {
      message: "Invoice not found",
      type: "NotFoundError",
    };
    throw err;
  }

  return await deleteInvoice(id);
}

// جلب إجمالي الأرباح
export async function getTotalProfitsService() {
  return await calculateTotalProfits();
}
