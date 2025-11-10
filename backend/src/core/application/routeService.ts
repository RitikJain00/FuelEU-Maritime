
import type { RouteRepository } from "../ports/RouteRepository";
import type { Route } from "../domain/Route";

export class RouteService {
  constructor(private repo: RouteRepository) {}

  async getAll(year?: number): Promise<Route[]> {
    const routes = await this.repo.findAll();
    if (year) return routes.filter(r => r.year === year);
    return routes;
  }

  async setBaseline(routeIdOrId: string | number): Promise<void> {
    // accept either numeric id or routeId string
    let route = null;
    if (typeof routeIdOrId === "number") {
      route = await this.repo.findById(routeIdOrId);
    } else {
      route = await this.repo.findByRouteId(String(routeIdOrId));
    }
    if (!route) throw new Error("Route not found");

    // set baseline (adapter will clear previous baseline and set this one)
    await this.repo.updateBaselineById(route.id);
  }

  async getComparison(): Promise<
    Array<{
      routeId: string;
      baseline: number;
      comparison: number;
      percentDiff: number;
      compliant: boolean;
    }>
  > {
    const routes = await this.repo.findAll();
    const baseline = routes.find(r => r.isBaseline);
    if (!baseline) return [];

    const baselineVal = baseline.ghgIntensity;
    return routes
      .filter(r => r.id !== baseline.id)
      .map(r => {
        const percentDiff = ((r.ghgIntensity / baselineVal) - 1) * 100;
        const compliant = r.ghgIntensity <= baselineVal;
        return {
          routeId: r.routeId,
          baseline: baselineVal,
          comparison: r.ghgIntensity,
          percentDiff,
          compliant,
        };
      });
  }
}
