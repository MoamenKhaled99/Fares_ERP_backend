import { getPrisma } from "../../../config/prismaClient.js";

const prisma = getPrisma();

export async function getAllWires(search = '') {
  const whereClause = search
    ? {
        description: { 
          contains: search, 
          mode: 'insensitive' 
        }
      }
    : {};

  return await prisma.Wire.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getWireById(id) {
  return await prisma.Wire.findUnique({
    where: { id: parseInt(id) },
  });
}

export async function createWire(data) {
  const wire = await prisma.Wire.create({data});
  return wire;
}

export async function updateWire(id, data) {
  const wire = await prisma.Wire.update({
    where: { id: parseInt(id) },
    data,
  });
  return wire;
}

export async function deleteWire(id) {
  const wire = await prisma.Wire.delete({
    where: { id: parseInt(id) },
  });
  return wire;
}