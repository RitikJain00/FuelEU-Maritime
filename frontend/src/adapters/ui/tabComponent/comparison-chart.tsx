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
    <Card className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <CardHeader>
        <CardTitle>GHG Intensity Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" tick={{ fill: "#ccc" }} axisLine={{ stroke: "#666" }} />
              <YAxis tick={{ fill: "#ccc" }} axisLine={{ stroke: "#666" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e1e1e",
                  border: "1px solid #555",
                  color: "#f5f5f5",
                }}
                formatter={(value: number) => `${value.toFixed(2)} gCO₂e/MJ`}
              />
              <Legend wrapperStyle={{ color: "#aaa" }} />
              <ReferenceLine
                y={TARGET_GHG}
                stroke="#ff4d4f"
                strokeDasharray="4 4"
                label={{
                  value: `Target: ${TARGET_GHG.toFixed(2)}`,
                  position: "insideTopLeft",
                  fill: "#ff4d4f",
                  fontSize: 12,
                }}
              />
              {/* ✅ Custom bar colors for dark theme */}
              <Bar
                dataKey="ghgIntensity"
                fill="#3b82f6" // soft blue for route
                name="Route GHG"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="baseline"
                fill="#a855f7" // purple for baseline
                name="Baseline GHG"
                radius={[6, 6, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
