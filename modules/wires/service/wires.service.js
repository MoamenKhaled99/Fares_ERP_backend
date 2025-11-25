import { getAllWires, getWireById, createWire, updateWire, deleteWire } from "../repository/wires.repository.js";
import { createStockMovement } from "../../stock/repository/stock.repository.js";

async function addWires(wiresData) {
  // حساب الرصيد تلقائياً: الكمية × السعر
  const balance = wiresData.totalQuantity * wiresData.unitPrice;
  const dataWithBalance = {
    ...wiresData,
    balance,
  };
  
  // إنشاء المنتج
  const createdWire = await createWire(dataWithBalance);

  // إنشاء حركة مخزون تلقائية (خروج/استخدام)
  await createStockMovement({
    productType: 'wire',
    productId: createdWire.id,
    productName: createdWire.description,
    quantity: createdWire.totalQuantity,
    movementType: 'in',
    purchasePrice: createdWire.unitPrice,
    notes: `Auto-generated movement for new wire product ID: ${createdWire.id}`,
  });

  return createdWire;
}

async function fetchAllWires(search = '') {
  return await getAllWires(search);
}

async function getWireByIdService(id) {
  const wire = await getWireById(id);
  if (!wire) {
    const err = {
      message: "Wire not found",
      type: "NotFoundError",
    };
    throw err;
  }
  return wire;
}

async function updateWireService(id, data) {
  const wire = await getWireById(id);
  if (!wire) {
    const err = {
      message: "Wire not found",
      type: "NotFoundError",
    };
    throw err;
  }

  let updateData = { ...data };
  if (data.totalQuantity !== undefined || data.unitPrice !== undefined) {
    const qty = data.totalQuantity ?? wire.totalQuantity;
    const price = data.unitPrice ?? wire.unitPrice;
    updateData.balance = qty * price;
  }

  return await updateWire(id, updateData);
}

async function deleteWireService(id) {
  const wire = await getWireById(id);
  if (!wire) {
    const err = {
      message: "Wire not found",
      type: "NotFoundError",
    };
    throw err;
  }
  return await deleteWire(id);
}

export { addWires, fetchAllWires, getWireByIdService, updateWireService, deleteWireService };