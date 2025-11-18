import express from "express";
import { addSilkStripsController, getAllSilkStripsController, getSilkStripByIdController, updateSilkStripController, deleteSilkStripController } from "./silk_strips.controller.js";
import { asyncHandler } from "../../../shared/filters/global_error.filter.js";

const router = express.Router();

router.post("/", asyncHandler(addSilkStripsController));
router.get("/", asyncHandler(getAllSilkStripsController));
router.get("/:id", asyncHandler(getSilkStripByIdController));
router.put("/:id", asyncHandler(updateSilkStripController));
router.delete("/:id", asyncHandler(deleteSilkStripController));

export default router;