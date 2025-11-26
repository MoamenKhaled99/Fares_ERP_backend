import { getAllMachines, getMachineById, createMachine, updateMachine, deleteMachine } from "../repository/machines.repository.js";
import { createStockMovement } from "../../stock/repository/stock.repository.js";

async function addMachines(machinesData) {
  // حساب الرصيد تلقائياً: الكمية × السعر
  const balance = machinesData.totalQuantity * machinesData.unitPrice;
  
  const dataWithBalance = {
    ...machinesData,
    balance,
  };

  // إنشاء المنتج
  const createdMachine = await createMachine(dataWithBalance);

  // إنشاء حركة مخزون تلقائية (خروج/استخدام)
  await createStockMovement({
    productType: 'machine',
    productId: createdMachine.id,
    productName: createdMachine.description,
    quantity: createdMachine.totalQuantity,
    movementType: 'in',
    purchasePrice: createdMachine.unitPrice,
    notes: `Auto-generated movement for new machine product ID: ${createdMachine.id}`,
  });

  return createdMachine;
}

async function fetchAllMachines(search = '') {
  return await getAllMachines(search);
}

async function getMachineByIdService(id) {
  const machine = await getMachineById(id);
  if (!machine) {
    const err = {
      message: "Machine not found",
      type: "NotFoundError",
    };
    throw err;
  }
  return machine;
}

async function updateMachineService(id, data) {
  const machine = await getMachineById(id);
  if (!machine) {
    const err = {
      message: "Machine not found",
      type: "NotFoundError",
    };
    throw err;
  }

  let updateData = { ...data };
  if (data.totalQuantity !== undefined || data.unitPrice !== undefined) {
    const qty = data.totalQuantity ?? machine.totalQuantity;
    const price = data.unitPrice ?? machine.unitPrice;
    updateData.balance = qty * price;
  }

  return await updateMachine(id, updateData);
}

async function deleteMachineService(id) {
  const machine = await getMachineById(id);
  if (!machine) {
    const err = {
      message: "Machine not found",
      type: "NotFoundError",
    };
    throw err;
  }
  return await deleteMachine(id);
}

export { addMachines, fetchAllMachines, getMachineByIdService, updateMachineService, deleteMachineService };
