-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "invoiceType" TEXT NOT NULL DEFAULT 'regular',
ALTER COLUMN "invoiceDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "InvoiceDetail" ADD COLUMN     "productName" TEXT,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SilkStrip" ADD COLUMN     "displayName" TEXT;
