"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Search, Star, Loader2, Clock, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useNews } from "@/hooks/use-news"
import { LoadingSpinner } from "./loading-spinner"

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  isFavorite?: boolean
}

export function StocksScreen() {
  const { toast } = useToast()
  const [watchlist, setWatchlist] = useState<StockData[]>([])
  const [marketIndices, setMarketIndices] = useState<StockData[]>([])
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Fetch stock market news
  const {
    news: stockNews,
    loading: newsLoading,
    error: newsError,
  } = useNews({
    query: "indian stock market nifty sensex",
    max: 10,
  })

  // Load saved watchlist from localStorage
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("stockWatchlist")
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist))
      } catch (e) {
        console.error("Error parsing saved watchlist:", e)
      }
    }
  }, [])

  // Save watchlist to localStorage when it changes
  useEffect(() => {
    if (watchlist.length > 0) {
      localStorage.setItem("stockWatchlist", JSON.stringify(watchlist))
    }
  }, [watchlist])

  useEffect(() => {
    async function fetchStockData() {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call to a stock data provider
        // For now, we'll use mock data but with random variations to simulate real-time updates
        const mockWatchlist = [
          {
            symbol: "RELIANCE",
            name: "Reliance Industries",
            price: 2943.75 + (Math.random() * 50 - 25),
            isFavorite: true,
          },
          {
            symbol: "TCS",
            name: "Tata Consultancy Services",
            price: 3845.21 + (Math.random() * 40 - 20),
            isFavorite: true,
          },
          { symbol: "HDFCBANK", name: "HDFC Bank", price: 1642.87 + (Math.random() * 30 - 15), isFavorite: true },
          { symbol: "INFY", name: "Infosys", price: 1478.75 + (Math.random() * 25 - 12.5), isFavorite: true },
          { symbol: "ICICIBANK", name: "ICICI Bank", price: 1072.82 + (Math.random() * 20 - 10), isFavorite: false },
          {
            symbol: "HINDUNILVR",
            name: "Hindustan Unilever",
            price: 2481.86 + (Math.random() * 35 - 17.5),
            isFavorite: false,
          },
        ].map((stock) => ({
          ...stock,
          change: +(Math.random() * 4 - 2).toFixed(2),
          changePercent: +(Math.random() * 2 - 1).toFixed(2),
        }))

        const mockIndices = [
          { symbol: "^NSEI", name: "Nifty 50", price: 22055.2 + (Math.random() * 80 - 40) },
          { symbol: "^BSESN", name: "Sensex", price: 72500.3 + (Math.random() * 150 - 75) },
          { symbol: "^CNXBANK", name: "Nifty Bank", price: 48428.82 + (Math.random() * 100 - 50) },
          { symbol: "^CNXIT", name: "Nifty IT", price: 34204.34 + (Math.random() * 90 - 45) },
          { symbol: "^CNXAUTO", name: "Nifty Auto", price: 21239.98 + (Math.random() * 70 - 35) },
          { symbol: "^CNXPHARMA", name: "Nifty Pharma", price: 18147.03 + (Math.random() * 60 - 30) },
        ].map((index) => ({
          ...index,
          change: +(Math.random() * 50 - 25).toFixed(2),
          changePercent: +(Math.random() * 1 - 0.5).toFixed(2),
        }))

        // Only update watchlist if it's empty (first load)
        if (watchlist.length === 0) {
          setWatchlist(mockWatchlist)
        } else {
          // Update prices for existing watchlist
          setWatchlist((prev) =>
            prev.map((stock) => {
              const updated = mockWatchlist.find((s) => s.symbol === stock.symbol)
              return updated
                ? { ...stock, price: updated.price, change: updated.change, changePercent: updated.changePercent }
                : stock
            }),
          )
        }

        setMarketIndices(mockIndices)

        if (!selectedStock) {
          setSelectedStock(watchlist.length > 0 ? watchlist[0] : mockWatchlist[0])
        } else {
          // Update selected stock data
          const updatedStock = [...mockWatchlist, ...mockIndices].find((s) => s.symbol === selectedStock.symbol)
          if (updatedStock) {
            setSelectedStock({
              ...selectedStock,
              price: updatedStock.price,
              change: updatedStock.change,
              changePercent: updatedStock.changePercent,
            })
          }
        }
      } catch (error) {
        console.error("Error fetching stock data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch stock data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStockData()

    // Simulate real-time updates every 10 seconds
    const interval = setInterval(fetchStockData, 10000)

    return () => clearInterval(interval)
  }, [toast, watchlist])

  const toggleFavorite = (stock: StockData) => {
    const updatedWatchlist = watchlist.map((s) => (s.symbol === stock.symbol ? { ...s, isFavorite: !s.isFavorite } : s))
    setWatchlist(updatedWatchlist)

    toast({
      title: stock.isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${stock.name} (${stock.symbol}) has been ${stock.isFavorite ? "removed from" : "added to"} your favorites.`,
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
          name: `${searchQuery.toUpperCase()} Ltd.`,
          price: 100 + Math.random() * 900,
          change: +(Math.random() * 10 - 5).toFixed(2),
          changePercent: +(Math.random() * 5 - 2.5).toFixed(2),
          isFavorite: false,
        },
      ]

      setWatchlist((prev) => [...prev, ...results])
      setSelectedStock(results[0])
      setSearchQuery("")
      setIsSearching(false)

      toast({
        title: "Stock added",
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
          <h1 className="text-2xl font-bold gold-text">Indian Stocks</h1>
          <p className="text-sm text-muted-foreground">Live market updates</p>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <Input
            placeholder="Add stock..."
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

      {selectedStock && (
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">{selectedStock.symbol}</h2>
                <p className="text-sm text-muted-foreground">{selectedStock.name}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">₹{selectedStock.price.toFixed(2)}</div>
                <div
                  className={`text-sm flex items-center ${selectedStock.change >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {selectedStock.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {selectedStock.change >= 0 ? "+" : ""}
                  {selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="watchlist">
        <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-md">
          <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
          <TabsTrigger value="market">Market Indices</TabsTrigger>
        </TabsList>
        <TabsContent value="watchlist" className="mt-4 space-y-4">
          {watchlist.map((stock) => (
            <Card
              key={stock.symbol}
              className={`glass-card cursor-pointer transition-all ${
                selectedStock?.symbol === stock.symbol ? "gold-border" : ""
              }`}
              onClick={() => setSelectedStock(stock)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-bold">{stock.symbol}</h3>
                      <Star
                        className={`h-4 w-4 ml-1 cursor-pointer ${stock.isFavorite ? "text-primary fill-primary" : "text-muted-foreground"}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(stock)
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{stock.price.toFixed(2)}</div>
                    <div
                      className={`text-sm flex items-center ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {stock.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="market" className="mt-4 space-y-4">
          {marketIndices.map((index) => (
            <Card
              key={index.symbol}
              className={`glass-card cursor-pointer transition-all ${
                selectedStock?.symbol === index.symbol ? "gold-border" : ""
              }`}
              onClick={() => setSelectedStock(index)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{index.name}</h3>
                    <p className="text-sm text-muted-foreground">{index.symbol}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{index.price.toFixed(2)}</div>
                    <div
                      className={`text-sm flex items-center ${index.change >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {index.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {index.change >= 0 ? "+" : ""}
                      {index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Market News</h2>
      </div>

      <div className="space-y-4">
        {newsLoading ? (
          <LoadingSpinner className="py-12" />
        ) : newsError ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Failed to load market news. Please try again later.</p>
          </div>
        ) : stockNews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No market news available.</p>
          </div>
        ) : (
          stockNews.map((article, index) => (
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
                    Market
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
