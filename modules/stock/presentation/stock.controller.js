import {
  fetchAllStockMovements,
  getMovementsByType,
  getMovementsByProduct,
  addIncomingMovement,
  removeOutgoingMovement,
} from "../service/stock.service.js";
import {
  validateStockMovement,
  validateProductType,
  validateStockMovementId,
} from "./stock.validation.js";

// جلب جميع حركات المخزون
async function getAllMovementsController(req, res) {
  const movements = await fetchAllStockMovements();
  res.status(200).json(movements);
}

// جلب حركات حسب نوع المنتج
async function getMovementsByTypeController(req, res) {
  const { productType } = req.params;
  validateProductType(productType);
  const movements = await getMovementsByType(productType);
  res.status(200).json(movements);
}

// جلب حركات حسب معرف المنتج
async function getMovementsByProductController(req, res) {
  const { productId } = req.params;
  const movements = await getMovementsByProduct(parseInt(productId));
  res.status(200).json(movements);
}

// إضافة حركة مخزون وارد
async function addMovementController(req, res) {
  const data = req.body;
  validateStockMovement(data);
  const movement = await addIncomingMovement(data);
  res.status(201).json(movement);
}

// حذف حركة مخزون
async function deleteMovementController(req, res) {
  const { id } = req.params;
  validateStockMovementId(id);
  await removeOutgoingMovement(id);
  res.status(204).send();
}

export {
  getAllMovementsController,
  getMovementsByTypeController,
  getMovementsByProductController,
  addMovementController,
  deleteMovementController,
};
