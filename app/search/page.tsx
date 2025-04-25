"use client"
import { useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewsCard } from "@/components/news-card"
import { useNews } from "@/hooks/use-news"
import { LoadingSpinner } from "@/components/loading-spinner"
import Link from "next/link"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { news, loading, error } = useNews({ query })

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container px-4 py-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Search Results: {query}</h1>
        </div>

        <div className="space-y-4">
          {loading ? (
            <LoadingSpinner className="py-12" />
          ) : error ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Failed to load search results. Please try again later.</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No results found for "{query}".</p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground">{news.length} results found</p>
              {news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
