"use client"

import { useState } from "react"
import { MapPin, Navigation } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NewsCard } from "./news-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNews } from "@/hooks/use-news"
import { LoadingSpinner } from "./loading-spinner"

export function LocalNewsScreen() {
  const [location, setLocation] = useState("in") // Default to India
  const locationNames = {
    us: "United States",
    gb: "United Kingdom",
    ca: "Canada",
    au: "Australia",
    jp: "Japan",
    fr: "France",
    de: "Germany",
    in: "India",
  }

  const { news, loading, error } = useNews({ country: location })

  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold gold-text">Local News</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Navigation className="h-5 w-5 text-primary" />
        </Button>
      </div>

      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Your Location</p>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="border-none bg-transparent p-0 h-auto">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">India</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="gb">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Today's Headlines</h2>
        <Button variant="ghost" size="sm" className="text-primary">
          See All
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <LoadingSpinner className="py-12" />
        ) : error ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Failed to load news. Please try again later.</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No local news articles found.</p>
          </div>
        ) : (
          news.map((item) => <NewsCard key={item.id} news={item} />)
        )}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Local Events</h2>
        <Button variant="ghost" size="sm" className="text-primary">
          See All
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="glass-card min-w-[250px] flex-shrink-0">
            <CardContent className="p-4">
              <div className="text-primary font-semibold">May {item + 14}, 2025</div>
              <h3 className="font-bold mt-2">{location === "in" ? "Cultural Festival" : "Community Festival"}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {location === "in" ? "India Gate • 4:00 PM" : "Central Park • 2:00 PM"}
              </p>
              <Button variant="outline" className="mt-3 w-full border-primary/30 text-primary hover:bg-primary/10">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
