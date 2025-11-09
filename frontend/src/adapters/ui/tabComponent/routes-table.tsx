"use client"

import { useState } from "react"
import { Button } from "../components/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/table"
import type { Route } from "../../../core/domain/models/Route"

interface RoutesTableProps {
  routes: Route[]
  loading: boolean
  onSetBaseline: (routeId: string) => void
}

export function RoutesTable({ routes, loading, onSetBaseline }: RoutesTableProps) {
  const [settingBaseline, setSettingBaseline] = useState<string | null>(null)

  const handleSetBaseline = async (routeId: string) => {
    setSettingBaseline(routeId)
    await onSetBaseline(routeId)
    setSettingBaseline(null)
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading routes...</div>
  }

  if (routes.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No routes found</div>
  }

  return (
    <div className="border border-border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="font-semibold">Route ID</TableHead>
            <TableHead className="font-semibold">Vessel Type</TableHead>
            <TableHead className="font-semibold">Fuel Type</TableHead>
            <TableHead className="font-semibold text-right">Year</TableHead>
            <TableHead className="font-semibold text-right">GHG (gCO₂e/MJ)</TableHead>
            <TableHead className="font-semibold text-right">Consumption (t)</TableHead>
            <TableHead className="font-semibold text-right">Distance (km)</TableHead>
            <TableHead className="font-semibold text-right">Emissions (t)</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route.routeId} className="hover:bg-muted/50">
              <TableCell className="font-mono text-sm">{route.routeId}</TableCell>
              <TableCell>{route.vesselType}</TableCell>
              <TableCell>{route.fuelType}</TableCell>
              <TableCell className="text-right">{route.year}</TableCell>
              <TableCell className="text-right font-mono">{route.ghgIntensity.toFixed(2)}</TableCell>
              <TableCell className="text-right font-mono">{route.fuelConsumption.toFixed(2)}</TableCell>
              <TableCell className="text-right font-mono">{route.distance.toFixed(0)}</TableCell>
              <TableCell className="text-right font-mono">{route.totalEmissions.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSetBaseline(route.routeId)}
                  disabled={settingBaseline === route.routeId}
                >
                  {settingBaseline === route.routeId ? "Setting..." : "Set Baseline"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
