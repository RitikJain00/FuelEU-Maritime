import { useState } from 'react'
import  { RoutesTab }  from './adapters/ui/tabs/RouterTab'
import  { CompareTab }  from './adapters/ui/tabs/CompareTab'
import  { BankingTab } from './adapters/ui/tabs/BankingTab'
import  { PoolingTab } from './adapters/ui/tabs/PoolingTab'
import { DashboardTabs }  from './adapters/ui/tabs/DashboardTabs'
import { ThemeProvider } from "./ThemeProvider"

function App() {
    const [activeTab, setActiveTab] = useState("routes")
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider>
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Fuel EU Compliance Dashboard</h1>
          <p className="text-muted-foreground">Maritime fuel compliance tracking and management</p>
        </header>

         <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab}>
          {activeTab === "routes" && <RoutesTab />}
          {activeTab === "compare" && <CompareTab />}
          {activeTab === "banking" && <BankingTab />}
          {activeTab === "pooling" && <PoolingTab />}
        </DashboardTabs>

      </div>
    </main>
    </ThemeProvider>
  )
}

export default App
