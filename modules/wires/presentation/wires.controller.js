import {
  addWires,
  fetchAllWires,
  getWireByIdService,
  updateWireService,
  deleteWireService,
} from "../service/wires.service.js";
import {
  validateWire,
  validateWireId,
  validateWireUpdate,
} from "./wires.validation.js";

async function addWiresController(req, res) {
  const wiresData = req.body;
  validateWire(wiresData);
  const newWires = await addWires(wiresData);
  res.status(201).json(newWires);
}

async function getAllWiresController(req, res) {
  const wires = await fetchAllWires();
  res.status(200).json(wires);
}

async function getWireByIdController(req, res) {
  const { id } = req.params;
  validateWireId(id);
  const wire = await getWireByIdService(id);
  res.status(200).json(wire);
}

async function updateWireController(req, res) {
  const { id } = req.params;
  validateWireId(id);
  validateWireUpdate(req.body);
  const wire = await updateWireService(id, req.body);
  res.status(200).json(wire);
}

async function deleteWireController(req, res) {
  const { id } = req.params;
  validateWireId(id);
  await deleteWireService(id);
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
  addWiresController,
  getAllWiresController,
  getWireByIdController,
  updateWireController,
  deleteWireController,
  addStockController,
};
