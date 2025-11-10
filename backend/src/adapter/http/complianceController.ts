import express from "express"
import { ComplianceService } from "../../core/application/complianceService.js"

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
    const shipId = req.query.shipId as string
    const year = Number(req.query.year)

    if (!shipId || isNaN(year)) {
      return res.status(400).json({ error: "Missing or invalid shipId/year" })
    }

    const result = await service.getAdjustedCB(shipId, year)
    res.json(result)
  } catch (err: any) {
    console.error("Error in /adjusted-cb:", err)
    res.status(400).json({ error: err.message || "Failed to get adjusted compliance balance" })
  }
})
