import express from "express";
import { addWiresController, getAllWiresController, getWireByIdController, updateWireController, deleteWireController } from "./wires.controller.js";
import { asyncHandler } from "../../../shared/filters/global_error.filter.js";

const router = express.Router();

router.post("/", asyncHandler(addWiresController));
router.get("/", asyncHandler(getAllWiresController));
router.get("/:id", asyncHandler(getWireByIdController));
router.put("/:id", asyncHandler(updateWireController));
router.delete("/:id", asyncHandler(deleteWireController));

export default router;