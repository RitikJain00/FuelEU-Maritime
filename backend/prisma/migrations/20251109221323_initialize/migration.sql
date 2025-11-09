-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "routeId" TEXT NOT NULL,
    "vesselType" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "ghgIntensity" DOUBLE PRECISION NOT NULL,
    "fuelConsumption" DOUBLE PRECISION NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "totalEmissions" DOUBLE PRECISION NOT NULL,
    "isBaseline" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipCompliance" (
    "id" SERIAL NOT NULL,
    "ship_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "cb_gco2eq" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ShipCompliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankEntry" (
    "id" SERIAL NOT NULL,
    "ship_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount_gco2eq" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BankEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pool" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoolMember" (
    "id" SERIAL NOT NULL,
    "pool_id" INTEGER NOT NULL,
    "ship_compliance_id" INTEGER NOT NULL,
    "ship_id" TEXT NOT NULL,
    "cb_before" DOUBLE PRECISION NOT NULL,
    "cb_after" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PoolMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Route_routeId_year_idx" ON "Route"("routeId", "year");

-- CreateIndex
CREATE INDEX "ShipCompliance_ship_id_year_idx" ON "ShipCompliance"("ship_id", "year");

-- CreateIndex
CREATE INDEX "BankEntry_ship_id_year_idx" ON "BankEntry"("ship_id", "year");

-- CreateIndex
CREATE INDEX "PoolMember_pool_id_idx" ON "PoolMember"("pool_id");

-- CreateIndex
CREATE INDEX "PoolMember_ship_compliance_id_idx" ON "PoolMember"("ship_compliance_id");

-- AddForeignKey
ALTER TABLE "PoolMember" ADD CONSTRAINT "PoolMember_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "Pool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolMember" ADD CONSTRAINT "PoolMember_ship_compliance_id_fkey" FOREIGN KEY ("ship_compliance_id") REFERENCES "ShipCompliance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
