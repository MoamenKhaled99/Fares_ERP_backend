export function validateSilkStrip(silkStrip) {
  const requiredFields = [
    "unitPrice",
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

  const numberFields = ["loadCapacity", "safetyFactor", "unitMeter", "unitPrice", "totalQuantity"];
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
  // للتحديث، جميع الحقول اختيارية لكن إذا وجدت يجب أن تكون رقم
  const numberFields = ["loadCapacity", "safetyFactor", "unitMeter", "unitPrice", "totalQuantity"];
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