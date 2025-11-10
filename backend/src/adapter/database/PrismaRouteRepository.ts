// src/adapters/outbound/prismaRouteRepository.ts
import { PrismaClient } from "@prisma/client";
import type { RouteRepository } from "../../core/ports/RouteRepository";
import type { Route } from "../../core/domain/Route.js";

const prisma = new PrismaClient();

export class PrismaRouteRepository implements RouteRepository {
  async findAll(): Promise<Route[]> {
    return prisma.route.findMany();
  }

  async findByYear(year: number): Promise<Route[]> {
    return prisma.route.findMany({ where: { year } });
  }

  async findById(id: number): Promise<Route | null> {
    return prisma.route.findUnique({ where: { id } });
  }

  // ✅ Add missing methods

  async findByRouteId(routeId: string): Promise<Route | null> {
    return prisma.route.findFirst({ where: { routeId } });
  }

  async updateBaselineById(id: number): Promise<void> {
    // Clear existing baseline and set new one atomically
    await prisma.$transaction([
      prisma.route.updateMany({ where: {}, data: { isBaseline: false } }),
      prisma.route.update({ where: { id }, data: { isBaseline: true } }),
    ]);
  }
}
