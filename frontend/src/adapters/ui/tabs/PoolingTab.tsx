"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Button } from "../components//button"
import { Input } from "../components//input"
import { Checkbox } from "../components//checkbox"
import { usePooling } from "../hooks/use-pooiling"

export function PoolingTab() {
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [selectedShips, setSelectedShips] = useState<string[]>([])
  const [poolSum, setPoolSum] = useState(0)
  const [poolMembers, setPoolMembers] = useState<Array<{ shipId: string; cb_before: number; cb_after?: number }>>([])

  const { ships, loading, createPool } = usePooling(Number.parseInt(year))

  useEffect(() => {
    const selected = ships.filter((ship) => selectedShips.includes(ship.shipId))
    const sum = selected.reduce((acc, ship) => acc + ship.adjustedCB, 0)
    setPoolSum(sum)
    setPoolMembers(selected.map((s) => ({ shipId: s.shipId, cb_before: s.adjustedCB })))
  }, [selectedShips, ships])

  const isValid = poolSum >= 0 && selectedShips.length > 0

  const handleToggleShip = (shipId: string) => {
    setSelectedShips((prev) => (prev.includes(shipId) ? prev.filter((id) => id !== shipId) : [...prev, shipId]))
  }

  const handleCreatePool = async () => {
    await createPool(selectedShips)
    setSelectedShips([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Article 21 – Compliance Pooling</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="text-sm font-medium text-foreground">Year</label>
            <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="mt-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Pool Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <p className="text-muted-foreground">Loading ships...</p>
            ) : ships.length === 0 ? (
              <p className="text-muted-foreground">No ships available</p>
            ) : (
              ships.map((ship) => (
                <div
                  key={ship.shipId}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedShips.includes(ship.shipId)}
                    onCheckedChange={() => handleToggleShip(ship.shipId)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{ship.shipId}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>Adjusted CB: {ship.adjustedCB.toFixed(2)}</span>
                    </div>
                  </div>
                  <div
                    className={`text-right text-sm font-medium ${ship.adjustedCB >= 0 ? "text-green-600" : "text-destructive"}`}
                  >
                    {ship.adjustedCB >= 0 ? "↑ Surplus" : "↓ Deficit"}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedShips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pool Members Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {poolMembers.map((member) => (
                <div key={member.shipId} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm font-medium">{member.shipId}</span>
                  <span className="text-sm text-muted-foreground">Before: {member.cb_before.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pool Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`p-4 rounded-lg ${poolSum >= 0 ? "bg-green-500/10 border border-green-500/30" : "bg-destructive/10 border border-destructive/20"}`}
          >
            <p className="text-sm text-muted-foreground">Total Pool CB Sum</p>
            <p className={`text-3xl font-bold ${poolSum >= 0 ? "text-green-600" : "text-destructive"}`}>
              {poolSum.toFixed(2)}
            </p>
            <p className="text-sm mt-2 text-muted-foreground">
              {poolSum >= 0 ? "✓ Pool is compliant (Sum ≥ 0)" : "✗ Pool is invalid (Sum < 0)"}
            </p>
          </div>

          {selectedShips.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-foreground">Validation Rules:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className={poolSum >= 0 ? "text-green-600" : "text-destructive"}>
                  ✓ Sum(CB) ≥ 0: {poolSum >= 0 ? "PASS" : "FAIL"}
                </li>
                <li className="text-green-600">✓ Members selected: {selectedShips.length}</li>
                <li className="text-muted-foreground">
                  • Deficit ships cannot exit worse (protected by greedy allocation)
                </li>
                <li className="text-muted-foreground">
                  • Surplus ships cannot exit negative (protected by greedy allocation)
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedShips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Create Pool</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleCreatePool}
              disabled={!isValid || loading}
              className="w-full"
              variant={isValid ? "default" : "secondary"}
            >
              {loading ? "Creating Pool..." : "Create Pool"}
            </Button>
            {!isValid && poolSum < 0 && (
              <p className="text-sm text-destructive mt-3">Cannot create pool: Sum must be ≥ 0</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
