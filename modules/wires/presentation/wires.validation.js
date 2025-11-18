export function validateWire(Wire) {
  const requiredFields = [
    "description",
    "unitPrice",
    "totalQuantity",
  ];

  const missingFields = requiredFields.filter(
    (field) => !(field in Wire)
  );  

  if (missingFields.length > 0) {
    const err = {
      message: `Missing required fields: ${missingFields.join(", ")}`,
      type: "ValidationError",
    };
    throw err;
  }

  const stringFields = ["description"];
  for (const field of stringFields) {
    if (typeof Wire[field] !== "string") {
      const err = {
        message: `Field ${field} must be a string`,
        type: "ValidationError",
      };
      throw err;
    }
  }

  const numberFields = ["unitPrice", "totalQuantity"];
  for (const field of numberFields) {
    if (typeof Wire[field] !== "number" || isNaN(Wire[field])) {
      const err = {
        message: `Field ${field} must be a valid number`,
        type: "ValidationError",
      };
      throw err;
    }
  }

  return true;
}

export function validateWireId(id) {
  if (!id || isNaN(parseInt(id))) {
    const err = {
      message: "Invalid ID",
      type: "ValidationError",
    };
    throw err;
  }
  return true;
}

export function validateWireUpdate(wire) {
  const numberFields = ["unitPrice", "totalQuantity"];
  for (const field of numberFields) {
    if (field in wire && (typeof wire[field] !== "number" || isNaN(wire[field]))) {
      const err = {
        message: `Field ${field} must be a valid number`,
        type: "ValidationError",
      };
      throw err;
    }
  }
  if ("description" in wire && typeof wire["description"] !== "string") {
    const err = {
      message: "Field description must be a string",
      type: "ValidationError",
    };
    throw err;
  }
  return true;
}