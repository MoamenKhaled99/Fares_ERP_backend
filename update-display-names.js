import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

async function updateDisplayNames() {
  try {
    console.log('\n=== Updating Silk Strip Display Names ===\n');
    
    const silkStrips = await prisma.silkStrip.findMany();
    
    for (const strip of silkStrips) {
      const displayName = `${strip.safetyFactor} × ${strip.unitMeter} × ${strip.loadCapacity}`;
      
      await prisma.silkStrip.update({
        where: { id: strip.id },
        data: { displayName },
      });
      
      console.log(`Updated ID ${strip.id}: ${displayName}`);
    }
    
    console.log(`\n✅ Successfully updated ${silkStrips.length} silk strips\n`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateDisplayNames();
