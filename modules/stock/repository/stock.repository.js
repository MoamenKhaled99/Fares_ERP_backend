import { getPrisma } from "../../../config/prismaClient.js";

const prisma = getPrisma();

// جلب جميع حركات المخزون
export async function getAllStockMovements(filters = {}) {
  const whereClause = {};
  
  if (filters.from_date || filters.to_date) {
    whereClause.movementDate = {};
    if (filters.from_date) {
      whereClause.movementDate.gte = new Date(filters.from_date);
    }
    if (filters.to_date) {
      whereClause.movementDate.lte = new Date(filters.to_date);
    }
  }
  
  return await prisma.StockMovement.findMany({
    where: whereClause,
    orderBy: { movementDate: "desc" },
  });
}

// جلب حركات مخزون حسب نوع المنتج
export async function getStockMovementsByProductType(productType) {
  return await prisma.StockMovement.findMany({
    where: { productType },
    orderBy: { movementDate: "desc" },
  });
}

// جلب حركات مخزون حسب معرف المنتج
export async function getStockMovementsByProductId(productId) {
  return await prisma.StockMovement.findMany({
    where: { productId },
    orderBy: { movementDate: "desc" },
  });
}

// إنشاء حركة مخزون جديدة
export async function createStockMovement(data) {
  return await prisma.StockMovement.create({ data });
}

// تحديث حركة مخزون
export async function updateStockMovement(id, data) {
  return await prisma.StockMovement.update({
    where: { id: parseInt(id) },
    data,
  });
}

// حذف حركة مخزون
export async function deleteStockMovement(id) {
  return await prisma.StockMovement.delete({
    where: { id: parseInt(id) },
  });
}

// جلب رصيد المنتج الحالي
export async function getProductBalance(productType, productId) {
  if (productType === "silk_strip") {
    return await prisma.SilkStrip.findUnique({
      where: { id: productId },
      select: { totalQuantity: true, balance: true, unitPrice: true }, // ✅ Added unitPrice
    });
  } else if (productType === "iron") {
    return await prisma.Iron.findUnique({
      where: { id: productId },
      select: { totalQuantity: true, balance: true, unitPrice: true }, // ✅ Added unitPrice
    });
  } else if (productType === "wire") {
    return await prisma.Wire.findUnique({
      where: { id: productId },
      select: { totalQuantity: true, balance: true, unitPrice: true }, // ✅ Added unitPrice
    });
  }
  return null;
}

// تحديث رصيد المنتج بعد عملية مخزون
export async function updateProductBalance(
  productType,
  productId,
  totalQuantity,
  balance
) {
  const updateData = { totalQuantity, balance };

  if (productType === "silk_strip") {
    return await prisma.SilkStrip.update({
      where: { id: productId },
      data: updateData, // ✅ ONLY UPDATES quantity/balance
    });
  } else if (productType === "iron") {
    return await prisma.Iron.update({
      where: { id: productId },
      data: updateData, // ✅ ONLY UPDATES quantity/balance
    });
  } else if (productType === "wire") {
    return await prisma.Wire.update({
      where: { id: productId },
      data: updateData, // ✅ ONLY UPDATES quantity/balance
    });
  }
  return null;
}
