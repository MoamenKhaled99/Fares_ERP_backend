/*
  Warnings:

  - Added the required column `updatedAt` to the `StockMovement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "stock_movement_iron_fk";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "stock_movement_silk_strip_fk";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "stock_movement_wire_fk";

-- AlterTable
ALTER TABLE "Iron" ADD COLUMN     "name" TEXT,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SilkStrip" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Wire" ADD COLUMN     "name" TEXT,
ALTER COLUMN "description" DROP NOT NULL;
