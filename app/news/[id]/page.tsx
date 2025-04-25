"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, BookmarkIcon, Share2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { NewsArticle } from "@/lib/api"
import { formatPublishedDate } from "@/lib/api"

export default function NewsDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      if (!params.id) return

      try {
        // In a real app, we would fetch the specific article by ID
        // For now, we'll simulate it with a delay
        setLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockArticle: NewsArticle = {
          title: "Global Summit Addresses Climate Change Crisis",
          description: "World leaders gather to discuss urgent climate action",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
          url: "https://example.com",
          image: "/placeholder.svg?height=400&width=600",
          publishedAt: new Date().toISOString(),
          source: {
            name: "Global News",
            url: "https://example.com",
          },
        }

        setArticle(mockArticle)
      } catch (err) {
        console.error("Error fetching article:", err)
        setError("Failed to load article")
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">{error || "Article not found"}</p>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container px-4 py-6 space-y-6">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="relative h-[300px] w-full overflow-hidden rounded-xl gold-border">
          <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="p-6">
              <h1 className="text-white text-2xl font-bold">{article.title}</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="text-primary border-primary/30">
              World
            </Badge>
            <div className="text-sm text-muted-foreground mt-1">
              {article.source.name} • {formatPublishedDate(article.publishedAt)}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <BookmarkIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2Icon className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Button>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg font-medium">{article.description}</p>
          <div className="mt-4">{article.content}</div>
        </div>

        <div className="border-t border-primary/20 pt-4">
          <p className="text-sm text-muted-foreground">
            Source:{" "}
            <a
              href={article.source.url}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.source.name}
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
