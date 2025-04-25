"use client"

import { Globe, MapPin, TrendingUp, Wallet, User } from "lucide-react"

interface BottomNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-card rounded-t-xl p-2 mx-auto max-w-md">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setActiveTab("home")}
            className={`nav-item ${activeTab === "home" ? "active" : ""} relative group`}
          >
            <div
              className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${activeTab === "home" ? "bg-primary" : "bg-transparent"}`}
            ></div>
            <Globe
              className={`h-5 w-5 ${activeTab === "home" ? "text-primary" : "text-gray-400"} group-hover:text-primary transition-colors`}
            />
            <span
              className={`text-xs mt-1 ${activeTab === "home" ? "text-primary" : "text-gray-400"} group-hover:text-primary transition-colors`}
            >
              Home
            </span>
          </button>

          <button
            onClick={() => setActiveTab("local")}
            className={`nav-item ${activeTab === "local" ? "active" : ""} relative group`}
          >
            <div
              className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${activeTab === "local" ? "bg-primary" : "bg-transparent"}`}
            ></div>
            <MapPin
              className={`h-5 w-5 ${activeTab === "local" ? "text-primary" : "text-gray-400"} group-hover:text-primary transition-colors`}
            />
            <span
              className={`text-xs mt-1 ${activeTab === "local" ? "text-primary" : "text-gray-400"} group-hover:text-primary transition-colors`}
            >
              Local
            </span>
          </button>

          <button
            onClick={() => setActiveTab("stocks")}
            className={`nav-item ${activeTab === "stocks" ? "active" : ""} relative group`}
          >
            <div
              className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${activeTab === "stocks" ? "bg-primary" : "bg-transparent"}`}
            ></div>
            <TrendingUp
              className={`h-5 w-5 ${activeTab === "stocks" ? "text-primary" : "text-gray-400"} group-hover:text-primary transition-colors`}
            />
            <span
              className={`text-xs mt-1 ${activeTab === "stocks" ? "text-primary" : "text-gray-400"} group-hover:text-primary transition-colors`}
            >
              Stocks
            </span>
          </button>

          <button
            onClick={() => setActiveTab("crypto")}
            className={`nav-item ${activeTab === "crypto" ? "active" : ""} relative group`}
          >
            <div
              className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${activeTab === "crypto" ? "bg-primary" : "bg-transparent"}`}
            ></div>
            <Wallet
              className={`h-5 w-5 ${activeTab === "crypto" ? "text-primary" : "text-gray-400"} group-hover:text-primary transition-colors`}
            />
            <span
              className={`text-xs mt-1 ${activeTab === "crypto" ? "text-primary" : "text-gray-400"} group-hover:text-primary transition-colors`}
            >
              Crypto
            </span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`nav-item ${activeTab === "profile" ? "active" : ""} relative group`}
          >
            <div
              className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${activeTab === "profile" ? "bg-primary" : "bg-transparent"}`}
            ></div>
            <User
              className={`h-5 w-5 ${activeTab === "profile" ? "text-primary" : "text-gray-400"} group-hover:text-primary transition-colors`}
            />
            <span
              className={`text-xs mt-1 ${activeTab === "profile" ? "text-primary" : "text-gray-400"} group-hover:text-primary transition-colors`}
            >
              Profile
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
