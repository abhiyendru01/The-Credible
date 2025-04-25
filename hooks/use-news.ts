"use client"

import { useState, useEffect } from "react"
import type { NewsArticle } from "@/lib/api"
import { formatPublishedDate } from "@/lib/api"

interface UseNewsOptions {
  category?: string
  country?: string
  query?: string
  max?: number
}

export function useNews({ category, country, query, max = 10 }: UseNewsOptions = {}) {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        if (category) params.append("category", category)
        if (country) params.append("country", country)
        if (query) params.append("q", query)
        if (max) params.append("max", max.toString())

        const response = await fetch(`/api/news?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`)
        }

        const data = await response.json()
        setNews(data.articles || [])
      } catch (err) {
        console.error("Error fetching news:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch news")
        setNews([])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [category, country, query, max])

  // Transform the news data to match our UI components
  const transformedNews = news.map((article, index) => ({
    id: index + 1,
    title: article.title,
    description: article.description,
    content: article.content,
    category: category || "General",
    source: article.source.name,
    time: formatPublishedDate(article.publishedAt),
    image: article.image || "/placeholder.svg?height=400&width=600",
    url: article.url,
    breaking: index < 3, // Mark the first 3 articles as breaking news
  }))

  return { news: transformedNews, loading, error }
}
