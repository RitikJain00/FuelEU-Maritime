"use client"

import { useState, useEffect, useCallback } from "react"
import type { Ship } from "../../../core/domain/models/ship"

export function usePooling(year: number = new Date().getFullYear()) {
  const [ships, setShips] = useState<Ship[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchShips = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/compliance/adjusted-cb?year=${year}`)
        const data = await response.json()
        setShips(data)
      } catch (error) {
        console.error("Failed to fetch ships:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchShips()
  }, [year])

  const createPool = useCallback(
    async (shipIds: string[]) => {
      setLoading(true)
      try {
        await fetch("/api/pools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ members: shipIds, year }),
        })
      } catch (error) {
        console.error("Failed to create pool:", error)
      } finally {
        setLoading(false)
      }
    },
    [year],
  )

  return { ships, loading, createPool }
}
