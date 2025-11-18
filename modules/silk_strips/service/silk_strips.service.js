import { getAllSilkStrips, getSilkStripById, createSilkStrip, updateSilkStrip, deleteSilkStrip } from "../repository/silk_strips.repository.js";
import { createStockMovement } from "../../stock/repository/stock.repository.js";

async function addSilkStrips(silkStripsData) {
  // حساب الرصيد تلقائياً: الكمية × السعر
  const balance = silkStripsData.totalQuantity * silkStripsData.unitPrice;
  
  const dataWithBalance = {
    ...silkStripsData,
    balance,
  };

  // إنشاء المنتج
  const createdSilkStrip = await createSilkStrip(dataWithBalance);

  // إنشاء حركة مخزون تلقائية (خروج/استخدام)
  await createStockMovement({
    productType: 'silk_strip',
    productId: createdSilkStrip.id,
    quantity: createdSilkStrip.totalQuantity,
    movementType: 'in',
    purchasePrice: createdSilkStrip.unitPrice,
    notes: `Auto-generated movement for new silk strip product ID: ${createdSilkStrip.id}`,
  });

  return createdSilkStrip;
}

async function fetchAllSilkStrips() {
  return await getAllSilkStrips();
}

async function getSilkStripByIdService(id) {
  const silkStrip = await getSilkStripById(id);
  if (!silkStrip) {
    const err = {
      message: "Silk strip not found",
      type: "NotFoundError",
    };
    throw err;
  }
  return silkStrip;
}

async function updateSilkStripService(id, data) {
  // التحقق من الوجود
  const silkStrip = await getSilkStripById(id);
  if (!silkStrip) {
    const err = {
      message: "Silk strip not found",
      type: "NotFoundError",
    };
    throw err;
  }

  // إذا تم تحديث الكمية أو السعر، أعد حساب balance
  let updateData = { ...data };
  if (data.totalQuantity !== undefined || data.unitPrice !== undefined) {
    const qty = data.totalQuantity ?? silkStrip.totalQuantity;
    const price = data.unitPrice ?? silkStrip.unitPrice;
    updateData.balance = qty * price;
  }

  return await updateSilkStrip(id, updateData);
}

async function deleteSilkStripService(id) {
  const silkStrip = await getSilkStripById(id);
  if (!silkStrip) {
    const err = {
      message: "Silk strip not found",
      type: "NotFoundError",
    };
    throw err;
  }
  return await deleteSilkStrip(id);
}

export { addSilkStrips, fetchAllSilkStrips, getSilkStripByIdService, updateSilkStripService, deleteSilkStripService };