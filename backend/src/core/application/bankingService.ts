// core/application/bankingService.ts
import { prisma } from "../../lib/prisma"

export class BankingService {
  // ✅ Get all bank records
  async getRecords(shipId: string, year: number) {
    if (!shipId || isNaN(year)) throw new Error("Missing or invalid shipId/year")

    return prisma.bankEntry.findMany({
      where: { ship_id: shipId, year },
      orderBy: { id: "asc" },
    })
  }

  // ✅ Bank a positive CB
  async bankPositiveCB(shipId: string, year: number) {
    if (!shipId || isNaN(year)) throw new Error("Missing or invalid shipId/year")

    const compliance = await prisma.shipCompliance.findUnique({
      where: { ship_id_year: { ship_id: shipId, year } },
    })
    if (!compliance) throw new Error("Compliance balance not found")
    if (compliance.cb_gco2eq <= 0) throw new Error("No surplus available to bank")

    const [entry] = await prisma.$transaction([
      prisma.bankEntry.create({
        data: { ship_id: shipId, year, amount_gco2eq: compliance.cb_gco2eq },
      }),
      prisma.shipCompliance.update({
        where: { ship_id_year: { ship_id: shipId, year } },
        data: { cb_gco2eq: 0 }, // Reset after banking
      }),
    ])

    return entry
  }

  // ✅ Apply banked surplus to reduce deficit
  async applyBanked(shipId: string, year: number, amount: number) {
    if (!shipId || isNaN(year) || isNaN(amount)) throw new Error("Missing or invalid parameters")
    if (amount <= 0) throw new Error("Amount must be positive")

    const compliance = await prisma.shipCompliance.findUnique({
      where: { ship_id_year: { ship_id: shipId, year } },
    })
    if (!compliance) throw new Error(`ShipCompliance not found for ${shipId} year ${year}`)

    // Compute available banked
    const totalBanked = await prisma.bankEntry.aggregate({
      where: { ship_id: shipId, year },
      _sum: { amount_gco2eq: true },
    })
    const available = totalBanked._sum.amount_gco2eq || 0
    if (amount > available) throw new Error(`Insufficient banked credits. Available: ${available}`)

    // Apply banked amount
    const entry = await prisma.bankEntry.create({
      data: { ship_id: shipId, year, amount_gco2eq: -amount },
    })

    // Update ShipCompliance CB
    const updatedCompliance = await prisma.shipCompliance.update({
      where: { ship_id_year: { ship_id: shipId, year } },
      data: { cb_gco2eq: { increment: amount } }, // reduce deficit
    })

    return {
      message: "Applied banked credits successfully",
      newEntry: entry,
      cb_before: compliance.cb_gco2eq,
      cb_after: updatedCompliance.cb_gco2eq,
      remainingBanked: available - amount,
    }
  }
}
