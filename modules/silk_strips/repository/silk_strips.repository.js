import { getPrisma } from "../../../config/prismaClient.js";

const prisma = getPrisma();

export async function getAllSilkStrips(search = '') {
  return await prisma.SilkStrip.findMany({
    orderBy: { loadCapacity: 'asc' },
  });
}

export async function getSilkStripById(id) {
  return await prisma.SilkStrip.findUnique({
    where: { id: parseInt(id) },
  });
}

export async function createSilkStrip(data) {
  const silkStrip = await prisma.SilkStrip.create({ data });
  return silkStrip;
}

export async function updateSilkStrip(id, data) {
  const silkStrip = await prisma.SilkStrip.update({
    where: { id: parseInt(id) },
    data,
  });
  return silkStrip;
}

export async function deleteSilkStrip(id) {
  const silkStrip = await prisma.SilkStrip.delete({
    where: { id: parseInt(id) },
  });
  return silkStrip;
}