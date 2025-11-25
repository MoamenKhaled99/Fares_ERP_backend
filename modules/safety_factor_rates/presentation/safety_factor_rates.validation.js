// Validate safety factor rate creation
export const validateSafetyFactorRate = (req, res, next) => {
  const { factor, rate } = req.body;
  const errors = [];

  // Validate factor
  if (!factor || typeof factor !== 'string') {
    errors.push('Factor is required and must be a string');
  } else {
    const validFactors = ['1:5', '1:6', '1:7'];
    if (!validFactors.includes(factor)) {
      errors.push('Factor must be one of: 1:5, 1:6, 1:7');
    }
  }

  // Validate rate
  if (rate === undefined || rate === null) {
    errors.push('Rate is required');
  } else if (typeof rate !== 'number' || isNaN(rate)) {
    errors.push('Rate must be a valid number');
  } else if (rate <= 0) {
    errors.push('Rate must be greater than 0');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};

// Validate safety factor rate update
export const validateSafetyFactorRateUpdate = (req, res, next) => {
  const { factor, rate } = req.body;
  const errors = [];

  // Validate factor if provided
  if (factor !== undefined) {
    if (typeof factor !== 'string') {
      errors.push('Factor must be a string');
    } else {
      const validFactors = ['1:5', '1:6', '1:7'];
      if (!validFactors.includes(factor)) {
        errors.push('Factor must be one of: 1:5, 1:6, 1:7');
      }
    }
  }

  // Validate rate if provided
  if (rate !== undefined) {
    if (typeof rate !== 'number' || isNaN(rate)) {
      errors.push('Rate must be a valid number');
    } else if (rate <= 0) {
      errors.push('Rate must be greater than 0');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};

// Validate ID parameter
export const validateId = (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID parameter',
    });
  }

  req.params.id = parsedId;
  next();
};
