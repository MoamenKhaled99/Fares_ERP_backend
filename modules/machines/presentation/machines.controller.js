import {
  addMachines,
  fetchAllMachines,
  getMachineByIdService,
  updateMachineService,
  deleteMachineService,
} from "../service/machines.service.js";
import {
  validateMachine,
  validateMachineId,
  validateMachineUpdate,
} from "./machines.validation.js";

import { addIncomingMovement } from "../../stock/service/stock.service.js";

async function addMachinesController(req, res) {
  const machinesData = req.body;
  validateMachine(machinesData);
  const newMachines = await addMachines(machinesData);
  res.status(201).json(newMachines);
}

async function getAllMachinesController(req, res) {
  const { search } = req.query;
  const machines = await fetchAllMachines(search || '');
  res.status(200).json(machines);
}

async function getMachineByIdController(req, res) {
  const { id } = req.params;
  validateMachineId(id);
  const machine = await getMachineByIdService(id);
  res.status(200).json(machine);
}

async function updateMachineController(req, res) {
  const { id } = req.params;
  validateMachineId(id);
  validateMachineUpdate(req.body);
  const machine = await updateMachineService(id, req.body);
  res.status(200).json(machine);
}

async function deleteMachineController(req, res) {
  const { id } = req.params;
  validateMachineId(id);
  await deleteMachineService(id);
  res.status(204).send();
}

async function addStockController(req, res) {
  const { id } = req.params;
  const { الكمية, السعر, notes } = req.body;

  // Map Arabic frontend keys to English backend keys
  const data = {
    productType: "machine",
    productId: parseInt(id),
    quantity: parseFloat(الكمية),
    purchasePrice: parseFloat(السعر),
    notes: notes,
  };
  const movement = await addIncomingMovement(data);
  res.status(200).json(movement);
}

export {
  addMachinesController,
  getAllMachinesController,
  getMachineByIdController,
  updateMachineController,
  deleteMachineController,
  addStockController,
};
