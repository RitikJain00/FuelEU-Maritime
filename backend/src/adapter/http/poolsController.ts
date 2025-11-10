// adapter/outbound/poolController.ts
import express from "express"
import { PoolService } from "../../core/application/poolService"

const service = new PoolService()
export const poolController = express.Router()

// GET /api/pools/ships?year=2025
poolController.get("/ships", async (req, res) => {
  try {
    const year = Number(req.query.year)
    if (!year) return res.status(400).json({ error: "Year is required" })

    const ships = await service.getShips(year)
    res.json(ships)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/pools
poolController.post("/", async (req, res) => {
  try {
    const { year, members } = req.body
    if (!year || !Array.isArray(members)) {
      return res.status(400).json({ error: "Invalid payload" })
    }

    const pool = await service.createPool(year, members)
    res.json(pool)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})
