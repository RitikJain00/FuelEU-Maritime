import { prisma } from "../../lib/prisma"

export class BankingService {
  // ✅ Get all bank records for a ship & year
  async getRecords(shipId: string, year: number) {
    if (!shipId || isNaN(year)) {
      throw new Error("Missing or invalid shipId/year")
    }

    return prisma.bankEntry.findMany({
      where: { ship_id: shipId, year },
      orderBy: { id: "asc" },
    })
  }

  // ✅ Bank a positive compliance balance (CB surplus)
  async bankPositiveCB(shipId: string, year: number) {
    if (!shipId || isNaN(year)) {
      throw new Error("Missing or invalid shipId/year")
    }

    // Ensure there’s a CB record
    const cb = await prisma.shipCompliance.findUnique({
      where: { ship_id_year: { ship_id: shipId, year } },
    })

    if (!cb) throw new Error("Compliance balance not found")
    if (cb.cb_gco2eq <= 0) throw new Error("No surplus available to bank")

    // Use a transaction for safety
    const [entry] = await prisma.$transaction([
      prisma.bankEntry.create({
        data: { ship_id: shipId, year, amount_gco2eq: cb.cb_gco2eq },
      }),
      prisma.shipCompliance.update({
        where: { ship_id_year: { ship_id: shipId, year } },
        data: { cb_gco2eq: 0 }, // Reset CB after banking
      }),
    ])

    return entry
  }

  // ✅ Apply banked surplus to offset deficit
  async applyBanked(shipId: string, year: number, amount: number) {
    if (!shipId || isNaN(year) || isNaN(amount)) {
      throw new Error("Missing or invalid parameters")
    }
    if (amount <= 0) throw new Error("Amount must be positive")

    // Check available banked total
    const totalBanked = await prisma.bankEntry.aggregate({
      where: { ship_id: shipId, year },
      _sum: { amount_gco2eq: true },
    })

    const available = totalBanked._sum.amount_gco2eq || 0
    if (amount > available) throw new Error(`Insufficient banked amount. Available: ${available}`)

    // Apply the reduction safely
    const entry = await prisma.bankEntry.create({
      data: { ship_id: shipId, year, amount_gco2eq: -amount },
    })

    // Reflect the application in ShipCompliance
    await prisma.shipCompliance.update({
      where: { ship_id_year: { ship_id: shipId, year } },
      data: { cb_gco2eq: { increment: amount } }, // applying means reducing deficit (increase CB)
    })

    return entry
  }
}
