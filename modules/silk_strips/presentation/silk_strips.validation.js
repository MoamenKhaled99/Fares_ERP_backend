export function validateSilkStrip(silkStrip) {
  const requiredFields = [
    "totalQuantity",
    "loadCapacity",
    "safetyFactor",
    "unitMeter",
  ];

  const missingFields = requiredFields.filter(
    (field) => !(field in silkStrip)
  );  

  if (missingFields.length > 0) {
    const err = {
      message: `Missing required fields: ${missingFields.join(", ")}`,
      type: "ValidationError",
    };
    throw err;
  }

  // Validate safetyFactor as string enum
  const validSafetyFactors = ["1:5", "1:6", "1:7"];
  if (!validSafetyFactors.includes(silkStrip.safetyFactor)) {
    const err = {
      message: `safetyFactor must be one of: ${validSafetyFactors.join(", ")}`,
      type: "ValidationError",
    };
    throw err;
  }

  const numberFields = ["loadCapacity", "unitMeter", "totalQuantity"];
  for (const field of numberFields) {
    if (field in silkStrip && (typeof silkStrip[field] !== "number" || isNaN(silkStrip[field]))) {
      const err = {
        message: `Field ${field} must be a valid number`,
        type: "ValidationError",
      };
      throw err;
    }
  }

  return true;
}

export function validateSilkStripId(id) {
  if (!id || isNaN(parseInt(id))) {
    const err = {
      message: "Invalid ID",
      type: "ValidationError",
    };
    throw err;
  }
  return true;
}

export function validateSilkStripUpdate(silkStrip) {
  // للتحديث، جميع الحقول اختيارية لكن إذا وجدت يجب أن تكون صحيحة
  
  // Validate safetyFactor if provided
  if (silkStrip.safetyFactor !== undefined) {
    const validSafetyFactors = ["1:5", "1:6", "1:7"];
    if (!validSafetyFactors.includes(silkStrip.safetyFactor)) {
      const err = {
        message: `safetyFactor must be one of: ${validSafetyFactors.join(", ")}`,
        type: "ValidationError",
      };
      throw err;
    }
  }
  
  const numberFields = ["loadCapacity", "unitMeter", "totalQuantity"];
  for (const field of numberFields) {
    if (field in silkStrip && (typeof silkStrip[field] !== "number" || isNaN(silkStrip[field]))) {
      const err = {
        message: `Field ${field} must be a valid number`,
        type: "ValidationError",
      };
      throw err;
    }
  }
  return true;
}