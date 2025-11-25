import { Router } from 'express';
import {
  addSafetyFactorRate,
  getAllSafetyFactorRates,
  getSafetyFactorRateById,
  updateSafetyFactorRate,
  deleteSafetyFactorRate,
} from './safety_factor_rates.controller.js';
import {
  validateSafetyFactorRate,
  validateSafetyFactorRateUpdate,
  validateId,
} from './safety_factor_rates.validation.js';

const router = Router();

// Create a new safety factor rate
router.post('/', validateSafetyFactorRate, addSafetyFactorRate);

// Get all safety factor rates
router.get('/', getAllSafetyFactorRates);

// Get a safety factor rate by ID
router.get('/:id', validateId, getSafetyFactorRateById);

// Update a safety factor rate
router.put('/:id', validateId, validateSafetyFactorRateUpdate, updateSafetyFactorRate);

// Delete a safety factor rate
router.delete('/:id', validateId, deleteSafetyFactorRate);

export default router;
