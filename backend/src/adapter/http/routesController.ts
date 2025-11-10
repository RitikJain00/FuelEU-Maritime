import express from "express"
import { PrismaRouteRepository } from "../../adapter/outbound/prismaRouteRepository.js"
import { RouteService } from "../../core/application/routeService.js"

const repo = new PrismaRouteRepository()
const service = new RouteService(repo)

export const routesController = express.Router()

// GET /api/routes
routesController.get("/", async (req, res) => {
  try {
    const year = req.query.year ? Number(req.query.year) : undefined
    const data = await service.getAll(year)
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch routes" })
  }
})

// POST /api/routes/:routeId/baseline
routesController.post("/:routeId/baseline", async (req, res) => {
  try {
    const { routeId } = req.params
    await service.setBaseline(routeId)
    res.status(200).json({ message: "Baseline set" })
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err ?? "Failed to set baseline" })
  }
})

// ✅ GET /api/routes/comparison
routesController.get("/comparison", async (req, res) => {
  try {
    // Get all routes using the service
    const allRoutes = await service.getAll()
    const baseline = allRoutes.find((r) => r.isBaseline)

    if (!baseline) {
      return res.status(400).json({ error: "No baseline route set" })
    }

    const comparison = allRoutes.filter((r) => !r.isBaseline)

    // ✅ Send the exact shape expected by frontend
    res.json({ baseline, comparison })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch comparison data" })
  }
})
