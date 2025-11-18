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

  const processedDetails = [];
  let totalProfit = 0;

  for (const detail of data.details) {
    const { productType, productId, quantity, sellingPrice } = detail;
    
    // 1. Fetch current product data for stock, balance, and unitPrice
    // NOTE: getProductBalance in stock.repository.js must be updated to fetch unitPrice
    const product = await getProductBalance(productType, productId); 
    
    if (!product) {
      const err = {
        message: `Product not found: ${productType} ID ${productId}`,
        type: "NotFoundError",
      };
      throw err;
    }

    // ✅ STOCK CHECK: Do not proceed if requested quantity > current stock
    if (quantity > product.totalQuantity) {
      const err = {
message: `المخزون غير كافٍ للمنتج برقم ${productId} (${productType}). المتوفر: ${product.totalQuantity}، المطلوب: ${quantity}`, // 👈 Arabic Message        type: "BusinessLogicError", // Throws a 409 Conflict error
      };
      throw err;
    }
    
    // 2. Determine purchasePrice: use price from payload, or product's current unitPrice
    const purchasePrice = detail.purchasePrice || product.unitPrice; 

    // 3. Calculate profit
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

  // 4. Create invoice and process stock movements
  const invoice = await createInvoice({
    totalProfit,
    notes: data.notes,
    details: processedDetails,
  });

  // لكل عنصر في الفاتورة: تقليل الكمية من المنتج وإنشاء حركة مخزون
  for (const detail of processedDetails) {
    const { productType, productId, quantity, purchasePrice } = detail;

    // Fetch current state again in case of concurrent access
    const currentBalance = await getProductBalance(productType, productId);
    if (currentBalance) {
      // حساب الكمية والرصيد الجديدة
      const newQuantity = Math.max(0, currentBalance.totalQuantity - quantity);
      
      // Calculate new balance: remaining quantity * original purchase price (simplistic cost valuation)
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