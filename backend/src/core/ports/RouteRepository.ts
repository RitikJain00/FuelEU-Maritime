import type { Route } from "../domain/Route";

export interface RouteRepository {
  findAll(): Promise<Route[]>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findById(id: number): Promise<Route | null>;
  updateBaselineById(id: number): Promise<void>;
}