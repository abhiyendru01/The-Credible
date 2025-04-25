"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Bell, Filter, Sun, Sunrise, Sunset, Moon, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NewsCard } from "./news-card"
import { BreakingNewsCarousel } from "./breaking-news-carousel"
import { useNews } from "@/hooks/use-news"
import { LoadingSpinner } from "./loading-spinner"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

export function HomeScreen() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [greeting, setGreeting] = useState("")
  const [greetingIcon, setGreetingIcon] = useState<React.ReactNode>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  const categories = ["All", "World", "Business", "Technology", "Entertainment", "Sports", "Science", "Health"]

  const { news, loading, error } = useNews({
    category: selectedCategory !== "All" ? selectedCategory : undefined,
  })

  const breakingNews = news?.filter((item) => item?.breaking) || []

  useEffect(() => {
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Set greeting based on time of day
    const hour = currentTime.getHours()

    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning")
      setGreetingIcon(<Sunrise className="h-6 w-6 text-primary mr-2" />)
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon")
      setGreetingIcon(<Sun className="h-6 w-6 text-primary mr-2" />)
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good Evening")
      setGreetingIcon(<Sunset className="h-6 w-6 text-primary mr-2" />)
    } else {
      setGreeting("Good Night")
      setGreetingIcon(<Moon className="h-6 w-6 text-primary mr-2" />)
    }
  }, [currentTime])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {greetingIcon}
            <h1 className="text-2xl font-bold gold-text">{greeting}</h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5 text-primary" />
          </Button>
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-xl">{currentTime.getDate()}</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString(undefined, { weekday: "long" })}
            </p>
            <p className="font-medium">
              {currentTime.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for news..."
            className="pl-10 glass-card border-primary/20 focus:border-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Breaking News</h2>
        <Button variant="ghost" size="sm" className="text-primary">
          See All
        </Button>
      </div>

      <div className="h-[250px] relative overflow-hidden rounded-xl gold-border glow">
        {loading ? (
          <LoadingSpinner className="h-full" />
        ) : (
          <BreakingNewsCarousel news={breakingNews.length > 0 ? breakingNews : undefined} />
        )}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Global News</h2>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Filter className="h-4 w-4 text-primary" />
        </Button>
      </div>

      {/* Replaced 3D Globe with a static card */}
      <Card className="glass-card rounded-xl overflow-hidden">
        <CardContent className="p-4 flex flex-col items-center justify-center h-[200px]">
          <Globe className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-medium text-center">Global News Coverage</h3>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Stay informed with the latest news from around the world
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Explore</h2>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedCategory === category ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <LoadingSpinner className="py-12" />
        ) : error ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Failed to load news. Please try again later.</p>
          </div>
        ) : news?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No news articles found.</p>
          </div>
        ) : (
          news?.map((item) => <NewsCard key={item.id} news={item} />)
        )}
      </div>
    </div>
  )
}
