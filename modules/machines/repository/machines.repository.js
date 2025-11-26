import {getPrisma} from "../../../config/prismaClient.js";

const prisma = getPrisma();

export async function getAllMachines(search = '') {
  const whereClause = search
    ? {
        description: { 
          contains: search, 
          mode: 'insensitive' 
        }
      }
    : {};

  return await prisma.Machine.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getMachineById(id) {
  return await prisma.Machine.findUnique({
    where: { id: parseInt(id) },
  });
}

export async function createMachine(data) {
  const machine = await prisma.Machine.create({data});
  return machine;
}

export async function updateMachine(id, data) {
  const machine = await prisma.Machine.update({
    where: { id: parseInt(id) },
    data,
  });
  return machine;
}

export async function deleteMachine(id) {
  const machine = await prisma.Machine.delete({
    where: { id: parseInt(id) },
  });
  return machine;
}
