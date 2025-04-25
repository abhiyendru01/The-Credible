import { type NextRequest, NextResponse } from "next/server"
import { fetchTopNews, searchNews } from "@/lib/api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const category = searchParams.get("category")
  const country = searchParams.get("country")
  const max = searchParams.get("max") ? Number.parseInt(searchParams.get("max")!) : 10

  try {
    if (query) {
      const articles = await searchNews(query, max)
      return NextResponse.json({ articles })
    } else {
      const articles = await fetchTopNews(category || undefined, country || undefined, max)
      return NextResponse.json({ articles })
    }
  } catch (error) {
    console.error("Error in news API route:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
