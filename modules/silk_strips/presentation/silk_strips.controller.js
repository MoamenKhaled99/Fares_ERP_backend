import {
  addSilkStrips,
  fetchAllSilkStrips,
  getSilkStripByIdService,
  updateSilkStripService,
  deleteSilkStripService,
} from "../service/silk_strips.service.js";
import {
  validateSilkStrip,
  validateSilkStripId,
  validateSilkStripUpdate,
} from "./silk_strips.validation.js";

import { addIncomingMovement } from "../../stock/service/stock.service.js"; // ✅ Import

async function addSilkStripsController(req, res) {
  const silkStripsData = req.body;
  validateSilkStrip(silkStripsData);
  const newSilkStrips = await addSilkStrips(silkStripsData);
  res.status(201).json(newSilkStrips);
}

async function getAllSilkStripsController(req, res) {
  const silkStrips = await fetchAllSilkStrips();
  res.status(200).json(silkStrips);
}

async function getSilkStripByIdController(req, res) {
  const { id } = req.params;
  validateSilkStripId(id);
  const silkStrip = await getSilkStripByIdService(id);
  res.status(200).json(silkStrip);
}

async function updateSilkStripController(req, res) {
  const { id } = req.params;
  validateSilkStripId(id);
  validateSilkStripUpdate(req.body);
  const silkStrip = await updateSilkStripService(id, req.body);
  res.status(200).json(silkStrip);
}

async function deleteSilkStripController(req, res) {
  const { id } = req.params;
  validateSilkStripId(id);
  await deleteSilkStripService(id);
  res.status(204).send();
}

  async function addStockController(req, res) {
    const { id } = req.params;
    const { الكمية, السعر, notes } = req.body;

    // Map Arabic frontend keys to English backend keys
    const data = {
      productType: "silk_strip", // Change to 'wire' or 'silk_strip' in other modules
      productId: parseInt(id),
      quantity: parseFloat(الكمية),
      purchasePrice: parseFloat(السعر),
      notes: notes,
    };

  // The stock validation should pass as we are supplying required fields
  // The stock service will handle the rest.

  const movement = await addIncomingMovement(data);
  res.status(200).json(movement);
}

export {
  addSilkStripsController,
  getAllSilkStripsController,
  getSilkStripByIdController,
  updateSilkStripController,
  deleteSilkStripController,
  addStockController,
};
