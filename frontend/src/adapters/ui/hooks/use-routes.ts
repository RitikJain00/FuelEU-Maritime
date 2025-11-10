"use client"

import { useState, useEffect } from "react"
import type { Route } from "../../../core/domain/models/Route"

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/routes")
        const data = await response.json()
        setRoutes(data)
      } catch (error) {
        console.error("Failed to fetch routes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoutes()
  }, [])

  const setBaseline = async (routeId: string) => {
    try {
      await fetch(`http://localhost:3000/api/routes/${routeId}/baseline`, { method: "POST" })
    } catch (error) {
      console.error("Failed to set baseline:", error)
    }
  }

  return { routes, loading, setBaseline }
}
