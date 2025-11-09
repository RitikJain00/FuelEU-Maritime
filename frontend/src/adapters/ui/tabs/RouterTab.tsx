"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select"
import { RoutesTable } from "../tabComponent/routes-table"
 import { useRoutes } from "../hooks/use-routes"

export function RoutesTab() {
  const [filters, setFilters] = useState({
    vesselType: "all",
    fuelType: "all",
    year: "all",
  })

  const { routes, loading, setBaseline } = useRoutes()

  const filteredRoutes = routes.filter((route) => {
    if (filters.vesselType !== "all" && route.vesselType !== filters.vesselType) return false
    if (filters.fuelType !== "all" && route.fuelType !== filters.fuelType) return false
    if (filters.year !== "all" && route.year.toString() !== filters.year) return false
    return true
  })

  const vesselTypes = [...new Set(routes.map((r) => r.vesselType))]
  const fuelTypes = [...new Set(routes.map((r) => r.fuelType))]
  const years = [...new Set(routes.map((r) => r.year.toString()))].sort()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Vessel Type</label>
              <Select
                value={filters.vesselType}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, vesselType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {vesselTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Fuel Type</label>
              <Select
                value={filters.fuelType}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, fuelType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {fuelTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Year</label>
              <Select value={filters.year} onValueChange={(value) => setFilters((prev) => ({ ...prev, year: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Routes ({filteredRoutes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <RoutesTable routes={filteredRoutes} loading={loading} onSetBaseline={setBaseline} />
        </CardContent>
      </Card>
    </div>
  )
}
