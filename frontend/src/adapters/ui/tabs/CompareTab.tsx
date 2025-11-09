"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { ComparisonChart } from "../tabComponent/comparison-chart"
import { ComparisonTable } from "../tabComponent/comparison-table"
import { useComparison } from "../hooks/use-comparison"

const TARGET_GHG = 89.3368

export function CompareTab() {
  const { baseline, comparison, loading, error } = useComparison()

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading comparison data...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>
  }

  const comparisonData = comparison.map((route) => ({
    ...route,
    percentDiff: baseline ? (route.ghgIntensity / baseline.ghgIntensity - 1) * 100 : 0,
    compliant: route.ghgIntensity <= TARGET_GHG,
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Target GHG</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{TARGET_GHG.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">gCO₂e/MJ</p>
          </CardContent>
        </Card>

        {baseline && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Baseline GHG</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{baseline.ghgIntensity.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">gCO₂e/MJ</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Required Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{((1 - TARGET_GHG / baseline.ghgIntensity) * 100).toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">From baseline</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <ComparisonChart baseline={baseline} comparison={comparisonData} />

      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ComparisonTable baseline={baseline} comparison={comparisonData} />
        </CardContent>
      </Card>
    </div>
  )
}
