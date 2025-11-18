export function validateIron(iron) {
  const requiredFields = [
    "description",
    "unitPrice",
    "totalQuantity",
  ];

  const missingFields = requiredFields.filter(
    (field) => !(field in iron)
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
    if (typeof iron[field] !== "string") {
      const err = {
        message: `Field ${field} must be a string`,
        type: "ValidationError",
      };
      throw err;
    }
  }

  const numberFields = ["unitPrice", "totalQuantity"];
  for (const field of numberFields) {
    if (typeof iron[field] !== "number" || isNaN(iron[field])) {
      const err = {
        message: `Field ${field} must be a valid number`,
        type: "ValidationError",
      };
      throw err;
    }
  }

  return true;
}

export function validateIronId(id) {
  if (!id || isNaN(parseInt(id))) {
    const err = {
      message: "Invalid ID",
      type: "ValidationError",
    };
    throw err;
  }
  return true;
}

export function validateIronUpdate(iron) {
  const numberFields = ["unitPrice", "totalQuantity"];
  for (const field of numberFields) {
    if (field in iron && (typeof iron[field] !== "number" || isNaN(iron[field]))) {
      const err = {
        message: `Field ${field} must be a valid number`,
        type: "ValidationError",
      };
      throw err;
    }
  }
  if ("description" in iron && typeof iron["description"] !== "string") {
    const err = {
      message: "Field description must be a string",
      type: "ValidationError",
    };
    throw err;
  }
  return true;
}