/*
  Warnings:

  - You are about to drop the column `name` on the `Iron` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SilkStrip` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Wire` table. All the data in the column will be lost.
  - Made the column `loadCapacity` on table `SilkStrip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `safetyFactor` on table `SilkStrip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unitMeter` on table `SilkStrip` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Iron" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "SilkStrip" DROP COLUMN "name",
ALTER COLUMN "loadCapacity" SET NOT NULL,
ALTER COLUMN "safetyFactor" SET NOT NULL,
ALTER COLUMN "safetyFactor" SET DATA TYPE TEXT,
ALTER COLUMN "unitMeter" SET NOT NULL;

-- AlterTable
ALTER TABLE "Wire" DROP COLUMN "name";

-- CreateTable
CREATE TABLE "SafetyFactorRate" (
    "id" SERIAL NOT NULL,
    "factor" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafetyFactorRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SafetyFactorRate_factor_key" ON "SafetyFactorRate"("factor");
