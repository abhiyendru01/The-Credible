"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BreakingNewsItem {
  id: number
  title: string
  image: string
  description?: string
}

interface BreakingNewsCarouselProps {
  news?: BreakingNewsItem[]
}

export function BreakingNewsCarousel({ news }: BreakingNewsCarouselProps) {
  const [current, setCurrent] = useState(0)

  const breakingNews = news || [
    {
      id: 1,
      title: "Global Leaders Gather for Climate Summit",
      image: "/placeholder.svg?height=400&width=600",
      description: "World leaders meet to discuss urgent climate action measures",
    },
    {
      id: 2,
      title: "Major Breakthrough in Renewable Energy Technology",
      image: "/placeholder.svg?height=400&width=600",
      description: "Scientists announce revolutionary solar energy breakthrough",
    },
    {
      id: 3,
      title: "International Space Mission Discovers New Exoplanet",
      image: "/placeholder.svg?height=400&width=600",
      description: "Potentially habitable planet found orbiting nearby star",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === breakingNews.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [breakingNews.length])

  const next = () => {
    setCurrent((prev) => (prev === breakingNews.length - 1 ? 0 : prev + 1))
  }

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? breakingNews.length - 1 : prev - 1))
  }

  return (
    <div className="relative h-full w-full">
      {breakingNews.map((news, index) => (
        <Link href={`/news/${news.id}`} key={news.id}>
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image src={news.image || "/placeholder.svg"} alt={news.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end">
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                  <span className="text-white text-sm font-bold uppercase tracking-wider">BREAKING NEWS</span>
                </div>
                <h3 className="text-white text-2xl font-bold mb-2">{news.title}</h3>
                {news.description && <p className="text-white/80 line-clamp-2">{news.description}</p>}
              </div>
            </div>
          </div>
        </Link>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 z-10"
        onClick={prev}
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 z-10"
        onClick={next}
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {breakingNews.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${index === current ? "bg-primary w-4" : "bg-white/50"}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  )
}
