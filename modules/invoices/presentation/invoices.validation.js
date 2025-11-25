export function validateInvoice(invoice) {
  // Validate invoiceType if provided
  if (invoice.invoiceType) {
    const validTypes = ["regular", "non-stock"];
    if (!validTypes.includes(invoice.invoiceType)) {
      const err = {
        message: "Invalid invoiceType. Must be: regular or non-stock",
        type: "ValidationError",
      };
      throw err;
    }
  }

  // Validate invoiceDate if provided
  if (invoice.invoiceDate) {
    const date = new Date(invoice.invoiceDate);
    if (isNaN(date.getTime())) {
      const err = {
        message: "Invalid invoiceDate format. Please provide a valid ISO 8601 date string",
        type: "ValidationError",
      };
      throw err;
    }
  }

  if (
    !invoice.details ||
    !Array.isArray(invoice.details) ||
    invoice.details.length === 0
  ) {
    const err = {
      message:
        "Invoice details are required and must be an array with at least one item",
      type: "ValidationError",
    };
    throw err;
  }

  const validProductTypes = ["silk_strip", "iron", "wire"];
  const isNonStock = invoice.invoiceType === "non-stock";

  for (const detail of invoice.details) {
    if (
      !detail.productType ||
      !validProductTypes.includes(detail.productType)
    ) {
      const err = {
        message: "Invalid productType. Must be: silk_strip, iron, or wire",
        type: "ValidationError",
      };
      throw err;
    }

    // For non-stock invoices, productId is optional but productName is required
    if (isNonStock) {
      if (!detail.productName || typeof detail.productName !== "string") {
        const err = {
          message: "Field productName is required for non-stock invoices",
          type: "ValidationError",
        };
        throw err;
      }
      if (!detail.purchasePrice || typeof detail.purchasePrice !== "number" || detail.purchasePrice < 0) {
        const err = {
          message: "Field purchasePrice is required for non-stock invoices and must be a non-negative number",
          type: "ValidationError",
        };
        throw err;
      }
    } else {
      // For regular invoices, productId is required
      if (
        !detail.productId ||
        typeof detail.productId !== "number" ||
        detail.productId <= 0
      ) {
        const err = {
          message: "Field productId is required for regular invoices and must be a positive number",
          type: "ValidationError",
        };
        throw err;
      }
    }

    if (
      !detail.quantity ||
      typeof detail.quantity !== "number" ||
      detail.quantity <= 0
    ) {
      const err = {
        message: "Field quantity is required and must be greater than zero",
        type: "ValidationError",
      };
      throw err;
    }

    if (
      detail.purchasePrice !== undefined &&
      (typeof detail.purchasePrice !== "number" ||
      detail.purchasePrice < 0)
    ) {
      const err = {
        message:
          "Field purchasePrice (if provided) must be a non-negative number. If omitted, it will be auto-filled from product unitPrice",
        type: "ValidationError",
      };
      throw err;
    }

    if (
      !detail.sellingPrice ||
      typeof detail.sellingPrice !== "number" ||
      detail.sellingPrice <= 0
    ) {
      const err = {
        message: "Field sellingPrice is required and must be greater than zero",
        type: "ValidationError",
      };
      throw err;
    }
  }

  return true;
}

export function validateInvoiceId(id) {
  if (!id || isNaN(parseInt(id))) {
    const err = {
      message: "Invalid ID",
      type: "ValidationError",
    };
    throw err;
  }
  return true;
}
