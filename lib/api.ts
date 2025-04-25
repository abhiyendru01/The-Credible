// API service for GNews
const GNEWS_API_BASE = "https://gnews.io/api/v4"

export type NewsArticle = {
  title: string
  description: string
  content: string
  url: string
  image: string
  publishedAt: string
  source: {
    name: string
    url: string
  }
}

export type NewsResponse = {
  totalArticles: number
  articles: NewsArticle[]
}

export async function fetchTopNews(category?: string, country?: string, max = 10): Promise<NewsArticle[]> {
  try {
    const params = new URLSearchParams({
      apikey: process.env.GNEWS_API_KEY || "",
      max: max.toString(),
      lang: "en",
    })

    if (category) params.append("category", category.toLowerCase())
    if (country) params.append("country", country)

    const response = await fetch(`${GNEWS_API_BASE}/top-headlines?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status}`)
    }

    const data: NewsResponse = await response.json()
    return data.articles
  } catch (error) {
    console.error("Error fetching top news:", error)
    return []
  }
}

export async function searchNews(query: string, max = 10): Promise<NewsArticle[]> {
  try {
    const params = new URLSearchParams({
      apikey: process.env.GNEWS_API_KEY || "",
      q: query,
      max: max.toString(),
      lang: "en",
    })

    const response = await fetch(`${GNEWS_API_BASE}/search?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to search news: ${response.status}`)
    }

    const data: NewsResponse = await response.json()
    return data.articles
  } catch (error) {
    console.error("Error searching news:", error)
    return []
  }
}

// Helper function to format the published date
export function formatPublishedDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
  }

  return date.toLocaleDateString()
}
