import express from "express"
import { PrismaClient } from "@prisma/client"
import { BankingService } from "../../core/application/bankingService.js"

const prisma = new PrismaClient()
const service = new BankingService()
export const bankingController = express.Router()

// =========================================================
//  GET /api/banking/records?shipId=SHIP-001&year=2024
// =========================================================
bankingController.get("/records", async (req, res) => {
  try {
    const { shipId, year } = req.query
    if (!shipId || !year) {
      return res.status(400).json({ error: "shipId and year are required" })
    }

    const ship_id = String(shipId)
    const yr = Number(year)

    // 1️⃣ Get base compliance CB
    const compliance = await prisma.shipCompliance.findUnique({
      where: { ship_id_year: { ship_id, year: yr } },
    })

    if (!compliance) {
      return res.json({
        shipId: ship_id,
        year: yr,
        cb_before: 0,
        cb_after: 0,
        bankEntries: [],
        message: "No data found",
      })
    }
    

    // 2️⃣ Get all bank entries for that ship & year
    const records = await service.getRecords(ship_id, yr)
    const totalBanked = records.reduce((sum, r) => sum + (r.amount_gco2eq || 0), 0)

    // 3️⃣ Compute before/after
    const cb_before = compliance.cb_gco2eq
    const cb_after = cb_before + totalBanked

    // 4️⃣ Return response
    return res.json({
      shipId: ship_id,
      year: yr,
      cb_before,
      cb_after,
      bankEntries: records,
    })
  } catch (err: any) {
    console.error("Error in /records:", err)
    res.status(400).json({ error: err.message })
  }
})

// =========================================================
//  POST /api/banking/bank
//  Body: { shipId: "SHIP-001", year: 2024 }
// =========================================================
bankingController.post("/bank", async (req, res) => {
  try {
    const { shipId, year } = req.body
    if (!shipId || !year) {
      return res.status(400).json({ error: "shipId and year are required" })
    }

    const entry = await service.bankPositiveCB(String(shipId), Number(year))

    // Get updated compliance + banking summary for UI refresh
    const updatedRecords = await prisma.bankEntry.findMany({
      where: { ship_id: shipId, year },
    })
    const totalBanked = updatedRecords.reduce((s, r) => s + r.amount_gco2eq, 0)

    const compliance = await prisma.shipCompliance.findUnique({
      where: { ship_id_year: { ship_id: shipId, year } },
    })

    const cb_before = compliance?.cb_gco2eq ?? 0
    const cb_after = cb_before + totalBanked

    res.json({
      message: "Banking successful",
      newEntry: entry,
      cb_before,
      cb_after,
    })
  } catch (err: any) {
    console.error("Error in /bank:", err)
    res.status(400).json({ error: err.message })
  }
})

// =========================================================
//  POST /api/banking/apply
//  Body: { shipId: "SHIP-001", year: 2024, amount: 50 }
// =========================================================
bankingController.post("/apply", async (req, res) => {
  try {
    const { shipId, year, amount } = req.body
    if (!shipId || !year || amount == null) {
      return res.status(400).json({ error: "shipId, year and amount are required" })
    }

    const entry = await service.applyBanked(String(shipId), Number(year), Number(amount))

    // Recalculate totals for UI
    const updatedRecords = await prisma.bankEntry.findMany({
      where: { ship_id: shipId, year },
    })
    const totalBanked = updatedRecords.reduce((s, r) => s + r.amount_gco2eq, 0)

    const compliance = await prisma.shipCompliance.findUnique({
      where: { ship_id_year: { ship_id: shipId, year } },
    })

    const cb_before = compliance?.cb_gco2eq ?? 0
    const cb_after = cb_before + totalBanked

    res.json({
      message: "Applied banked credits successfully",
      newEntry: entry,
      cb_before,
      cb_after,
    })
  } catch (err: any) {
    console.error("Error in /apply:", err)
    res.status(400).json({ error: err.message })
  }
})
