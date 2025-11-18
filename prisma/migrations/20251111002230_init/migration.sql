-- CreateTable
CREATE TABLE "SilkStrip" (
    "id" SERIAL NOT NULL,
    "loadCapacity" DOUBLE PRECISION,
    "safetyFactor" DOUBLE PRECISION,
    "unitMeter" DOUBLE PRECISION,
    "price" DOUBLE PRECISION NOT NULL,
    "incoming" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "outgoing" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SilkStrip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Iron" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "incoming" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "outgoing" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Iron_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wire" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "incoming" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "outgoing" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" SERIAL NOT NULL,
    "productType" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "movementType" TEXT NOT NULL,
    "movementDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceDetail" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "productType" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "sellingPrice" DOUBLE PRECISION NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "InvoiceDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StockMovement_productType_idx" ON "StockMovement"("productType");

-- CreateIndex
CREATE INDEX "StockMovement_movementType_idx" ON "StockMovement"("movementType");

-- CreateIndex
CREATE INDEX "StockMovement_productId_idx" ON "StockMovement"("productId");

-- CreateIndex
CREATE INDEX "InvoiceDetail_invoiceId_idx" ON "InvoiceDetail"("invoiceId");

-- CreateIndex
CREATE INDEX "InvoiceDetail_productType_idx" ON "InvoiceDetail"("productType");

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "stock_movement_silk_strip_fk" FOREIGN KEY ("productId") REFERENCES "SilkStrip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "stock_movement_iron_fk" FOREIGN KEY ("productId") REFERENCES "Iron"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "stock_movement_wire_fk" FOREIGN KEY ("productId") REFERENCES "Wire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceDetail" ADD CONSTRAINT "InvoiceDetail_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
