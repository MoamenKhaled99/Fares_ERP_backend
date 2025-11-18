import {
  fetchAllInvoices,
  getInvoiceByIdService,
  createInvoiceService,
  updateInvoiceService,
  deleteInvoiceService,
  getTotalProfitsService,
} from "../service/invoices.service.js";
import { validateInvoice, validateInvoiceId } from "./invoices.validation.js";

// جلب جميع الفواتير
async function getAllInvoicesController(req, res) {
  const invoices = await fetchAllInvoices();
  res.status(200).json(invoices);
}

// جلب فاتورة بواسطة ID
async function getInvoiceByIdController(req, res) {
  const { id } = req.params;
  validateInvoiceId(id);
  const invoice = await getInvoiceByIdService(id);
  res.status(200).json(invoice);
}

// إنشاء فاتورة جديدة
async function createInvoiceController(req, res) {
  const data = req.body;
  validateInvoice(data);
  const invoice = await createInvoiceService(data);
  res.status(201).json(invoice);
}

// تحديث فاتورة
async function updateInvoiceController(req, res) {
  const { id } = req.params;
  validateInvoiceId(id);
  const invoice = await updateInvoiceService(id, req.body);
  res.status(200).json(invoice);
}

// حذف فاتورة
async function deleteInvoiceController(req, res) {
  const { id } = req.params;
  validateInvoiceId(id);
  await deleteInvoiceService(id);
  res.status(204).send();
}

// جلب إجمالي الأرباح
async function getTotalProfitsController(req, res) {
  const totalProfits = await getTotalProfitsService();
  res.status(200).json({ totalProfits });
}

export {
  getAllInvoicesController,
  getInvoiceByIdController,
  createInvoiceController,
  updateInvoiceController,
  deleteInvoiceController,
  getTotalProfitsController,
};
