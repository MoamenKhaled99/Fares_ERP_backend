import {getPrisma} from "../../../config/prismaClient.js";

const prisma = getPrisma();

export async function getAllIrons() {
  return await prisma.Iron.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getIronById(id) {
  return await prisma.Iron.findUnique({
    where: { id: parseInt(id) },
  });
}

export async function createIron(data) {
  const iron = await prisma.Iron.create({data});
  return iron;
}

export async function updateIron(id, data) {
  const iron = await prisma.Iron.update({
    where: { id: parseInt(id) },
    data,
  });
  return iron;
}

export async function deleteIron(id) {
  const iron = await prisma.Iron.delete({
    where: { id: parseInt(id) },
  });
  return iron;
}