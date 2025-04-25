import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookmarkIcon, Share2Icon, Clock, Globe } from "lucide-react"
import Link from "next/link"

interface NewsProps {
  news: {
    id: number
    title: string
    category: string
    source: string
    time: string
    image: string
    breaking: boolean
    url?: string
    description?: string
  }
}

export function NewsCard({ news }: NewsProps) {
  return (
    <Link href={`/news/${news.id}`} className="block">
      <Card className="glass-card overflow-hidden transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
        <div className="relative">
          <Image
            src={news.image || "/placeholder.svg?height=400&width=600"}
            alt={news.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
          />
          {news.breaking && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500 text-white border-none animate-pulse">Breaking</Badge>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white font-semibold line-clamp-2">{news.title}</h3>
            {news.description && <p className="text-white/80 text-sm mt-1 line-clamp-1">{news.description}</p>}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                {news.category}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground mt-2 gap-3">
                <div className="flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  <span>{news.source}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{news.time}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <BookmarkIcon className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Share2Icon className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
