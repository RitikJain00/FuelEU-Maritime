import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const TARGET_INTENSITY = 89.3368
const ENERGY_PER_TON = 41000 // MJ per tonne

export class ComplianceService {
  async computeCB(shipId: string, year: number) {
    const route = await prisma.route.findFirst({ where: { routeId: shipId, year } })
    if (!route) throw new Error("Route not found")

    const energy = route.fuelConsumption * ENERGY_PER_TON
    const cb = (TARGET_INTENSITY - route.ghgIntensity) * energy // gCO₂e

    // Store snapshot
    const record = await prisma.shipCompliance.upsert({
      where: { ship_id_year: { ship_id: shipId, year } },
      update: { cb_gco2eq: cb },
      create: { ship_id: shipId, year, cb_gco2eq: cb },
    })

    return record
  }

  async getAdjustedCB(shipId: string, year: number) {
    const baseCB = await prisma.shipCompliance.findUnique({
      where: { ship_id_year: { ship_id: shipId, year } },
    })
    if (!baseCB) throw new Error("Compliance balance not found")

    const bankApplied = await prisma.bankEntry.aggregate({
      where: { ship_id: shipId, year },
      _sum: { amount_gco2eq: true },
    })

    const adjusted = baseCB.cb_gco2eq + (bankApplied._sum.amount_gco2eq || 0)
    return { ...baseCB, adjustedCB: adjusted }
  }
}
