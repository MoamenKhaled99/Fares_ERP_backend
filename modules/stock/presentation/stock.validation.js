export function validateStockMovement(movement) {
  const requiredFields = [
    "productType",
    "productId",
    "quantity",
    "purchasePrice",
  ];

  const missingFields = requiredFields.filter(
    (field) => !(field in movement)
  );  

  if (missingFields.length > 0) {
    const err = {
      message: `Missing required fields: ${missingFields.join(", ")}`,
      type: "ValidationError",
    };
    throw err;
  }

  const validProductTypes = ["silk_strip", "iron", "wire"];
  if (!validProductTypes.includes(movement.productType)) {
    const err = {
      message: "Invalid productType. Must be: silk_strip, iron, or wire",
      type: "ValidationError",
    };
    throw err;
  }

  if (typeof movement.productId !== "number" || movement.productId <= 0) {
    const err = {
      message: "Field productId must be a valid positive number",
      type: "ValidationError",
    };
    throw err;
  }

  if (typeof movement.quantity !== "number" || movement.quantity <= 0) {
    const err = {
      message: "Field quantity must be a valid positive number",
      type: "ValidationError",
    };
    throw err;
  }

  if (typeof movement.purchasePrice !== "number" || movement.purchasePrice < 0) {
    const err = {
      message: "Field purchasePrice must be a valid non-negative number",
      type: "ValidationError",
    };
    throw err;
  }

  return true;
}

export function validateProductType(productType) {
  const validTypes = ["silk_strip", "iron", "wire"];
  if (!validTypes.includes(productType)) {
    const err = {
      message: "Invalid productType. Must be: silk_strip, iron, or wire",
      type: "ValidationError",
    };
    throw err;
  }
  return true;
}

export function validateStockMovementId(id) {
  if (!id || isNaN(parseInt(id))) {
    const err = {
      message: "Invalid ID",
      type: "ValidationError",
    };
    throw err;
  }
  return true;
}
