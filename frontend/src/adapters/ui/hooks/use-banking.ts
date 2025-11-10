"use client"

import { useState, useCallback } from "react"
import type { CreditBalance } from "../../../core/domain/models/credit-balance"

export function useBanking() {
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCreditBalance = useCallback(async (shipId: string, year: number) => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/api/banking/records?shipId=${shipId}&year=${year}`)
      const data = await response.json()
      setCreditBalance(data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch credit balance")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const bankCredit = useCallback(async (shipId: string, amount: number, year: number) => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:3000/api/banking/bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipId, amount, year }),
      })
      const data = await response.json()
      setCreditBalance(data)
      setError(null)
    } catch (err) {
      setError("Failed to bank credit")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const applyCredit = useCallback(async (shipId: string, amount: number, year: number) => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:3000/api/banking/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipId, amount, year }),
      })
      const data = await response.json()
      setCreditBalance(data)
      setError(null)
    } catch (err) {
      setError("Failed to apply credit")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    creditBalance,
    loading,
    error,
    fetchCreditBalance,
    bankCredit,
    applyCredit,
  }
}
