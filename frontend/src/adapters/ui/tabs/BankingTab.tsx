"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Button } from "../components/button"
import { Input } from "../components/input"
import { useBanking } from "../hooks/use-banking"

export function BankingTab() {
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [bankAmount, setBankAmount] = useState("")
  const [applyAmount, setApplyAmount] = useState("")
  const [shipId, setShipId] = useState("SHIP-001")

  const { creditBalance, loading, error, fetchCreditBalance, bankCredit, applyCredit } = useBanking()
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (!hasInitialized.current) {
      fetchCreditBalance(shipId, Number.parseInt(year))
      hasInitialized.current = true
    }
  }, [])

  useEffect(() => {
    if (hasInitialized.current) {
      fetchCreditBalance(shipId, Number.parseInt(year))
    }
  }, [year, shipId, fetchCreditBalance])

  const handleBank = async () => {
    if (!bankAmount) return
    await bankCredit(shipId, Number.parseFloat(bankAmount), Number.parseInt(year))
    setBankAmount("")
  }

  const handleApply = async () => {
    if (!applyAmount) return
    await applyCredit(shipId, Number.parseFloat(applyAmount), Number.parseInt(year))
    setApplyAmount("")
  }

  const canBank = creditBalance && creditBalance.cb_before > 0
  const canApply = creditBalance && creditBalance.cb_before < 0
  const maxBankAmount = creditBalance?.cb_before || 0
  const bankedAvailable = 50.5 // Mock value

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
              <Input
                value={shipId}
                onChange={(e) => setShipId(e.target.value)}
                className="mt-2"
                placeholder="e.g., SHIP-001"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Year</label>
              <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="mt-2" />
            </div>
            {creditBalance && (
              <>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">CB Before</p>
                  <p
                    className={`text-2xl font-bold ${creditBalance.cb_before >= 0 ? "text-green-600" : "text-destructive"}`}
                  >
                    {creditBalance.cb_before.toFixed(2)}
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">CB After</p>
                  <p
                    className={`text-2xl font-bold ${creditBalance.cb_after >= 0 ? "text-green-600" : "text-destructive"}`}
                  >
                    {creditBalance.cb_after.toFixed(2)}
                  </p>
                </div>
              </>
            )}
          </div>
          {error && <p className="text-destructive mt-4 text-sm">{error}</p>}
          {loading && <p className="text-muted-foreground mt-4 text-sm">Loading...</p>}
        </CardContent>
      </Card>

      {canBank && (
        <Card>
          <CardHeader>
            <CardTitle>Bank Positive Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Available to bank: {maxBankAmount.toFixed(2)}</p>
              <div>
                <label className="text-sm font-medium text-foreground">Amount to Bank</label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={bankAmount}
                    onChange={(e) => setBankAmount(e.target.value)}
                    max={maxBankAmount}
                  />
                  <Button
                    onClick={handleBank}
                    disabled={!bankAmount || loading || Number.parseFloat(bankAmount) > maxBankAmount}
                  >
                    {loading ? "Processing..." : "Bank"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {canApply && (
        <Card>
          <CardHeader>
            <CardTitle>Apply Banked Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-destructive">
                  Deficit: {Math.abs(creditBalance?.cb_before || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Banked available: {bankedAvailable.toFixed(2)}</p>
                <label className="text-sm font-medium text-foreground">Amount to Apply</label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={applyAmount}
                    onChange={(e) => setApplyAmount(e.target.value)}
                    max={bankedAvailable}
                  />
                  <Button
                    onClick={handleApply}
                    disabled={!applyAmount || loading || Number.parseFloat(applyAmount) > bankedAvailable}
                  >
                    {loading ? "Processing..." : "Apply"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
