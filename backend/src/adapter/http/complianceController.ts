import express from "express"
import { ComplianceService } from "../../core/application/complianceService.js"
import { prisma } from "../../lib/prisma"

const service = new ComplianceService()
export const complianceController = express.Router()

// ✅ GET /api/compliance/cb?shipId=R001&year=2024
complianceController.get("/cb", async (req, res) => {
  try {
    const shipId = req.query.shipId as string
    const year = Number(req.query.year)

    if (!shipId || isNaN(year)) {
      return res.status(400).json({ error: "Missing or invalid shipId/year" })
    }

    const cb = await service.computeCB(shipId, year)
    res.json(cb)
  } catch (err: any) {
    console.error("Error in /cb:", err)
    res.status(400).json({ error: err.message || "Failed to compute compliance balance" })
  }
})

// ✅ GET /api/compliance/adjusted-cb?shipId=R001&year=2024
complianceController.get("/adjusted-cb", async (req, res) => {
  try {
    const year = parseInt(req.query.year as string)
    if (isNaN(year)) {
      return res.status(400).json({ error: "Invalid year parameter" })
    }

    const compliances = await prisma.shipCompliance.findMany({
      where: { year },
      select: { ship_id: true, cb_gco2eq: true },
    })

    const ships = compliances.map((s) => ({
      shipId: s.ship_id,
      adjustedCB: s.cb_gco2eq,
    }))

    return res.json(ships)
  } catch (err: any) {
    console.error("Error fetching adjusted CB:", err)
    res.status(400).json({ error: err.message })
  }
})
