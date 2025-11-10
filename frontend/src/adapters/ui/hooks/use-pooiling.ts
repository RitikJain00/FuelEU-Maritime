"use client"

import { useState, useEffect, useCallback } from "react"

export interface Ship {
  shipId: string
  adjustedCB: number
}

export interface PoolMemberInput {
  shipId: string
  cb_before: number
}

export function usePooling(year: number = new Date().getFullYear()) {
  const [ships, setShips] = useState<Ship[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchShips = async () => {
      setLoading(true)
      try {
        const res = await fetch(`http://localhost:3000/api/compliance/adjusted-cb?year=${year}`)
        const data = await res.json()
        if (!Array.isArray(data)) {
          console.error("Unexpected response:", data)
          setShips([])
          return
        }
        setShips(data)
      } catch (error) {
        console.error("Failed to fetch ships:", error)
        setShips([])
      } finally {
        setLoading(false)
      }
    }

    fetchShips()
  }, [year])

  const createPool = useCallback(
    async (selectedShips: Ship[]) => {
      if (selectedShips.length === 0) return
      setLoading(true)
      try {
        const members: PoolMemberInput[] = selectedShips.map((s) => ({
          shipId: s.shipId,
          cb_before: s.adjustedCB,
        }))

        const response = await fetch("http://localhost:3000/api/pools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ year, members }),
        })

        const data = await response.json()
        if (!response.ok) {
          console.error("Failed to create pool:", data.error || data)
        } else {
          console.log("Pool created:", data)
        }
      } catch (error) {
        console.error("Failed to create pool:", error)
      } finally {
        setLoading(false)
      }
    },
    [year]
  )

  return { ships, loading, createPool }
}
