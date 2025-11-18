/*
  Warnings:

  - You are about to drop the column `incoming` on the `Iron` table. All the data in the column will be lost.
  - You are about to drop the column `outgoing` on the `Iron` table. All the data in the column will be lost.
  - You are about to drop the column `incoming` on the `SilkStrip` table. All the data in the column will be lost.
  - You are about to drop the column `outgoing` on the `SilkStrip` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `SilkStrip` table. All the data in the column will be lost.
  - You are about to drop the column `incoming` on the `Wire` table. All the data in the column will be lost.
  - You are about to drop the column `outgoing` on the `Wire` table. All the data in the column will be lost.
  - Added the required column `unitPrice` to the `SilkStrip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Iron" DROP COLUMN "incoming",
DROP COLUMN "outgoing";

-- AlterTable
ALTER TABLE "SilkStrip" DROP COLUMN "incoming",
DROP COLUMN "outgoing",
DROP COLUMN "price",
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Wire" DROP COLUMN "incoming",
DROP COLUMN "outgoing";
