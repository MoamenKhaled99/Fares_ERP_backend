import express from "express";
import { addMachinesController, getAllMachinesController, getMachineByIdController, updateMachineController, deleteMachineController, addStockController } from "./machines.controller.js";
import { asyncHandler } from "../../../shared/filters/global_error.filter.js";

const router = express.Router();

router.post("/", asyncHandler(addMachinesController));
router.get("/", asyncHandler(getAllMachinesController));
router.get("/:id", asyncHandler(getMachineByIdController));
router.put("/:id", asyncHandler(updateMachineController));
router.delete("/:id", asyncHandler(deleteMachineController));
router.post("/:id/add-stock", asyncHandler(addStockController));

export default router;
