import { Card, CardContent, CardHeader, CardTitle } from "../components/card"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import type { Route } from "../../../core/domain/models/Route"


const TARGET_GHG = 89.3368

interface ComparisonChartProps {
  baseline: Route | null
  comparison: (Route & { percentDiff: number; compliant: boolean })[]
}

export function ComparisonChart({ baseline, comparison }: ComparisonChartProps) {
  const data = comparison.map((route, idx) => ({
    name: `Route ${idx + 1}`,
    ghgIntensity: route.ghgIntensity,
    baseline: baseline?.ghgIntensity || 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>GHG Intensity Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                }}
                formatter={(value: number) => `${value.toFixed(2)} gCO₂e/MJ`}
              />
              <Legend />
              <ReferenceLine
                y={TARGET_GHG}
                stroke="hsl(var(--color-destructive))"
                label={{ value: `Target: ${TARGET_GHG}`, position: "insideTopLeft", offset: -10 }}
              />
              <Bar dataKey="ghgIntensity" fill="hsl(var(--color-chart-1))" name="Route GHG" />
              <Bar dataKey="baseline" fill="hsl(var(--color-chart-2))" name="Baseline GHG" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}


