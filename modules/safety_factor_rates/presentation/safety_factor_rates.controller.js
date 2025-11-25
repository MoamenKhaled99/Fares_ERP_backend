import {
  addSafetyFactorRateService,
  getAllSafetyFactorRatesService,
  getSafetyFactorRateByIdService,
  updateSafetyFactorRateService,
  deleteSafetyFactorRateService,
} from '../service/safety_factor_rates.service.js';

// Add a new safety factor rate
export const addSafetyFactorRate = async (req, res, next) => {
  try {
    const safetyFactorRate = await addSafetyFactorRateService(req.body);
    res.status(201).json({
      success: true,
      data: safetyFactorRate,
    });
  } catch (error) {
    next(error);
  }
};

// Get all safety factor rates
export const getAllSafetyFactorRates = async (req, res, next) => {
  try {
    const safetyFactorRates = await getAllSafetyFactorRatesService();
    res.status(200).json({
      success: true,
      data: safetyFactorRates,
    });
  } catch (error) {
    next(error);
  }
};

// Get a safety factor rate by ID
export const getSafetyFactorRateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const safetyFactorRate = await getSafetyFactorRateByIdService(id);
    res.status(200).json({
      success: true,
      data: safetyFactorRate,
    });
  } catch (error) {
    next(error);
  }
};

// Update a safety factor rate
export const updateSafetyFactorRate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const safetyFactorRate = await updateSafetyFactorRateService(id, req.body);
    res.status(200).json({
      success: true,
      data: safetyFactorRate,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a safety factor rate
export const deleteSafetyFactorRate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteSafetyFactorRateService(id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
