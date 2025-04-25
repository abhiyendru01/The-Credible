"use client"

import { useState, useEffect } from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { HomeScreen } from "@/components/home-screen"
import { LocalNewsScreen } from "@/components/local-news-screen"
import { StocksScreen } from "@/components/stocks-screen"
import { CryptoScreen } from "@/components/crypto-screen"
import { ProfileScreen } from "@/components/profile-screen"
import { Loader2 } from "lucide-react"
import { ToastContainer } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")
  const [isLoading, setIsLoading] = useState(true)
  const { toasts, dismiss } = useToast()

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <h2 className="text-xl font-bold gold-text">The Credible</h2>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 pb-16">
        {activeTab === "home" && <HomeScreen />}
        {activeTab === "local" && <LocalNewsScreen />}
        {activeTab === "stocks" && <StocksScreen />}
        {activeTab === "crypto" && <CryptoScreen />}
        {activeTab === "profile" && <ProfileScreen />}
      </div>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </main>
  )
}
