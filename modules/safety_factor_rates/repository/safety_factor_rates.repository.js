import { getPrisma } from '../../../config/prismaClient.js';

const prisma = getPrisma();

// Create a new safety factor rate
export const createSafetyFactorRateRepo = async (data) => {
  return await prisma.safetyFactorRate.create({
    data,
  });
};

// Get all safety factor rates
export const getAllSafetyFactorRatesRepo = async () => {
  return await prisma.safetyFactorRate.findMany({
    orderBy: {
      factor: 'asc',
    },
  });
};

// Get a safety factor rate by ID
export const getSafetyFactorRateByIdRepo = async (id) => {
  return await prisma.safetyFactorRate.findUnique({
    where: { id },
  });
};

// Get a safety factor rate by factor
export const getSafetyFactorRateByFactorRepo = async (factor) => {
  return await prisma.safetyFactorRate.findUnique({
    where: { factor },
  });
};

// Update a safety factor rate
export const updateSafetyFactorRateRepo = async (id, data) => {
  return await prisma.safetyFactorRate.update({
    where: { id },
    data,
  });
};

// Delete a safety factor rate
export const deleteSafetyFactorRateRepo = async (id) => {
  return await prisma.safetyFactorRate.delete({
    where: { id },
  });
};
