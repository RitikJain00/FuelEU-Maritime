"use client"

import { useState, useEffect } from "react"
import type { Route } from "../../../core/domain/models/Route"

export function useComparison() {
  const [baseline, setBaseline] = useState<Route | null>(null)
  const [comparison, setComparison] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const response = await fetch("/api/routes/comparison")
        const data = await response.json()
        setBaseline(data.baseline)
        setComparison(data.comparison)
        setError(null)
      } catch (err) {
        setError("Failed to fetch comparison data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchComparison()
  }, [])

  return { baseline, comparison, loading, error }
}
