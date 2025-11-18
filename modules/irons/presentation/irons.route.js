import express from "express";
import { addIronsController, getAllIronsController, getIronByIdController, updateIronController, deleteIronController, addStockController } from "./irons.controller.js";
import { asyncHandler } from "../../../shared/filters/global_error.filter.js";

const router = express.Router();

router.post("/", asyncHandler(addIronsController));
router.get("/", asyncHandler(getAllIronsController));
router.get("/:id", asyncHandler(getIronByIdController));
router.put("/:id", asyncHandler(updateIronController));
router.delete("/:id", asyncHandler(deleteIronController));
router.post("/:id/add-stock", asyncHandler(addStockController));

export default router;