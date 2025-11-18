import {
  getAllStockMovements,
  getStockMovementsByProductType,
  getStockMovementsByProductId,
  createStockMovement,
  updateStockMovement,
  deleteStockMovement,
  getProductBalance,
  updateProductBalance,
} from "../repository/stock.repository.js";

// جلب جميع حركات المخزون
export async function fetchAllStockMovements() {
  return await getAllStockMovements();
}

// جلب حركات حسب نوع المنتج
export async function getMovementsByType(productType) {
  const validTypes = ["silk_strip", "iron", "wire"];
  if (!validTypes.includes(productType)) {
    const err = {
      message: "Invalid product type",
      type: "ValidationError",
    };
    throw err;
  }
  return await getStockMovementsByProductType(productType);
}

// جلب حركات حسب معرف المنتج
export async function getMovementsByProduct(productId) {
  return await getStockMovementsByProductId(productId);
}

// إضافة حركة مخزون (وارد)
export async function addIncomingMovement(data) {
  // التحقق من البيانات
  if (
    !data.productType ||
    !data.productId ||
    !data.quantity ||
    !data.purchasePrice
  ) {
    const err = {
      message:
        "Missing required fields: productType, productId, quantity, purchasePrice",
      type: "ValidationError",
    };
    throw err;
  }

  // الحصول على الرصيد الحالي
  const currentBalance = await getProductBalance(
    data.productType,
    data.productId
  );
  if (!currentBalance) {
    const err = {
      message: "Product not found",
      type: "NotFoundError",
    };
    throw err;
  }

  // حساب الرصيد الجديد
  const newQuantity = currentBalance.totalQuantity + data.quantity;
  const costOfNewStock = data.quantity * data.purchasePrice;
  const newBalance = currentBalance.balance + costOfNewStock; // New balance = old balance + cost of new stock

  // إنشاء حركة المخزون
  const movement = await createStockMovement({
    productType: data.productType,
    productId: data.productId,
    quantity: data.quantity,
    movementType: "in",
    purchasePrice: data.purchasePrice,
    notes: data.notes,
  });

  // تحديث رصيد المنتج
  await updateProductBalance(
    data.productType,
    data.productId,
    newQuantity,
    newBalance
  );

  return movement;
}

// حذف حركة مخزون (إرجاع)
export async function removeOutgoingMovement(id) {
  const movement = await getStockMovementsByProductId(id);
  if (!movement || movement.length === 0) {
    const err = {
      message: "Movement not found",
      type: "NotFoundError",
    };
    throw err;
  }

  return await deleteStockMovement(id);
}
