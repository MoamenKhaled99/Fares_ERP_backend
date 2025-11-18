import express from "express";
import {
  getAllInvoicesController,
  getInvoiceByIdController,
  createInvoiceController,
  updateInvoiceController,
  deleteInvoiceController,
  getTotalProfitsController,
} from "./invoices.controller.js";
import { asyncHandler } from "../../../shared/filters/global_error.filter.js";

const router = express.Router();

router.post("/", asyncHandler(createInvoiceController));
router.get("/", asyncHandler(getAllInvoicesController));
router.get("/profits/total", asyncHandler(getTotalProfitsController));
router.get("/:id", asyncHandler(getInvoiceByIdController));
router.put("/:id", asyncHandler(updateInvoiceController));
router.delete("/:id", asyncHandler(deleteInvoiceController));

export default router;