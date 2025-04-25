"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Search, Star, Loader2, Clock, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { useNews } from "@/hooks/use-news"
import { LoadingSpinner } from "./loading-spinner"
import Image from "next/image"

interface CryptoData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  icon: string
  isFavorite?: boolean
}

export function CryptoScreen() {
  const { toast } = useToast()
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Fetch crypto news
  const {
    news: cryptoNews,
    loading: newsLoading,
    error: newsError,
  } = useNews({
    query: "cryptocurrency bitcoin ethereum blockchain",
    max: 15,
  })

  // Load saved cryptos from localStorage
  useEffect(() => {
    const savedCryptos = localStorage.getItem("cryptoWatchlist")
    if (savedCryptos) {
      try {
        setCryptos(JSON.parse(savedCryptos))
      } catch (e) {
        console.error("Error parsing saved crypto watchlist:", e)
      }
    }
  }, [])

  // Save cryptos to localStorage when it changes
  useEffect(() => {
    if (cryptos.length > 0) {
      localStorage.setItem("cryptoWatchlist", JSON.stringify(cryptos))
    }
  }, [cryptos])

  useEffect(() => {
    async function fetchCryptoData() {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call to a crypto data provider
        // For now, we'll use mock data but with random variations to simulate real-time updates
        const mockCryptos = [
          {
            symbol: "BTC",
            name: "Bitcoin",
            price: 62483.75 + (Math.random() * 1000 - 500),
            icon: "₿",
            isFavorite: true,
          },
          { symbol: "ETH", name: "Ethereum", price: 3045.21 + (Math.random() * 100 - 50), icon: "Ξ", isFavorite: true },
          { symbol: "SOL", name: "Solana", price: 142.87 + (Math.random() * 10 - 5), icon: "◎", isFavorite: false },
          {
            symbol: "ADA",
            name: "Cardano",
            price: 0.45 + (Math.random() * 0.05 - 0.025),
            icon: "₳",
            isFavorite: false,
          },
          { symbol: "DOT", name: "Polkadot", price: 6.78 + (Math.random() * 0.5 - 0.25), icon: "●", isFavorite: false },
          {
            symbol: "DOGE",
            name: "Dogecoin",
            price: 0.15 + (Math.random() * 0.02 - 0.01),
            icon: "Ð",
            isFavorite: false,
          },
        ].map((crypto) => ({
          ...crypto,
          change: +(Math.random() * 200 - 100).toFixed(2),
          changePercent: +(Math.random() * 8 - 4).toFixed(2),
        }))

        // Only update cryptos if it's empty (first load)
        if (cryptos.length === 0) {
          setCryptos(mockCryptos)
        } else {
          // Update prices for existing cryptos
          setCryptos((prev) =>
            prev.map((crypto) => {
              const updated = mockCryptos.find((c) => c.symbol === crypto.symbol)
              return updated
                ? {
                    ...crypto,
                    price: updated.price,
                    change: updated.change,
                    changePercent: updated.changePercent,
                  }
                : crypto
            }),
          )
        }

        if (!selectedCrypto) {
          setSelectedCrypto(cryptos.length > 0 ? cryptos[0] : mockCryptos[0])
        } else {
          // Update selected crypto data
          const updatedCrypto = mockCryptos.find((c) => c.symbol === selectedCrypto.symbol)
          if (updatedCrypto) {
            setSelectedCrypto({
              ...selectedCrypto,
              price: updatedCrypto.price,
              change: updatedCrypto.change,
              changePercent: updatedCrypto.changePercent,
            })
          }
        }
      } catch (error) {
        console.error("Error fetching crypto data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch cryptocurrency data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCryptoData()

    // Simulate real-time updates every 8 seconds
    const interval = setInterval(fetchCryptoData, 8000)

    return () => clearInterval(interval)
  }, [cryptos, toast, selectedCrypto])

  const toggleFavorite = (crypto: CryptoData) => {
    const updatedCryptos = cryptos.map((c) => (c.symbol === crypto.symbol ? { ...c, isFavorite: !c.isFavorite } : c))
    setCryptos(updatedCryptos)

    toast({
      title: crypto.isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${crypto.name} (${crypto.symbol}) has been ${crypto.isFavorite ? "removed from" : "added to"} your favorites.`,
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate search API call
    setTimeout(() => {
      const results = [
        {
          symbol: searchQuery.toUpperCase(),
          name: `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1).toLowerCase()}coin`,
          price: 10 + Math.random() * 90,
          change: +(Math.random() * 10 - 5).toFixed(2),
          changePercent: +(Math.random() * 15 - 7.5).toFixed(2),
          icon: searchQuery.charAt(0).toUpperCase(),
          isFavorite: false,
        },
      ]

      setCryptos((prev) => [...prev, ...results])
      setSelectedCrypto(results[0])
      setSearchQuery("")
      setIsSearching(false)

      toast({
        title: "Cryptocurrency added",
        description: `${results[0].name} (${results[0].symbol}) has been added to your watchlist.`,
      })
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-6 flex justify-center items-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gold-text">Crypto</h1>
          <p className="text-sm text-muted-foreground">Live cryptocurrency updates</p>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <Input
            placeholder="Add crypto..."
            className="w-32 h-9 pl-8 glass-card border-primary/20 focus:border-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {isSearching && (
            <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
          )}
        </form>
      </div>

      {selectedCrypto && (
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {selectedCrypto.icon}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{selectedCrypto.symbol}</h2>
                  <p className="text-sm text-muted-foreground">{selectedCrypto.name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">
                  ${selectedCrypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div
                  className={`text-sm flex items-center ${
                    selectedCrypto.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {selectedCrypto.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {selectedCrypto.change >= 0 ? "+" : ""}
                  {selectedCrypto.change.toFixed(2)} ({selectedCrypto.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Top Cryptocurrencies</h2>
        <Button variant="ghost" size="sm" className="text-primary">
          See All
        </Button>
      </div>

      <div className="space-y-4">
        {cryptos.map((crypto) => (
          <Card
            key={crypto.symbol}
            className={`glass-card cursor-pointer transition-all ${
              selectedCrypto?.symbol === crypto.symbol ? "gold-border" : ""
            }`}
            onClick={() => setSelectedCrypto(crypto)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {crypto.icon}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-bold">{crypto.symbol}</h3>
                      <Star
                        className={`h-4 w-4 ml-1 cursor-pointer ${crypto.isFavorite ? "text-primary fill-primary" : "text-muted-foreground"}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(crypto)
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{crypto.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    ${crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`text-sm flex items-center ${crypto.change >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {crypto.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {crypto.change >= 0 ? "+" : ""}
                    {crypto.change.toFixed(2)} ({crypto.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Crypto News</h2>
      </div>

      <div className="space-y-4">
        {newsLoading ? (
          <LoadingSpinner className="py-12" />
        ) : newsError ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Failed to load crypto news. Please try again later.</p>
          </div>
        ) : cryptoNews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No crypto news available.</p>
          </div>
        ) : (
          cryptoNews.map((article, index) => (
            <Card key={index} className="glass-card overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {article.image && (
                  <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4 w-full md:w-2/3">
                  <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/30">
                    Crypto
                  </Badge>
                  <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{article.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Globe className="h-3 w-3 mr-1" />
                      <span>{article.source}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{article.time}</span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
