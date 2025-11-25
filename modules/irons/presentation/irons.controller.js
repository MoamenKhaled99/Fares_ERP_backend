import {
  addIrons,
  fetchAllIrons,
  getIronByIdService,
  updateIronService,
  deleteIronService,
} from "../service/irons.service.js";
import {
  validateIron,
  validateIronId,
  validateIronUpdate,
} from "./irons.validation.js";

import { addIncomingMovement } from "../../stock/service/stock.service.js"; // ✅ Import

async function addIronsController(req, res) {
  const ironsData = req.body;
  validateIron(ironsData);
  const newIrons = await addIrons(ironsData);
  res.status(201).json(newIrons);
}

async function getAllIronsController(req, res) {
  const { search } = req.query;
  const irons = await fetchAllIrons(search || '');
  res.status(200).json(irons);
}

async function getIronByIdController(req, res) {
  const { id } = req.params;
  validateIronId(id);
  const iron = await getIronByIdService(id);
  res.status(200).json(iron);
}

async function updateIronController(req, res) {
  const { id } = req.params;
  validateIronId(id);
  validateIronUpdate(req.body);
  const iron = await updateIronService(id, req.body);
  res.status(200).json(iron);
}

async function deleteIronController(req, res) {
  const { id } = req.params;
  validateIronId(id);
  await deleteIronService(id);
  res.status(204).send();
}

async function addStockController(req, res) {
  const { id } = req.params;
  const { الكمية, السعر, notes } = req.body;

  // Map Arabic frontend keys to English backend keys
  const data = {
    productType: "iron", // Change to 'wire' or 'silk_strip' in other modules
    productId: parseInt(id),
    quantity: parseFloat(الكمية),
    purchasePrice: parseFloat(السعر),
    notes: notes,
  };
  const movement = await addIncomingMovement(data);
  res.status(200).json(movement);
}

export {
  addIronsController,
  getAllIronsController,
  getIronByIdController,
  updateIronController,
  deleteIronController,
  addStockController,
};
