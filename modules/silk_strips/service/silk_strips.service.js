import {
  getAllSilkStrips,
  getSilkStripById,
  createSilkStrip,
  updateSilkStrip,
  deleteSilkStrip,
} from "../repository/silk_strips.repository.js";
import { createStockMovement } from "../../stock/repository/stock.repository.js";
import { getSafetyFactorRateByFactorService } from "../../safety_factor_rates/service/safety_factor_rates.service.js";

async function addSilkStrips(silkStripsData) {
  // جلب معدل معامل الأمان من قاعدة البيانات
  const safetyFactorRate = await getSafetyFactorRateByFactorService(
    silkStripsData.safetyFactor
  );

  // حساب سعر الوحدة تلقائياً: rate * unitMeter * loadCapacity
  const unitPrice =
    safetyFactorRate.rate *
    silkStripsData.unitMeter *
    silkStripsData.loadCapacity;

  // حساب الرصيد تلقائياً: الكمية × السعر
  const balance = silkStripsData.totalQuantity * unitPrice;

  // توليد اسم العرض: "safetyFactor × unitMeter × loadCapacity" (RTL format)
  const displayName = `${silkStripsData.safetyFactor} × ${silkStripsData.unitMeter} × ${silkStripsData.loadCapacity}`;

  const dataWithCalculations = {
    ...silkStripsData,
    unitPrice,
    balance,
    displayName,
  };

  // إنشاء المنتج
  const createdSilkStrip = await createSilkStrip(dataWithCalculations);

  // إنشاء حركة مخزون تلقائية (خروج/استخدام)
  await createStockMovement({
    productType: "silk_strip",
    productId: createdSilkStrip.id,
    productName: createdSilkStrip.displayName,
    quantity: createdSilkStrip.totalQuantity,
    movementType: "in",
    purchasePrice: createdSilkStrip.unitPrice,
    notes: `Auto-generated movement for new silk strip product ID: ${createdSilkStrip.id}`,
  });

  return createdSilkStrip;
}

async function fetchAllSilkStrips(search = '') {
  return await getAllSilkStrips(search);
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

  let updateData = { ...data };

  // إذا تم تحديث أي من العوامل المؤثرة على السعر، أعد حساب unitPrice
  if (
    data.safetyFactor !== undefined ||
    data.unitMeter !== undefined ||
    data.loadCapacity !== undefined
  ) {
    const safetyFactor = data.safetyFactor ?? silkStrip.safetyFactor;
    const unitMeter = data.unitMeter ?? silkStrip.unitMeter;
    const loadCapacity = data.loadCapacity ?? silkStrip.loadCapacity;

    // جلب معدل معامل الأمان
    const safetyFactorRate = await getSafetyFactorRateByFactorService(
      safetyFactor
    );

    // حساب سعر الوحدة: rate * unitMeter * loadCapacity
    updateData.unitPrice = safetyFactorRate.rate * unitMeter * loadCapacity;

    // توليد اسم العرض الجديد (RTL format)
    updateData.displayName = `${safetyFactor} × ${unitMeter} × ${loadCapacity}`;
  }

  // إذا تم تحديث الكمية أو السعر، أعد حساب balance
  if (data.totalQuantity !== undefined || updateData.unitPrice !== undefined) {
    const qty = data.totalQuantity ?? silkStrip.totalQuantity;
    const price = updateData.unitPrice ?? silkStrip.unitPrice;
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

export {
  addSilkStrips,
  fetchAllSilkStrips,
  getSilkStripByIdService,
  updateSilkStripService,
  deleteSilkStripService,
};
