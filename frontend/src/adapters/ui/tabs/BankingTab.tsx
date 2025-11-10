"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Button } from "../components/button"
import { Input } from "../components/input"
import { useBanking } from "../hooks/use-banking"

export function BankingTab() {
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [applyAmount, setApplyAmount] = useState("")
  const [shipId, setShipId] = useState("S001")

  const { creditBalance, loading, error, fetchCreditBalance, bankCredit, applyCredit } = useBanking()
  const hasInitialized = useRef(false)

  // Initial fetch
  useEffect(() => {
    if (!hasInitialized.current) {
      fetchCreditBalance(shipId, Number(year))
      hasInitialized.current = true
    }
  }, [])

  // Refetch when ship/year changes
  useEffect(() => {
    if (hasInitialized.current) {
      fetchCreditBalance(shipId, Number(year))
    }
  }, [year, shipId, fetchCreditBalance])

  const handleBank = async () => {
    await bankCredit(shipId, Number(year))
  }

  const handleApply = async () => {
    if (!applyAmount) return
    await applyCredit(shipId, Number(parseFloat(applyAmount)), Number(year))
    setApplyAmount("")
  }

  const canBank = (creditBalance?.cb_before ?? 0) > 0
  const canApply = (creditBalance?.cb_before ?? 0) < 0

  // Compute bankedAvailable from creditBalance.bankEntries
  const bankedAvailable =
    creditBalance?.bankEntries?.reduce((sum, entry) => sum + Math.max(entry.amount_gco2eq, 0), 0) ?? 0

  const maxApplyAmount = Math.min(Math.abs(creditBalance?.cb_before ?? 0), bankedAvailable)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Article 20 – Banking & Compliance Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Ship ID</label>
              <Input value={shipId} onChange={(e) => setShipId(e.target.value)} className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Year</label>
              <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="mt-2" />
            </div>

            {creditBalance ? (
              <>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">CB Before</p>
                  <p className={`text-2xl font-bold ${creditBalance.cb_before >= 0 ? "text-green-600" : "text-destructive"}`}>
                    {creditBalance.cb_before.toFixed(2)}
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">CB After</p>
                  <p className={`text-2xl font-bold ${creditBalance.cb_after >= 0 ? "text-green-600" : "text-destructive"}`}>
                    {creditBalance.cb_after.toFixed(2)}
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Banked Available</p>
                  <p className="text-2xl font-bold text-blue-600">{bankedAvailable.toFixed(2)}</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground col-span-2 mt-4">No data found for this ship/year</p>
            )}

            {error && <p className="text-destructive mt-4 text-sm">{error}</p>}
            {loading && <p className="text-muted-foreground mt-4 text-sm">Loading...</p>}
          </div>
        </CardContent>
      </Card>

      {canBank && (
        <Card>
          <CardHeader>
            <CardTitle>Bank Positive Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Available to bank: {creditBalance?.cb_before.toFixed(2)}</p>
            <Button onClick={handleBank} disabled={loading}>
              {loading ? "Processing..." : "Bank All Positive CB"}
            </Button>
          </CardContent>
        </Card>
      )}

      {canApply && (
        <Card>
          <CardHeader>
            <CardTitle>Apply Banked Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Deficit: {Math.abs(creditBalance?.cb_before ?? 0).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Banked available: {bankedAvailable.toFixed(2)}</p>
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                placeholder="Enter amount"
                value={applyAmount}
                onChange={(e) => setApplyAmount(e.target.value)}
                max={maxApplyAmount}
              />
              <Button onClick={handleApply} disabled={loading || !applyAmount || Number(applyAmount) > maxApplyAmount}>
                {loading ? "Processing..." : "Apply"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
