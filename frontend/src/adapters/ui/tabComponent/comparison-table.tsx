"use client"

import type { Route } from "../../../core/domain/models/Route"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/table"

const TARGET_GHG = 89.3368

interface ComparisonTableProps {
  baseline: Route | null
  comparison: (Route & { percentDiff: number; compliant: boolean })[]
}

export function ComparisonTable({ baseline, comparison }: ComparisonTableProps) {
  if (!baseline) {
    return <div className="text-center py-8 text-muted-foreground">Set a baseline to compare routes</div>
  }

  return (
    <div className="border border-border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="font-semibold">Route ID</TableHead>
            <TableHead className="font-semibold text-right">GHG (gCO₂e/MJ)</TableHead>
            <TableHead className="font-semibold text-right">vs Baseline</TableHead>
            <TableHead className="font-semibold text-right">% Difference</TableHead>
            <TableHead className="text-center">Compliant?</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparison.map((route) => (
            <TableRow key={route.routeId} className="hover:bg-muted/50">
              <TableCell className="font-mono text-sm">{route.routeId}</TableCell>
              <TableCell className="text-right font-mono">{route.ghgIntensity.toFixed(2)}</TableCell>
              <TableCell className="text-right font-mono">
                {(route.ghgIntensity - baseline.ghgIntensity).toFixed(2)}
              </TableCell>
              <TableCell
                className={`text-right font-mono ${route.percentDiff > 0 ? "text-destructive" : "text-green-600"}`}
              >
                {route.percentDiff > 0 ? "+" : ""}
                {route.percentDiff.toFixed(2)}%
              </TableCell>
              <TableCell className="text-center">
                <span className={route.compliant ? "text-green-600" : "text-destructive"}>
                  {route.compliant ? "✓ Yes" : "✗ No"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
