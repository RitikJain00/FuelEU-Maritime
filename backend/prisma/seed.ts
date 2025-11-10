// prisma/seed-routes.ts
import { prisma } from "../src/lib/prisma"

// async function main() {
//   console.log("Seeding Route table...")

//   const routes = [
//     {
//       routeId: "R001",
//       vesselType: "Container",
//       fuelType: "HFO",
//       year: 2024,
//       ghgIntensity: 91.0,
//       fuelConsumption: 5000,
//       distance: 12000,
//       totalEmissions: 4500,
//       isBaseline: true,
//     },
//     {
//       routeId: "R002",
//       vesselType: "BulkCarrier",
//       fuelType: "LNG",
//       year: 2024,
//       ghgIntensity: 88.0,
//       fuelConsumption: 4800,
//       distance: 11500,
//       totalEmissions: 4200,
//       isBaseline: true,
//     },
//     {
//       routeId: "R003",
//       vesselType: "Tanker",
//       fuelType: "MGO",
//       year: 2024,
//       ghgIntensity: 93.5,
//       fuelConsumption: 5100,
//       distance: 12500,
//       totalEmissions: 4700,
//       isBaseline: true,
//     },
//     {
//       routeId: "R004",
//       vesselType: "RoRo",
//       fuelType: "HFO",
//       year: 2025,
//       ghgIntensity: 89.2,
//       fuelConsumption: 4900,
//       distance: 11800,
//       totalEmissions: 4300,
//       isBaseline: false,
//     },
//     {
//       routeId: "R005",
//       vesselType: "Container",
//       fuelType: "LNG",
//       year: 2025,
//       ghgIntensity: 90.5,
//       fuelConsumption: 4950,
//       distance: 11900,
//       totalEmissions: 4400,
//       isBaseline: false,
//     },
//     {
//       routeId: "R006",
//       vesselType: "BulkCarrier",
//       fuelType: "HFO",
//       year: 2025,
//       ghgIntensity: 87.5,
//       fuelConsumption: 4700,
//       distance: 11300,
//       totalEmissions: 4100,
//       isBaseline: false,
//     },
//     {
//       routeId: "R007",
//       vesselType: "Tanker",
//       fuelType: "LNG",
//       year: 2024,
//       ghgIntensity: 92.0,
//       fuelConsumption: 5050,
//       distance: 12300,
//       totalEmissions: 4650,
//       isBaseline: true,
//     },
//     {
//       routeId: "R008",
//       vesselType: "Container",
//       fuelType: "MGO",
//       year: 2025,
//       ghgIntensity: 90.0,
//       fuelConsumption: 4980,
//       distance: 12100,
//       totalEmissions: 4450,
//       isBaseline: false,
//     },
//     {
//       routeId: "R009",
//       vesselType: "RoRo",
//       fuelType: "HFO",
//       year: 2024,
//       ghgIntensity: 88.8,
//       fuelConsumption: 4850,
//       distance: 11750,
//       totalEmissions: 4250,
//       isBaseline: true,
//     },
//     {
//       routeId: "R010",
//       vesselType: "BulkCarrier",
//       fuelType: "MGO",
//       year: 2025,
//       ghgIntensity: 91.5,
//       fuelConsumption: 4920,
//       distance: 11950,
//       totalEmissions: 4425,
//       isBaseline: false,
//     },
//   ]

//   await prisma.route.createMany({
//     data: routes,
//     skipDuplicates: true,
//   })

//   console.log("Route table seeded successfully!")
// }

// main()
//   .catch((e) => {
//     console.error(e)
   
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })

async function main() {
  console.log("Seeding BankEntry table...")

  const bankEntries = [
    { ship_id: "S001", year: 2024, amount_gco2eq: 100 },
    { ship_id: "S002", year: 2024, amount_gco2eq: 150 },
    { ship_id: "S003", year: 2024, amount_gco2eq: 80 },
    { ship_id: "S004", year: 2024, amount_gco2eq: 120 },
    { ship_id: "S005", year: 2024, amount_gco2eq: 50 },
    { ship_id: "S001", year: 2025, amount_gco2eq: 200 },
    { ship_id: "S002", year: 2025, amount_gco2eq: 180 },
    { ship_id: "S003", year: 2025, amount_gco2eq: 90 },
    { ship_id: "S004", year: 2025, amount_gco2eq: 160 },
    { ship_id: "S005", year: 2025, amount_gco2eq: 70 },
  ]

  await prisma.bankEntry.createMany({
    data: bankEntries,
    skipDuplicates: true,
  })

  console.log("BankEntry table seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })