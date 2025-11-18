import { getAllIrons, getIronById, createIron, updateIron, deleteIron } from "../repository/irons.repository.js";
import { createStockMovement } from "../../stock/repository/stock.repository.js";

async function addIrons(ironsData) {
  // حساب الرصيد تلقائياً: الكمية × السعر
  const balance = ironsData.totalQuantity * ironsData.unitPrice;
  
  const dataWithBalance = {
    ...ironsData,
    balance,
  };

  // إنشاء المنتج
  const createdIron = await createIron(dataWithBalance);

  // إنشاء حركة مخزون تلقائية (خروج/استخدام)
  await createStockMovement({
    productType: 'iron',
    productId: createdIron.id,
    quantity: createdIron.totalQuantity,
    movementType: 'out',
    purchasePrice: createdIron.unitPrice,
    notes: `Auto-generated movement for new iron product ID: ${createdIron.id}`,
  });

  return createdIron;
}

async function fetchAllIrons() {
  return await getAllIrons();
}

async function getIronByIdService(id) {
  const iron = await getIronById(id);
  if (!iron) {
    const err = {
      message: "Iron not found",
      type: "NotFoundError",
    };
    throw err;
  }
  return iron;
}

async function updateIronService(id, data) {
  const iron = await getIronById(id);
  if (!iron) {
    const err = {
      message: "Iron not found",
      type: "NotFoundError",
    };
    throw err;
  }

  let updateData = { ...data };
  if (data.totalQuantity !== undefined || data.unitPrice !== undefined) {
    const qty = data.totalQuantity ?? iron.totalQuantity;
    const price = data.unitPrice ?? iron.unitPrice;
    updateData.balance = qty * price;
  }

  return await updateIron(id, updateData);
}

async function deleteIronService(id) {
  const iron = await getIronById(id);
  if (!iron) {
    const err = {
      message: "Iron not found",
      type: "NotFoundError",
    };
    throw err;
  }
  return await deleteIron(id);
}

export { addIrons, fetchAllIrons, getIronByIdService, updateIronService, deleteIronService };