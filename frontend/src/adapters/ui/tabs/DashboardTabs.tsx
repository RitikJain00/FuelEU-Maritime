import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs"



interface DashboardTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  children: React.ReactNode
}

export function DashboardTabs({ activeTab, setActiveTab, children }: DashboardTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-4">
        <TabsTrigger value="routes">Routes</TabsTrigger>
        <TabsTrigger value="compare">Compare</TabsTrigger>
        <TabsTrigger value="banking">Banking</TabsTrigger>
        <TabsTrigger value="pooling">Pooling</TabsTrigger>
      </TabsList>
      <TabsContent value={activeTab} className="mt-6">
        {children}
      </TabsContent>
    </Tabs>
  )
}