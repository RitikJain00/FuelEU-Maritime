import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding ShipCompliance and BankEntry data...")

  // 1️⃣ Clear old records (optional for dev)
  await prisma.bankEntry.deleteMany()
  await prisma.shipCompliance.deleteMany()

  // 2️⃣ Insert ShipCompliance data
  const shipComplianceData = [
    {
      ship_id: "S001",
      year: 2025,
      cb_gco2eq: 120000, // positive = surplus
    },
    {
      ship_id: "S002",
      year: 2025,
      cb_gco2eq: -80000, // negative = deficit
    },
    {
      ship_id: "S003",
      year: 2025,
      cb_gco2eq: 50000,
    },
    {
      ship_id: "S004",
      year: 2025,
      cb_gco2eq: -20000,
    },
  ]

  await prisma.shipCompliance.createMany({ data: shipComplianceData })

  // 3️⃣ Add some bank entries (simulate prior banking actions)
  const bankEntryData = [
    {
      ship_id: "S001",
      year: 2025,
      amount_gco2eq: 50000, // banked surplus
    },
    {
      ship_id: "S003",
      year: 2025,
      amount_gco2eq: 20000, // small banked surplus
    },
    {
      ship_id: "S001",
      year: 2025,
      amount_gco2eq: 30000, // previous year bank
    },
  ]

  await prisma.bankEntry.createMany({ data: bankEntryData })

  console.log("✅ Seeding completed successfully!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()

  })
