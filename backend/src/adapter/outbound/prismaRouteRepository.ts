
import { PrismaClient } from "@prisma/client";
import type { RouteRepository } from "../../core/ports/RouteRepository";
import type { Route } from "../../core/domain/Route";

const prisma = new PrismaClient();

export class PrismaRouteRepository implements RouteRepository {
  async findAll(): Promise<Route[]> {
    const rows = await prisma.route.findMany({ orderBy: { id: "asc" } });
    // Prisma's types already align; cast to our Route type
    return rows.map(r => ({
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: Number(r.ghgIntensity),
      fuelConsumption: Number(r.fuelConsumption),
      distance: Number(r.distance),
      totalEmissions: Number(r.totalEmissions),
      isBaseline: r.isBaseline,
    }));
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const r = await prisma.route.findFirst({ where: { routeId } });
    if (!r) return null;
    return {
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: Number(r.ghgIntensity),
      fuelConsumption: Number(r.fuelConsumption),
      distance: Number(r.distance),
      totalEmissions: Number(r.totalEmissions),
      isBaseline: r.isBaseline,
    };
  }

  async findById(id: number): Promise<Route | null> {
    const r = await prisma.route.findUnique({ where: { id } });
    if (!r) return null;
    return {
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: Number(r.ghgIntensity),
      fuelConsumption: Number(r.fuelConsumption),
      distance: Number(r.distance),
      totalEmissions: Number(r.totalEmissions),
      isBaseline: r.isBaseline,
    };
  }

  async updateBaselineById(id: number): Promise<void> {
    // in a transaction: clear previous baseline(s) and set new baseline
    await prisma.$transaction([
      prisma.route.updateMany({ where: {}, data: { isBaseline: false } }),
      prisma.route.update({ where: { id }, data: { isBaseline: true } }),
    ]);
  }
}
