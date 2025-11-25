import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  calculateTotalProfits,
} from "../repository/invoices.repository.js";
import {
  createStockMovement,
  getProductBalance,
  updateProductBalance,
} from "../../stock/repository/stock.repository.js";
import { getPrisma } from "../../../config/prismaClient.js";

const prisma = getPrisma();

// جلب جميع الفواتير
export async function fetchAllInvoices(filters = {}) {
  return await getAllInvoices(filters);
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
  const invoiceType = data.invoiceType || "regular";
  const isNonStock = invoiceType === "non-stock";

  for (const detail of data.details) {
    const { productType, productId, productName, quantity, sellingPrice } = detail;
    let purchasePrice = detail.purchasePrice;

    // For non-stock invoices, skip product lookup and stock management
    if (isNonStock) {
      if (!purchasePrice) {
        const err = {
          message: "purchasePrice is required for non-stock invoice items",
          type: "ValidationError",
        };
        throw err;
      }

      const profit = (sellingPrice - purchasePrice) * quantity;
      totalProfit += profit;

      processedDetails.push({
        productType,
        productId: null,
        productName,
        quantity,
        purchasePrice,
        sellingPrice,
        profit,
      });
      continue;
    }

    // Regular invoice: fetch product and check stock
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
        message: `المخزون غير كافٍ للمنتج برقم ${productId} (${productType}). المتوفر: ${product.totalQuantity}، المطلوب: ${quantity}`,
        type: "BusinessLogicError",
      };
      throw err;
    }

    // Determine purchasePrice: use price from payload, or product's current unitPrice
    purchasePrice = purchasePrice || product.unitPrice;

    // Calculate profit
    const profit = (sellingPrice - purchasePrice) * quantity;
    totalProfit += profit;

    processedDetails.push({
      productType,
      productId,
      productName: product.displayName || product.description || null,
      quantity,
      purchasePrice,
      sellingPrice,
      profit,
    });
  }

  // Set invoiceDate: use provided date or default to now
  const invoiceDate = data.invoiceDate ? new Date(data.invoiceDate) : new Date();

  // Create invoice
  const invoice = await createInvoice({
    invoiceDate,
    invoiceType,
    totalProfit,
    notes: data.notes,
    details: processedDetails,
  });

  // For regular invoices, process stock movements
  if (!isNonStock) {
    for (const detail of processedDetails) {
      const { productType, productId, quantity, purchasePrice } = detail;

      if (productId) {
        // Fetch current state again in case of concurrent access
        const currentBalance = await getProductBalance(productType, productId);
        if (currentBalance) {
          // حساب الكمية والرصيد الجديدة
          const newQuantity = Math.max(0, currentBalance.totalQuantity - quantity);

          // Calculate new balance: remaining quantity * original purchase price
          const newBalance = newQuantity * purchasePrice;

          // تحديث رصيد المنتج
          await updateProductBalance(
            productType,
            productId,
            newQuantity,
            newBalance
          );

          // إنشاء حركة مخزون (خروج)
          await createStockMovement({
            productType,
            productId,
            productName: detail.productName,
            quantity,
            movementType: "out",
            purchasePrice,
            notes: `Invoice #${invoice.id} - Outgoing movement`,
          });
        }
      }
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
