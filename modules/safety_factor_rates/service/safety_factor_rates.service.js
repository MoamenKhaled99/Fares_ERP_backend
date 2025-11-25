import {
  createSafetyFactorRateRepo,
  getAllSafetyFactorRatesRepo,
  getSafetyFactorRateByIdRepo,
  getSafetyFactorRateByFactorRepo,
  updateSafetyFactorRateRepo,
  deleteSafetyFactorRateRepo,
} from '../repository/safety_factor_rates.repository.js';

// Add a new safety factor rate
export const addSafetyFactorRateService = async (data) => {
  const safetyFactorRate = await createSafetyFactorRateRepo(data);
  return safetyFactorRate;
};

// Get all safety factor rates
export const getAllSafetyFactorRatesService = async () => {
  const safetyFactorRates = await getAllSafetyFactorRatesRepo();
  return safetyFactorRates;
};

// Get a safety factor rate by ID
export const getSafetyFactorRateByIdService = async (id) => {
  const safetyFactorRate = await getSafetyFactorRateByIdRepo(id);
  if (!safetyFactorRate) {
    const err = {
      message: 'Safety factor rate not found',
      type: 'NotFoundError',
    };
    throw err;
  }
  return safetyFactorRate;
};

// Get a safety factor rate by factor (for internal use)
export const getSafetyFactorRateByFactorService = async (factor) => {
  const safetyFactorRate = await getSafetyFactorRateByFactorRepo(factor);
  if (!safetyFactorRate) {
    const err = {
      message: `Safety factor rate not found for factor: ${factor}`,
      type: 'NotFoundError',
    };
    throw err;
  }
  return safetyFactorRate;
};

// Update a safety factor rate
export const updateSafetyFactorRateService = async (id, data) => {
  const safetyFactorRate = await getSafetyFactorRateByIdRepo(id);
  if (!safetyFactorRate) {
    const err = {
      message: 'Safety factor rate not found',
      type: 'NotFoundError',
    };
    throw err;
  }

  const updatedSafetyFactorRate = await updateSafetyFactorRateRepo(id, data);
  return updatedSafetyFactorRate;
};

// Delete a safety factor rate
export const deleteSafetyFactorRateService = async (id) => {
  const safetyFactorRate = await getSafetyFactorRateByIdRepo(id);
  if (!safetyFactorRate) {
    const err = {
      message: 'Safety factor rate not found',
      type: 'NotFoundError',
    };
    throw err;
  }

  await deleteSafetyFactorRateRepo(id);
  return { message: 'Safety factor rate deleted successfully' };
};
