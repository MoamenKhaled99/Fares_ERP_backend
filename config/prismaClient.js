import { PrismaClient } from  "../generated/prisma/index.js";
let prisma;

function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }

  return prisma;
}

export { getPrisma };
