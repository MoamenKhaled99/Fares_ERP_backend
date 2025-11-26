export function validateMachine(machine) {
  const requiredFields = [
    "description",
    "unitPrice",
    "totalQuantity",
  ];

  const missingFields = requiredFields.filter(
    (field) => !(field in machine)
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
    if (typeof machine[field] !== "string") {
      const err = {
        message: `Field ${field} must be a string`,
        type: "ValidationError",
      };
      throw err;
    }
  }

  const numberFields = ["unitPrice", "totalQuantity"];
  for (const field of numberFields) {
    if (typeof machine[field] !== "number" || isNaN(machine[field])) {
      const err = {
        message: `Field ${field} must be a valid number`,
        type: "ValidationError",
      };
      throw err;
    }
  }

  return true;
}

export function validateMachineId(id) {
  if (!id || isNaN(parseInt(id))) {
    const err = {
      message: "Invalid ID",
      type: "ValidationError",
    };
    throw err;
  }
  return true;
}

export function validateMachineUpdate(machine) {
  const numberFields = ["unitPrice", "totalQuantity"];
  for (const field of numberFields) {
    if (field in machine && (typeof machine[field] !== "number" || isNaN(machine[field]))) {
      const err = {
        message: `Field ${field} must be a valid number`,
        type: "ValidationError",
      };
      throw err;
    }
  }
  if ("description" in machine && typeof machine["description"] !== "string") {
    const err = {
      message: "Field description must be a string",
      type: "ValidationError",
    };
    throw err;
  }
  return true;
}
