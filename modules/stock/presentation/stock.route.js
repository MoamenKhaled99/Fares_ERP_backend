import express from "express";
import {
  getAllMovementsController,
  getMovementsByTypeController,
  getMovementsByProductController,
  deleteMovementController,
} from "./stock.controller.js";
import { asyncHandler } from "../../../shared/filters/global_error.filter.js";

const router = express.Router();

// Stock movements are created automatically when products or invoices are created
// Manual creation is no longer available - use POST /irons, /wires, /silk-strips, or /invoices instead

router.get("/", asyncHandler(getAllMovementsController));
router.get("/type/:productType", asyncHandler(getMovementsByTypeController));
router.get("/product/:productId", asyncHandler(getMovementsByProductController));
router.delete("/:id", asyncHandler(deleteMovementController));

export default router;